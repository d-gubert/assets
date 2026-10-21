#!/usr/bin/env python3
"""Train the toy model of the "Life of a Token" simulation and export it.

The script does four things:

1. It builds a small corpus of chat transcripts about sixteen animals.
2. It trains a byte-level BPE tokenizer on that corpus. The tokenizer uses the
   Llama 3 pre-tokenizer regex and the Llama 3 special tokens.
3. It trains a 4-layer Llama-style transformer: RMSNorm, RoPE, grouped-query
   attention, and a SwiGLU MLP, with no bias terms.
4. It checks every answer with greedy decoding, rounds the weights to float16,
   and writes ../toy-model.js for the browser.

Usage:  python train_toy_model.py
Needs:  torch and regex (see requirements.txt). A laptop CPU trains it in minutes.
"""

import argparse
import base64
import datetime
import json
import math
import random
import time
from collections import Counter
from pathlib import Path

import regex
import torch
import torch.nn as nn
import torch.nn.functional as F

HERE = Path(__file__).resolve().parent
OUT_FILE = HERE.parent / "toy-model.js"

# The Llama 3 pre-tokenizer pattern, from meta-llama/llama3, llama/tokenizer.py.
PATTERN = (
    r"(?i:'s|'t|'re|'ve|'m|'ll|'d)|[^\r\n\p{L}\p{N}]?\p{L}+|\p{N}{1,3}"
    r"| ?[^\s\p{L}\p{N}]+[\r\n]*|\s*[\r\n]+|\s+(?!\S)|\s+"
)

# The Llama 3 chat-format tokens. The toy vocabulary puts them after the merges.
SPECIAL_NAMES = [
    "<|begin_of_text|>",
    "<|end_of_text|>",
    "<|start_header_id|>",
    "<|end_header_id|>",
    "<|eot_id|>",
]
STOP_NAMES = ["<|end_of_text|>", "<|eot_id|>"]

# ---------------------------------------------------------------------------
# 1. Corpus
# ---------------------------------------------------------------------------

# name: (sound, food, home, legs)
ANIMALS = {
    "cat": ("meow", "fish", "house", "four"),
    "dog": ("woof", "bones", "kennel", "four"),
    "cow": ("moo", "grass", "barn", "four"),
    "duck": ("quack", "bread", "pond", "two"),
    "sheep": ("baa", "grass", "field", "four"),
    "pig": ("oink", "corn", "sty", "four"),
    "horse": ("neigh", "hay", "stable", "four"),
    "owl": ("hoot", "mice", "tree", "two"),
    "frog": ("ribbit", "flies", "pond", "four"),
    "bee": ("buzz", "nectar", "hive", "six"),
    "lion": ("roar", "meat", "den", "four"),
    "mouse": ("squeak", "cheese", "hole", "four"),
    "bird": ("tweet", "seeds", "nest", "two"),
    "bear": ("growl", "honey", "cave", "four"),
    "fox": ("yip", "berries", "den", "four"),
    "hen": ("cluck", "corn", "coop", "two"),
}

QUESTIONS = {
    "sound": ["What does the {a} say?", "What sound does the {a} make?"],
    "food": ["What does the {a} eat?", "What food does the {a} like?"],
    "home": ["Where does the {a} live?", "Where is the home of the {a}?"],
    "legs": ["How many legs does the {a} have?"],
    "about": ["Tell me about the {a}.", "Describe the {a}."],
}

ANSWERS = {
    "sound": "The {a} says {sound}.",
    "food": "The {a} eats {food}.",
    "home": "The {a} lives in a {home}.",
    "legs": "The {a} has {legs} legs.",
    "about": "The {a} says {sound}. The {a} eats {food}. The {a} lives in a {home}.",
}

PICK_QUESTIONS = ["Pick an animal.", "Name an animal."]
PICK_ANSWER = "I pick the {a}."

# One to three random facts. After each sentence the model must guess if the
# answer goes on, so its stop decision is uncertain: 50% after one fact.
FACT_QUESTIONS = ["Tell me a fact.", "Tell me something about animals."]
FACT_COUNT_WEIGHTS = [0.5, 0.3, 0.2]

