# Life of a Token — interactive simulation

**Scope:** an interactive page that follows one chat request through a small, real transformer, from the HTTP request to the stop token.
**Index:** [README](../README.md). **Builds on:** documents [00](../00-big-picture.md), [01](../01-tokenizer.md), and [03](../03-embeddings-and-positions.md) to [08](../08-inference-runtime.md).

## Open the simulation

- **Local copy:** open [`index.html`](index.html) in a browser. It needs no server and no build step. It loads `engine.js` and `toy-model.js` from the same folder.
- **Published copy:** [Life of a Token](https://claude.ai/artifact/SNkcMEnHkSyWGwzeXLxBQp) (a private claude.ai artifact).

The page loads its fonts from Google Fonts. Without a network connection, it uses the system fonts.

## How to use it

1. Pick an example message, or type a message and select **Run**.
2. Select **Play**, or step with the arrow keys. Shift + right arrow jumps to the next sampled token.
3. Select a stage in the rail at the left to jump to it in the current forward pass.
4. Select any token in the context window to follow its life in the panel under the scope.
5. Change the sampler settings. The page runs the request again and stays at the same stage.

The example messages show different behaviors:

| Message | What to look at |
|---------|-----------------|
| What does the cat eat? | A one-sentence answer. Block 1 attention reads " cat" in the pass that writes " cat" and in the pass that writes " fish". |
| Tell me about the owl. | A three-sentence answer. The stop probability stays near 0 until the third sentence ends. |
| Tell me a fact. | An uncertain stop. After the first sentence, the model gives the stop token about 50%. Change the seed to see 1, 2, or 3 sentences. |
| Pick an animal. | An uncertain choice. The model spreads the probability over 16 animals, so the sampler settings matter. |
| What does the zebra eat? | An unknown word. BPE splits " zebra" into bytes, and the model answers about a different animal with confidence. |
| Who are you? | A two-sentence fixed answer. |

## What each stage shows

| Stage | What the page shows | Document |
|-------|---------------------|----------|
| Request arrives | The HTTP request body and a summary of the run | [00](../00-big-picture.md), [08](../08-inference-runtime.md) |
| Chat template | The Llama 3 chat format around the message | [01](../01-tokenizer.md) |
| Pre-tokenizer | The chunks that the Llama 3 regex makes | [01](../01-tokenizer.md) |
| BPE merges | Each merge rule that BPE applies to each chunk | [01](../01-tokenizer.md) |
| Token IDs | The prompt IDs, next to the real Llama 3 IDs for the example messages | [01](../01-tokenizer.md) |
| Embedding lookup | The rows that the lookup copies from the embedding table | [03](../03-embeddings-and-positions.md) |
| Block *n* · Attention | The weights of each head, the causal mask, and the KV cache writes and reads | [05](../05-attention.md) |
| Block *n* · MLP | The neuron activations, and the tokens that each strong neuron pushes up | [06](../06-mlp-and-neurons.md), [13](../13-interpretability.md) |
| Output head | All logits for the last position | [07](../07-output-and-sampling.md) |
| Sampler | The value after each logit processor, and the random draw | [07](../07-output-and-sampling.md) |
| Detokenizer | Token to bytes to text, and the server-sent event | [01](../01-tokenizer.md), [08](../08-inference-runtime.md) |
| Stop check | The four stop conditions, and the stop probability at each pass | [07](../07-output-and-sampling.md) |
| Response done | The last events, the token counts, and the cost at Llama 3 8B scale | [02](../02-tensors-and-weights.md), [08](../08-inference-runtime.md) |

The attention and MLP views also show a **logit lens**: the final norm and the output head, applied to the residual stream after that block. It shows how the guess for the next token forms with depth ([nostalgebraist, 2020](https://www.lesswrong.com/posts/AcKRB8wDpdaN6v6ru/interpreting-gpt-the-logit-lens)).

## The toy model

The model has the Llama layout: RMSNorm before each sub-layer, rotary positions (RoPE), grouped-query attention, a SwiGLU MLP, no bias terms, and separate embedding and output matrices.

| Setting | This model | Llama 3 8B |
|---------|------------|------------|
| Layers | 4 | 32 |
| Model dimension | 64 | 4,096 |
| Query heads / key-value heads | 4 / 2 | 32 / 8 |
| Head dimension | 16 | 128 |
| MLP neurons per layer | 224 | 14,336 |
| Vocabulary | 582: 256 bytes, 321 merges, 5 special tokens | 128,256 |
| Context window | 64 | 8,192 |
| RoPE base | 10,000 | 500,000 |
| Parameters | 296,256 | 8,030,261,248 |
| Weights | float16, 592 kB | bf16, about 16 GB |

**Tokenizer.** It is a byte-level BPE tokenizer. It uses the Llama 3 pre-tokenizer regex and the five Llama 3 chat-format tokens, so the prompt has the same layout as a real Llama 3 prompt. The training text has 147 distinct chunks, and the tokenizer merges until each of them is one token.

**Training data.** The script samples 60,000 chat transcripts from templates about 16 animals:

- one fact per question: the sound, the food, the home, or the number of legs,
- "Tell me about the …": three facts in a fixed order,
- "Pick an animal.": a uniform random animal,
- "Tell me a fact.": one to three random facts, with a 50% stop after the first,
- small talk: greetings, thanks, and "Who are you?".

About one question in five starts with a lower-case letter, and about one in seven has no final punctuation.

**Training.** 3,000 steps of AdamW with a batch of 64 and a cosine learning-rate schedule. It takes about one minute on a laptop CPU. The final loss is about 0.3. Most of that loss comes from text that no model can predict, such as the random animal or the next question.

**Checks.** After the training, the script rounds the weights to float16 and decodes all 152 template questions with greedy sampling. All 152 answers are correct. `check_engine.js` then confirms that the JavaScript engine gives the same logits as PyTorch, within 5 × 10⁻⁵.

## What is real and what is simplified

Real:

- Every number on the page comes from the model. Nothing is scripted.
- The tokenizer, the chat template, and the special tokens follow Llama 3.
- The sampler applies the processors in the order of Hugging Face transformers: repetition penalty, temperature, top-k, top-p, then the random draw.
- The stop rules are those of a typical OpenAI-compatible server: a stop token, a stop sequence, the token limit, and the context window.

Simplified:

- The page runs one request on the CPU. A real server batches many requests on GPUs and keeps the KV cache in pages ([08](../08-inference-runtime.md)).
- The engine feeds the prompt one position at a time. This gives the same values as one parallel prefill pass, but it is slower.
- The engine computes in 64-bit floats. A real server computes in bf16 or in fewer bits.
- The stop-sequence check does not hold back text that can start a stop sequence. Some servers do.
- The logit lens is a rough tool. [Belrose et al. (2023)](https://arxiv.org/abs/2303.08112) found it unreliable for some models.
- The neuron table shows only the direct effect of a neuron on the logits, as in [Geva et al. (2022)](https://aclanthology.org/2022.emnlp-main.3). It ignores the effect through later layers.
- The Llama 3 8B values are calculations from its configuration, not measurements. The decode time uses the rough 2 TB/s memory bandwidth from [08](../08-inference-runtime.md).

## Files

| File | Contents |
|------|----------|
| `index.html` | The page: layout, styles, and the code for each stage view. |
| `engine.js` | The tokenizer, the transformer, the sampler, and the serving loop. It has no dependencies and runs in a browser or in Node. |
| `toy-model.js` | Generated. The configuration, the merge rules, the float16 weights in base64, and reference outputs from PyTorch. |
| `train/train_toy_model.py` | Builds the corpus, trains the tokenizer and the model, checks the answers, and writes `toy-model.js`. |
| `train/check_engine.js` | Compares `engine.js` with the PyTorch reference in `toy-model.js`. |
| `train/requirements.txt` | The Python packages for the training script. |

## Rebuild the model

Run these commands from the repository root:

```sh
python3 -m venv .venv
.venv/bin/pip install -r simulation/train/requirements.txt
.venv/bin/python simulation/train/train_toy_model.py
node simulation/train/check_engine.js
```

A rebuild on another machine can give slightly different weights, because CPU training is not bit-for-bit reproducible. Then a seed can give a different sampled reply.

## Sources

[sources.md](../sources.md) lists the sources of the simulation and the web searches that supported it, in the section "Token lifecycle simulation".