SMALL_TALK = [
    (["Hello!", "Hi!"], "Hello! How can I help you?"),
    (["Who are you?"], "I am a tiny language model. I know a few facts about animals."),
    (["What can you do?"], "I can answer questions about animals."),
    (["Thank you!", "Thanks!"], "You are welcome!"),
    (["Goodbye!", "Bye!"], "Goodbye!"),
]


def facts(animal):
    sound, food, home, legs = ANIMALS[animal]
    return dict(a=animal, sound=sound, food=food, home=home, legs=legs)


def all_pairs():
    """Every canonical (question, answer) pair, with no augmentation."""
    pairs = []
    for animal in ANIMALS:
        for relation, templates in QUESTIONS.items():
            for template in templates:
                pairs.append((template.format(a=animal), ANSWERS[relation].format(**facts(animal)), relation))
    for questions, answer in SMALL_TALK:
        for question in questions:
            pairs.append((question, answer, "small talk"))
    return pairs


def augment(question, rng):
    """Vary the surface form a little, so typed prompts also work."""
    if rng.random() < 0.2:
        question = question[0].lower() + question[1:]
    if rng.random() < 0.15 and question[-1] in "?.!":
        question = question[:-1]
    return question


def random_fact(rng):
    relation = rng.choice(["sound", "food", "home", "legs"])
    return ANSWERS[relation].format(**facts(rng.choice(list(ANIMALS))))


def sample_conversation(rng):
    roll = rng.random()
    if roll < 0.55:
        animal = rng.choice(list(ANIMALS))
        relation = rng.choices(["sound", "food", "home", "legs"], weights=[1, 1, 1, 0.7])[0]
        question = rng.choice(QUESTIONS[relation]).format(a=animal)
        answer = ANSWERS[relation].format(**facts(animal))
    elif roll < 0.69:
        animal = rng.choice(list(ANIMALS))
        question = rng.choice(QUESTIONS["about"]).format(a=animal)
        answer = ANSWERS["about"].format(**facts(animal))
    elif roll < 0.79:
        # The answer is a uniform random animal, so the model learns a spread-out
        # distribution here. This is the case where the sampler settings matter.
        question = rng.choice(PICK_QUESTIONS)
        answer = PICK_ANSWER.format(a=rng.choice(list(ANIMALS)))
    elif roll < 0.88:
        question = rng.choice(FACT_QUESTIONS)
        count = rng.choices([1, 2, 3], weights=FACT_COUNT_WEIGHTS)[0]
        answer = " ".join(random_fact(rng) for _ in range(count))
    else:
        questions, answer = rng.choice(SMALL_TALK)
        question = rng.choice(questions)
    return augment(question, rng), answer


# ---------------------------------------------------------------------------
# 2. Tokenizer: byte-level BPE, as in minbpe's RegexTokenizer
# ---------------------------------------------------------------------------


def merge(ids, pair, new_id):
    out, i = [], 0
    while i < len(ids):
        if i < len(ids) - 1 and ids[i] == pair[0] and ids[i + 1] == pair[1]:
            out.append(new_id)
            i += 2
        else:
            out.append(ids[i])
            i += 1
    return out


class Tokenizer:
    def __init__(self, merges):
        self.merges = [tuple(m) for m in merges]
        self.ranks = {pair: 256 + i for i, pair in enumerate(self.merges)}
        self.vocab = {i: bytes([i]) for i in range(256)}
        for pair, idx in self.ranks.items():
            self.vocab[idx] = self.vocab[pair[0]] + self.vocab[pair[1]]
        first_special = 256 + len(self.merges)
        self.special = {name: first_special + i for i, name in enumerate(SPECIAL_NAMES)}
        for name, idx in self.special.items():
            self.vocab[idx] = name.encode("utf-8")
        self.vocab_size = first_special + len(SPECIAL_NAMES)

    @staticmethod
    def train(chunk_counts, num_merges):
        words = {chunk: list(chunk.encode("utf-8")) for chunk in chunk_counts}
        merges = []
        for i in range(num_merges):
            pair_counts = Counter()
            for chunk, ids in words.items():
                for pair in zip(ids, ids[1:]):
                    pair_counts[pair] += chunk_counts[chunk]
            if not pair_counts:
                break
            # The most frequent pair wins. Ties go to the smallest pair, so the
            # result does not depend on dictionary order.
            pair, count = min(pair_counts.items(), key=lambda kv: (-kv[1], kv[0]))
            if count < 2:
                break
            merges.append(pair)
            for chunk in words:
                words[chunk] = merge(words[chunk], pair, 256 + i)
        return Tokenizer(merges)

    def encode_chunk(self, chunk):
        ids = list(chunk.encode("utf-8"))
        while len(ids) >= 2:
            pairs = set(zip(ids, ids[1:]))
            pair = min(pairs, key=lambda p: self.ranks.get(p, float("inf")))
            if pair not in self.ranks:
                break
            ids = merge(ids, pair, self.ranks[pair])
        return ids

    def encode(self, text):
        """Encode plain text. Special-token strings in the text stay plain text."""
        ids = []
        for chunk in regex.findall(PATTERN, text):
            ids.extend(self.encode_chunk(chunk))
        return ids

    def decode(self, ids):
        return b"".join(self.vocab[i] for i in ids).decode("utf-8", errors="replace")

    def encode_dialog_prompt(self, user_text):
        """The Llama 3 ChatFormat: one user message, then an open assistant header."""
        sp = self.special
        ids = [sp["<|begin_of_text|>"]]
        ids += [sp["<|start_header_id|>"]] + self.encode("user") + [sp["<|end_header_id|>"]] + self.encode("\n\n")
        ids += self.encode(user_text.strip()) + [sp["<|eot_id|>"]]
        ids += [sp["<|start_header_id|>"]] + self.encode("assistant") + [sp["<|end_header_id|>"]] + self.encode("\n\n")
        return ids


# ---------------------------------------------------------------------------
# 3. Model: a small Llama
# ---------------------------------------------------------------------------


class RMSNorm(nn.Module):
    def __init__(self, dim, eps):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(dim))

    def forward(self, x):
        return x * torch.rsqrt(x.pow(2).mean(-1, keepdim=True) + self.eps) * self.weight


def rope_tables(head_dim, max_len, theta):
    freqs = 1.0 / (theta ** (torch.arange(0, head_dim, 2).float() / head_dim))
    angles = torch.outer(torch.arange(max_len).float(), freqs)
    return angles.cos(), angles.sin()


def apply_rope(x, cos, sin):
    """Rotate each pair of dimensions (0,1), (2,3), ... by a position-dependent angle."""
    seq_len = x.shape[1]
    c = cos[:seq_len][None, :, None, :]
    s = sin[:seq_len][None, :, None, :]
    x1, x2 = x[..., 0::2], x[..., 1::2]
    return torch.stack([x1 * c - x2 * s, x1 * s + x2 * c], dim=-1).flatten(-2)


class Attention(nn.Module):
    def __init__(self, cfg):
        super().__init__()
        self.n_heads, self.n_kv_heads = cfg["n_heads"], cfg["n_kv_heads"]
        self.head_dim = cfg["dim"] // cfg["n_heads"]
        self.wq = nn.Linear(cfg["dim"], self.n_heads * self.head_dim, bias=False)
        self.wk = nn.Linear(cfg["dim"], self.n_kv_heads * self.head_dim, bias=False)
        self.wv = nn.Linear(cfg["dim"], self.n_kv_heads * self.head_dim, bias=False)
        self.wo = nn.Linear(self.n_heads * self.head_dim, cfg["dim"], bias=False)

    def forward(self, x, cos, sin):
        batch, seq_len, _ = x.shape
        q = self.wq(x).view(batch, seq_len, self.n_heads, self.head_dim)
        k = self.wk(x).view(batch, seq_len, self.n_kv_heads, self.head_dim)
        v = self.wv(x).view(batch, seq_len, self.n_kv_heads, self.head_dim)
        q, k = apply_rope(q, cos, sin), apply_rope(k, cos, sin)
        # Grouped-query attention: query head h reads key/value head h // group.
        group = self.n_heads // self.n_kv_heads
        k, v = k.repeat_interleave(group, dim=2), v.repeat_interleave(group, dim=2)
        q, k, v = (t.transpose(1, 2) for t in (q, k, v))
        y = F.scaled_dot_product_attention(q, k, v, is_causal=True)
        return self.wo(y.transpose(1, 2).reshape(batch, seq_len, -1))


class FeedForward(nn.Module):
    def __init__(self, cfg):
        super().__init__()
        self.gate = nn.Linear(cfg["dim"], cfg["hidden_dim"], bias=False)
        self.up = nn.Linear(cfg["dim"], cfg["hidden_dim"], bias=False)
        self.down = nn.Linear(cfg["hidden_dim"], cfg["dim"], bias=False)

    def forward(self, x):
        return self.down(F.silu(self.gate(x)) * self.up(x))


class Block(nn.Module):
    def __init__(self, cfg):
        super().__init__()
        self.attention_norm = RMSNorm(cfg["dim"], cfg["norm_eps"])
        self.attention = Attention(cfg)
        self.ffn_norm = RMSNorm(cfg["dim"], cfg["norm_eps"])
        self.feed_forward = FeedForward(cfg)

    def forward(self, x, cos, sin):
        h = x + self.attention(self.attention_norm(x), cos, sin)
        return h + self.feed_forward(self.ffn_norm(h))


class Transformer(nn.Module):
    def __init__(self, cfg):
        super().__init__()
        self.cfg = cfg
        self.tok_embeddings = nn.Embedding(cfg["vocab_size"], cfg["dim"])
        self.layers = nn.ModuleList(Block(cfg) for _ in range(cfg["n_layers"]))
        self.norm = RMSNorm(cfg["dim"], cfg["norm_eps"])
        self.output = nn.Linear(cfg["dim"], cfg["vocab_size"], bias=False)
        cos, sin = rope_tables(cfg["dim"] // cfg["n_heads"], cfg["max_seq_len"], cfg["rope_theta"])
        self.register_buffer("cos", cos, persistent=False)
        self.register_buffer("sin", sin, persistent=False)
        for name, p in self.named_parameters():
            if p.dim() == 2:
                std = 0.02 / math.sqrt(2 * cfg["n_layers"]) if name.endswith(("wo.weight", "down.weight")) else 0.02
                nn.init.normal_(p, mean=0.0, std=std)

    def forward(self, ids):
        x = self.tok_embeddings(ids)
        for layer in self.layers:
            x = layer(x, self.cos, self.sin)
        return self.output(self.norm(x))


@torch.no_grad()
def generate(model, prompt_ids, stop_ids, max_new_tokens):
    ids = list(prompt_ids)
    for _ in range(max_new_tokens):
        if len(ids) >= model.cfg["max_seq_len"]:
            break
        logits = model(torch.tensor([ids]))[0, -1]
        next_id = int(logits.argmax())
        ids.append(next_id)
        if next_id in stop_ids:
            break
    return ids[len(prompt_ids):]


# ---------------------------------------------------------------------------
# 4. Training, checks, and export
# ---------------------------------------------------------------------------


def build_batches(tok, rng, count, max_len):
    rows = []
    eot = tok.special["<|eot_id|>"]
    for _ in range(count):
        question, answer = sample_conversation(rng)
        ids = tok.encode_dialog_prompt(question) + tok.encode(answer) + [eot]
        assert len(ids) <= max_len, (question, answer, len(ids))
        rows.append(ids)
    return rows


def evaluate(model, tok):
    stops = {tok.special[n] for n in STOP_NAMES}
    failures = []
    for question, answer, _ in all_pairs():
        out = generate(model, tok.encode_dialog_prompt(question), stops, 40)
        expected = tok.encode(answer) + [tok.special["<|eot_id|>"]]
        if out != expected:
            failures.append((question, tok.decode([i for i in out if i not in stops])))
    # "Pick an animal." must give a spread-out choice over the sixteen animals.
    prompt = tok.encode_dialog_prompt("Pick an animal.") + tok.encode("I pick the")
    with torch.no_grad():
        probs = F.softmax(model(torch.tensor([prompt]))[0, -1], dim=-1)
    animal_ids = [tok.encode(" " + a)[0] for a in ANIMALS]
    animal_mass = float(probs[animal_ids].sum())
    entropy_bits = float(-(probs * probs.clamp_min(1e-12).log2()).sum())
    # "Tell me a fact." must stop after the first sentence about half the time.
    prompt = tok.encode_dialog_prompt("Tell me a fact.") + tok.encode("The cat eats fish.")
    with torch.no_grad():
        probs = F.softmax(model(torch.tensor([prompt]))[0, -1], dim=-1)
    stop_after_one = float(probs[tok.special["<|eot_id|>"]])
    return failures, animal_mass, entropy_bits, stop_after_one


def float16_round_trip(model):
    with torch.no_grad():
        for p in model.parameters():
            p.copy_(p.half().float())


def export(model, tok, cfg, info, path):
    tensors, chunks, offset = [], [], 0
    for name, p in model.state_dict().items():
        data = p.detach().to(torch.float16).contiguous().numpy().tobytes()
        tensors.append({"name": name, "shape": list(p.shape), "offset": offset})
        chunks.append(data)
        offset += len(data)
    blob = base64.b64encode(b"".join(chunks)).decode("ascii")

    stops = {tok.special[n] for n in STOP_NAMES}
    reference = []
    for question in ["What does the cat eat?", "Tell me about the owl.", "Who are you?"]:
        prompt = tok.encode_dialog_prompt(question)
        with torch.no_grad():
            logits = model(torch.tensor([prompt]))[0, -1]
        top = torch.topk(logits, 5)
        reference.append({
            "question": question,
            "prompt_ids": prompt,
            "greedy_ids": generate(model, prompt, stops, 40),
            "top5_ids": top.indices.tolist(),
            "top5_logits": [round(v, 4) for v in top.values.tolist()],
        })

    # Strings that test the JavaScript copy of the pre-tokenizer regex.
    pretokenizer_tests = [
        {"text": text, "chunks": regex.findall(PATTERN, text)}
        for text in [
            "What does the cat eat?",
            "It's THEY'RE we'll I'M",
            "12345 apples, 3.14!!! ok...",
            "a  b\n\n  c\t\td \n",
            "naïve café 😀 日本語",
            "<|eot_id|> is plain text here",
        ]
    ]

    payload = {
        "format": 1,
        "name": "toy-llama",
        "config": cfg,
        "tokenizer": {
            "type": "byte-level BPE",
            "pattern": PATTERN,
            "merges": [list(m) for m in tok.merges],
            "special_tokens": tok.special,
            "stop_tokens": sorted(stops),
        },
        "weights": {"dtype": "float16", "byteorder": "little", "tensors": tensors, "data": blob},
        "training": info,
        "facts": {a: dict(zip(["sound", "food", "home", "legs"], v)) for a, v in ANIMALS.items()},
        "reference": reference,
        "pretokenizer_tests": pretokenizer_tests,
    }
    text = json.dumps(payload, separators=(",", ":"))
    path.write_text(
        "// Generated by simulation/train/train_toy_model.py. Do not edit by hand.\n"
        f"globalThis.TOY_MODEL = {text};\n",
        encoding="utf-8",
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--steps", type=int, default=3000)
    parser.add_argument("--batch", type=int, default=64)
    parser.add_argument("--lr", type=float, default=3e-3)
    # An upper limit. The training stops early when every corpus word is one token.
    parser.add_argument("--merges", type=int, default=400)
    parser.add_argument("--seed", type=int, default=0)
    args = parser.parse_args()

    rng = random.Random(args.seed)
    torch.manual_seed(args.seed)

    # Tokenizer: count the pre-tokenizer chunks of a large sample, then merge.
    chunk_counts = Counter()
    for _ in range(20000):
        question, answer = sample_conversation(rng)
        for text in ("user", "\n\n", question, "assistant", "\n\n", answer):
            chunk_counts.update(regex.findall(PATTERN, text))
    tok = Tokenizer.train(chunk_counts, args.merges)
    print(f"tokenizer: {len(tok.merges)} merges, vocabulary {tok.vocab_size}")
    split_words = sorted({c for c in chunk_counts if len(tok.encode_chunk(c)) > 1})
    print("chunks that stay in pieces:", split_words)

    cfg = {
        "vocab_size": tok.vocab_size,
        "dim": 64,
        "n_layers": 4,
        "n_heads": 4,
        "n_kv_heads": 2,
        "hidden_dim": 224,
        "max_seq_len": 64,
        "rope_theta": 10000.0,
        "norm_eps": 1e-5,
    }
    model = Transformer(cfg)
    n_params = sum(p.numel() for p in model.parameters())
    print(f"model: {n_params:,} parameters")

    rows = build_batches(tok, rng, 60000, cfg["max_seq_len"])
    pad = -1
    width = max(len(r) for r in rows)
    data = torch.full((len(rows), width), pad, dtype=torch.long)
    for i, r in enumerate(rows):
        data[i, : len(r)] = torch.tensor(r)

    decay = [p for p in model.parameters() if p.dim() == 2]
    no_decay = [p for p in model.parameters() if p.dim() < 2]
    opt = torch.optim.AdamW(
        [{"params": decay, "weight_decay": 0.05}, {"params": no_decay, "weight_decay": 0.0}],
        lr=args.lr, betas=(0.9, 0.95),
    )
    warmup = 100
    started = time.time()
    loss_value = float("nan")
    for step in range(args.steps):
        lr = args.lr * min(1.0, (step + 1) / warmup) * 0.5 * (1 + math.cos(math.pi * step / args.steps))
        for group in opt.param_groups:
            group["lr"] = lr
        batch = data[torch.randint(0, len(rows), (args.batch,))]
        inputs = batch[:, :-1].clamp_min(0)
        targets = batch[:, 1:]
        logits = model(inputs)
        loss = F.cross_entropy(logits.reshape(-1, cfg["vocab_size"]), targets.reshape(-1), ignore_index=pad)
        opt.zero_grad(set_to_none=True)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        opt.step()
        loss_value = loss.item()
        if step % 250 == 0 or step == args.steps - 1:
            print(f"step {step:5d}  loss {loss_value:.4f}  lr {lr:.5f}  {time.time() - started:.0f}s")

    model.eval()
    float16_round_trip(model)
    failures, animal_mass, entropy_bits, stop_after_one = evaluate(model, tok)
    total = len(all_pairs())
    print(f"greedy answers correct: {total - len(failures)}/{total}")
    for question, got in failures:
        print(f"  FAIL {question!r} -> {got!r}")
    print(f"'Pick an animal.': {animal_mass:.3f} of the mass on animals, entropy {entropy_bits:.2f} bits (uniform: 4.00)")
    print(f"'Tell me a fact.': P(<|eot_id|>) after one fact = {stop_after_one:.2f} (target {FACT_COUNT_WEIGHTS[0]:.2f})")

    info = {
        "date": datetime.date.today().isoformat(),
        "steps": args.steps,
        "batch_size": args.batch,
        "sequences": len(rows),
        "final_loss": round(loss_value, 4),
        "parameters": n_params,
        "greedy_correct": total - len(failures),
        "greedy_total": total,
        "seed": args.seed,
    }
    export(model, tok, cfg, info, OUT_FILE)
    print(f"wrote {OUT_FILE} ({OUT_FILE.stat().st_size / 1024:.0f} KiB)")


if __name__ == "__main__":
    main()
