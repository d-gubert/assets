/* Life of a Token: the engine.
 *
 * The engine runs the toy model from toy-model.js: a byte-level BPE tokenizer,
 * a 4-layer Llama-style transformer, and a sampler. It records every
 * intermediate value of a request, so the page can show it. It has no
 * dependencies and runs in a browser or in Node.
 */
(function (root) {
  "use strict";

  // The Llama 3 pre-tokenizer pattern in JavaScript syntax. The original starts
  // with a case-insensitive group, (?i:'s|'t|...). Here the contractions list the
  // upper and lower case letters instead.
  const PRETOKENIZE =
    /'(?:[sS]|[tT]|[rR][eE]|[vV][eE]|[mM]|[lL][lL]|[dD])|[^\r\n\p{L}\p{N}]?\p{L}+|\p{N}{1,3}| ?[^\s\p{L}\p{N}]+[\r\n]*|\s*[\r\n]+|\s+(?!\S)|\s+/gu;

  const utf8Encoder = new TextEncoder();
  const utf8Decoder = new TextDecoder("utf-8");

  // ---------------------------------------------------------------------------
  // Weights
  // ---------------------------------------------------------------------------

  function base64ToBytes(text) {
    const binary = atob(text);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function float16ToFloat32(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const out = new Float32Array(bytes.byteLength / 2);
    for (let i = 0; i < out.length; i++) {
      const h = view.getUint16(i * 2, true);
      const sign = h & 0x8000 ? -1 : 1;
      const exponent = (h >> 10) & 0x1f;
      const fraction = h & 0x3ff;
      if (exponent === 0) out[i] = sign * fraction * 2 ** -24;
      else if (exponent === 31) out[i] = fraction ? NaN : sign * Infinity;
      else out[i] = sign * (1 + fraction / 1024) * 2 ** (exponent - 15);
    }
    return out;
  }

  function decodeWeights(spec) {
    const bytes = base64ToBytes(spec.data);
    const tensors = {};
    for (const t of spec.tensors) {
      const count = t.shape.reduce((a, b) => a * b, 1);
      tensors[t.name] = { shape: t.shape, data: float16ToFloat32(bytes.subarray(t.offset, t.offset + count * 2)) };
    }
    return tensors;
  }

  // ---------------------------------------------------------------------------
  // Tokenizer
  // ---------------------------------------------------------------------------

  function mergePair(ids, left, right, newId) {
    const out = [];
    for (let i = 0; i < ids.length; i++) {
      if (i < ids.length - 1 && ids[i] === left && ids[i + 1] === right) {
        out.push(newId);
        i++;
      } else {
        out.push(ids[i]);
      }
    }
    return out;
  }

  class Tokenizer {
    constructor(spec) {
      this.pattern = spec.pattern;
      this.merges = spec.merges;
      this.ranks = new Map();
      this.bytes = [];
      for (let i = 0; i < 256; i++) this.bytes.push(Uint8Array.of(i));
      spec.merges.forEach(([left, right], rank) => {
        this.ranks.set(left * 65536 + right, 256 + rank);
        const a = this.bytes[left];
        const b = this.bytes[right];
        const joined = new Uint8Array(a.length + b.length);
        joined.set(a);
        joined.set(b, a.length);
        this.bytes.push(joined);
      });
      this.special = spec.special_tokens;
      this.specialById = new Map();
      for (const [name, id] of Object.entries(spec.special_tokens)) {
        this.specialById.set(id, name);
        this.bytes[id] = utf8Encoder.encode(name);
      }
      this.stopTokens = new Set(spec.stop_tokens);
      this.vocabSize = this.bytes.length;
    }

    isSpecial(id) {
      return this.specialById.has(id);
    }

    /** The pre-tokenizer: split the text into chunks. No token crosses a chunk boundary. */
    chunks(text) {
      return Array.from(text.matchAll(PRETOKENIZE), (m) => m[0]);
    }

    /** BPE on one chunk. With `trace`, it also returns the state after each merge. */
    encodeChunk(chunk, trace) {
      let ids = Array.from(utf8Encoder.encode(chunk));
      const steps = trace ? [{ ids: ids.slice(), merge: null }] : null;
      while (ids.length >= 2) {
        let best = -1;
        for (let i = 0; i < ids.length - 1; i++) {
          const id = this.ranks.get(ids[i] * 65536 + ids[i + 1]);
          if (id !== undefined && (best < 0 || id < best)) best = id;
        }
        if (best < 0) break;
        const [left, right] = this.merges[best - 256];
        ids = mergePair(ids, left, right, best);
        if (trace) steps.push({ ids: ids.slice(), merge: { left, right, id: best, rank: best - 256 } });
      }
      return trace ? { text: chunk, ids, steps } : ids;
    }

    /** Encode plain text. A special-token name in the text stays plain text. */
    encode(text) {
      return this.chunks(text).flatMap((c) => this.encodeChunk(c));
    }

    decode(ids) {
      const parts = ids.filter((id) => !this.isSpecial(id)).map((id) => this.bytes[id]);
      const total = parts.reduce((n, p) => n + p.length, 0);
      const joined = new Uint8Array(total);
      let offset = 0;
      for (const p of parts) {
        joined.set(p, offset);
        offset += p.length;
      }
      return utf8Decoder.decode(joined);
    }

    /** A readable label for one token: specials by name, other tokens as text. */
    label(id) {
      if (this.isSpecial(id)) return this.specialById.get(id);
      const bytes = this.bytes[id];
      try {
        return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      } catch (e) {
        return Array.from(bytes, (b) => "<0x" + b.toString(16).toUpperCase().padStart(2, "0") + ">").join("");
      }
    }

    /**
     * The Llama 3 chat format for one user message. The template adds special
     * tokens by ID, so the user text cannot produce a control token.
     */
    encodeDialogPrompt(userText) {
      const segments = [];
      const special = (name) => segments.push({ kind: "special", text: name, ids: [this.special[name]] });
      const text = (value, kind) => {
        const chunks = this.chunks(value).map((c) => this.encodeChunk(c, true));
        segments.push({ kind, text: value, chunks, ids: chunks.flatMap((c) => c.ids) });
      };
      special("<|begin_of_text|>");
      special("<|start_header_id|>");
      text("user", "header");
      special("<|end_header_id|>");
      text("\n\n", "header");
      text(userText.trim(), "content");
      special("<|eot_id|>");
      special("<|start_header_id|>");
      text("assistant", "header");
      special("<|end_header_id|>");
      text("\n\n", "header");
      return { segments, ids: segments.flatMap((s) => s.ids) };
    }
  }

  /** Streams text from token bytes. It holds back an incomplete UTF-8 character. */
  class StreamDecoder {
    constructor(tokenizer) {
      this.tokenizer = tokenizer;
      this.held = [];
    }

    push(id) {
      if (this.tokenizer.isSpecial(id)) return { special: true, bytes: [], text: "", held: this.held.length };
      const bytes = Array.from(this.tokenizer.bytes[id]);
      const pending = this.held.concat(bytes);
      const cut = completeUtf8Length(pending);
      this.held = pending.slice(cut);
      return { special: false, bytes, text: utf8Decoder.decode(Uint8Array.from(pending.slice(0, cut))), held: this.held.length };
    }
  }

  function completeUtf8Length(bytes) {
    // Find the lead byte of the last character, then check if all its bytes are here.
    let i = bytes.length - 1;
    while (i >= 0 && (bytes[i] & 0xc0) === 0x80 && bytes.length - i < 4) i--;
    if (i < 0) return bytes.length;
    const lead = bytes[i];
    const need = lead >= 0xf0 ? 4 : lead >= 0xe0 ? 3 : lead >= 0xc0 ? 2 : 1;
    return bytes.length - i >= need ? bytes.length : i;
  }

  // ---------------------------------------------------------------------------
  // Math helpers. Vectors are Float64Array. A weight matrix is a row-major
  // Float32Array with shape [out, in], as in PyTorch's nn.Linear.
  // ---------------------------------------------------------------------------

  function matvec(w, x, rows, cols) {
    const y = new Float64Array(rows);
    for (let r = 0; r < rows; r++) {
      let sum = 0;
      const base = r * cols;
      for (let c = 0; c < cols; c++) sum += w[base + c] * x[c];
      y[r] = sum;
    }
    return y;
  }

  function rmsnorm(x, gain, eps) {
    let ms = 0;
    for (let i = 0; i < x.length; i++) ms += x[i] * x[i];
    const scale = 1 / Math.sqrt(ms / x.length + eps);
    const y = new Float64Array(x.length);
    for (let i = 0; i < x.length; i++) y[i] = x[i] * scale * gain[i];
    return y;
  }

  function softmax(values) {
    let max = -Infinity;
    for (const v of values) if (v > max) max = v;
    const out = new Float64Array(values.length);
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      out[i] = values[i] === -Infinity ? 0 : Math.exp(values[i] - max);
      sum += out[i];
    }
    for (let i = 0; i < out.length; i++) out[i] /= sum;
    return out;
  }

  function silu(v) {
    return v / (1 + Math.exp(-v));
  }

  function topIndices(values, k) {
    return Array.from(values.keys())
      .sort((a, b) => values[b] - values[a])
      .slice(0, k);
  }

  function norm2(v) {
    let s = 0;
    for (const x of v) s += x * x;
    return Math.sqrt(s);
  }

  /** A small seeded generator (mulberry32), so a seed always gives the same run. */
  function rng32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------------------------------------------------------------------------
  // Model
  // ---------------------------------------------------------------------------

  class Model {
    constructor(spec) {
      const c = spec.config;
      this.spec = spec;
      this.config = c;
      this.headDim = c.dim / c.n_heads;
      this.group = c.n_heads / c.n_kv_heads;
      this.tokenizer = new Tokenizer(spec.tokenizer);
      const tensors = decodeWeights(spec.weights);
      this.tensors = tensors;
      const w = (name) => tensors[name].data;
      this.embedding = w("tok_embeddings.weight");
      this.layers = [];
      for (let l = 0; l < c.n_layers; l++) {
        const p = `layers.${l}.`;
        this.layers.push({
          attentionNorm: w(p + "attention_norm.weight"),
          wq: w(p + "attention.wq.weight"),
          wk: w(p + "attention.wk.weight"),
          wv: w(p + "attention.wv.weight"),
          wo: w(p + "attention.wo.weight"),
          ffnNorm: w(p + "ffn_norm.weight"),
          gate: w(p + "feed_forward.gate.weight"),
          up: w(p + "feed_forward.up.weight"),
          down: w(p + "feed_forward.down.weight"),
        });
      }
      this.finalNorm = w("norm.weight");
      this.output = w("output.weight");
      this.parameterCount = spec.weights.tensors.reduce((n, t) => n + t.shape.reduce((a, b) => a * b, 1), 0);

      const half = this.headDim / 2;
      this.ropeCos = new Float64Array(c.max_seq_len * half);
      this.ropeSin = new Float64Array(c.max_seq_len * half);
      for (let pos = 0; pos < c.max_seq_len; pos++) {
        for (let i = 0; i < half; i++) {
          const angle = pos * Math.pow(c.rope_theta, (-2 * i) / this.headDim);
          this.ropeCos[pos * half + i] = Math.cos(angle);
          this.ropeSin[pos * half + i] = Math.sin(angle);
        }
      }
      this.neuronCache = new Map();
    }

    newCache() {
      const layers = this.config.n_layers;
      return { length: 0, keys: Array.from({ length: layers }, () => []), values: Array.from({ length: layers }, () => []) };
    }

    embeddingRow(id) {
      const d = this.config.dim;
      return Float64Array.from(this.embedding.subarray(id * d, (id + 1) * d));
    }

    /** RoPE: rotate the pairs (0,1), (2,3), ... of each head by an angle that grows with the position. */
    rope(vec, heads, pos) {
      const hd = this.headDim;
      const half = hd / 2;
      for (let h = 0; h < heads; h++) {
        for (let i = 0; i < half; i++) {
          const a = vec[h * hd + 2 * i];
          const b = vec[h * hd + 2 * i + 1];
          const cos = this.ropeCos[pos * half + i];
          const sin = this.ropeSin[pos * half + i];
          vec[h * hd + 2 * i] = a * cos - b * sin;
          vec[h * hd + 2 * i + 1] = a * sin + b * cos;
        }
      }
    }

    /** The output head on one residual vector: final norm, then one logit per vocabulary entry. */
    unembed(x) {
      const c = this.config;
      return matvec(this.output, rmsnorm(x, this.finalNorm, c.norm_eps), c.vocab_size, c.dim);
    }

    /**
     * One forward pass for one position. The pass reads the KV cache of the
     * earlier positions and appends this position's keys and values.
     */
    forward(tokenId, cache) {
      const c = this.config;
      const D = c.dim;
      const hd = this.headDim;
      const H = c.n_heads;
      const KV = c.n_kv_heads;
      const pos = cache.length;
      if (pos >= c.max_seq_len) throw new Error("The context window is full.");
      const x = this.embeddingRow(tokenId);
      const rec = { pos, tokenId, embedding: Float64Array.from(x), layers: [] };

      for (let l = 0; l < c.n_layers; l++) {
        const L = this.layers[l];
        const lr = { residIn: Float64Array.from(x) };
        const xn = rmsnorm(x, L.attentionNorm, c.norm_eps);
        const q = matvec(L.wq, xn, H * hd, D);
        const k = matvec(L.wk, xn, KV * hd, D);
        const v = matvec(L.wv, xn, KV * hd, D);
        this.rope(q, H, pos);
        this.rope(k, KV, pos);
        cache.keys[l].push(k);
        cache.values[l].push(v);

        const scale = 1 / Math.sqrt(hd);
        const mixed = new Float64Array(H * hd);
        const scores = [];
        const weights = [];
        for (let h = 0; h < H; h++) {
          const g = Math.floor(h / this.group);
          const s = new Float64Array(pos + 1);
          for (let t = 0; t <= pos; t++) {
            const key = cache.keys[l][t];
            let dot = 0;
            for (let i = 0; i < hd; i++) dot += q[h * hd + i] * key[g * hd + i];
            s[t] = dot * scale;
          }
          const p = softmax(s);
          for (let t = 0; t <= pos; t++) {
            const value = cache.values[l][t];
            for (let i = 0; i < hd; i++) mixed[h * hd + i] += p[t] * value[g * hd + i];
          }
          scores.push(s);
          weights.push(p);
        }
        const attnOut = matvec(L.wo, mixed, D, H * hd);
        for (let i = 0; i < D; i++) x[i] += attnOut[i];
        Object.assign(lr, { q, k, v, scores, weights, attnOut, residMid: Float64Array.from(x) });

        const xn2 = rmsnorm(x, L.ffnNorm, c.norm_eps);
        const gate = matvec(L.gate, xn2, c.hidden_dim, D);
        const up = matvec(L.up, xn2, c.hidden_dim, D);
        const act = new Float64Array(c.hidden_dim);
        for (let j = 0; j < c.hidden_dim; j++) act[j] = silu(gate[j]) * up[j];
        const mlpOut = matvec(L.down, act, D, c.hidden_dim);
        for (let i = 0; i < D; i++) x[i] += mlpOut[i];
        Object.assign(lr, { act, mlpOut, residOut: Float64Array.from(x) });
        rec.layers.push(lr);
      }
      cache.length = pos + 1;
      rec.finalNormed = rmsnorm(x, this.finalNorm, c.norm_eps);
      rec.logits = matvec(this.output, rec.finalNormed, c.vocab_size, D);
      return rec;
    }

    /**
     * The direct effect of each MLP neuron of a layer on the logits: its write
     * vector (one column of the down matrix), read through the output head.
     * This is the "MLP value vector" view of Geva et al. (2021).
     */
    neuronEffects(layer) {
      if (this.neuronCache.has(layer)) return this.neuronCache.get(layer);
      const c = this.config;
      const down = this.layers[layer].down;
      const effects = [];
      for (let n = 0; n < c.hidden_dim; n++) {
        const w = new Float64Array(c.dim);
        for (let d = 0; d < c.dim; d++) w[d] = down[d * c.hidden_dim + n] * this.finalNorm[d];
        const scores = matvec(this.output, w, c.vocab_size, c.dim);
        effects.push({ promotes: topIndices(scores, 3), suppresses: topIndices(scores.map((s) => -s), 3) });
      }
      this.neuronCache.set(layer, effects);
      return effects;
    }
  }

  // ---------------------------------------------------------------------------
  // Sampler: the logit processors, in the Hugging Face transformers order
  // ---------------------------------------------------------------------------

  /**
   * Pick the next token. The record keeps the values after each processor:
   * repetition penalty, temperature, top-k, top-p, and the random draw.
   */
  function sample(logits, contextIds, settings, rng) {
    const V = logits.length;
    const raw = Float64Array.from(logits);
    const modelProbs = softmax(raw);
    const z = Float64Array.from(raw);

    const penalty = settings.repetitionPenalty;
    const penalized = new Set();
    if (penalty !== 1) {
      for (const id of new Set(contextIds)) {
        z[id] = z[id] > 0 ? z[id] / penalty : z[id] * penalty;
        penalized.add(id);
      }
    }
    const afterPenalty = Float64Array.from(z);
    const rec = { raw, modelProbs, afterPenalty, penalized, greedy: settings.temperature === 0 };

    if (rec.greedy) {
      let best = 0;
      for (let i = 1; i < V; i++) if (z[i] > z[best]) best = i;
      const probs = new Float64Array(V);
      probs[best] = 1;
      return Object.assign(rec, {
        scaled: afterPenalty,
        tempProbs: softmax(afterPenalty),
        keptTopK: null,
        keptTopP: null,
        probs,
        u: null,
        chosen: best,
        keptCount: 1,
      });
    }

    for (let i = 0; i < V; i++) z[i] /= settings.temperature;
    const scaled = Float64Array.from(z);
    const tempProbs = softmax(scaled);

    const order = Array.from(z.keys()).sort((a, b) => z[b] - z[a]);
    let keptTopK = null;
    if (settings.topK > 0 && settings.topK < V) {
      const threshold = z[order[settings.topK - 1]];
      keptTopK = new Set();
      for (let i = 0; i < V; i++) {
        if (z[i] < threshold) z[i] = -Infinity;
        else keptTopK.add(i);
      }
    }

    let keptTopP = null;
    if (settings.topP < 1) {
      const p = softmax(z);
      keptTopP = new Set();
      let cumulative = 0;
      for (const id of order) {
        if (z[id] === -Infinity) continue;
        keptTopP.add(id);
        cumulative += p[id];
        if (cumulative >= settings.topP) break;
      }
      for (let i = 0; i < V; i++) if (!keptTopP.has(i)) z[i] = -Infinity;
    }

    const probs = softmax(z);
    const u = rng();
    let chosen = order.find((id) => probs[id] > 0);
    let cumulative = 0;
    for (const id of order) {
      if (probs[id] === 0) continue;
      cumulative += probs[id];
      chosen = id;
      if (u < cumulative) break;
    }
    let keptCount = 0;
    for (const p of probs) if (p > 0) keptCount++;
    return Object.assign(rec, { scaled, tempProbs, keptTopK, keptTopP, probs, u, chosen, keptCount, order });
  }

  // ---------------------------------------------------------------------------
  // The serving loop: template, prefill, then decode until a stop condition
  // ---------------------------------------------------------------------------

  const DEFAULT_SETTINGS = {
    temperature: 0.7,
    topK: 0,
    topP: 0.95,
    repetitionPenalty: 1,
    maxTokens: 48,
    seed: 7,
    stop: [],
  };

  /** Run one chat request and record everything. */
  function simulate(model, userText, options) {
    const settings = Object.assign({}, DEFAULT_SETTINGS, options);
    const tok = model.tokenizer;
    const c = model.config;
    const prompt = tok.encodeDialogPrompt(userText);
    const run = { settings, userText, prompt, passes: [], tokens: [], text: "", finish: null, error: null };

    // Every token in the context, with where it came from.
    let segIndex = 0;
    for (const seg of prompt.segments) {
      for (const id of seg.ids) run.tokens.push({ pos: run.tokens.length, id, origin: "prompt", kind: seg.kind, segment: segIndex });
      segIndex++;
    }
    if (prompt.ids.length >= c.max_seq_len) {
      run.error = `The prompt has ${prompt.ids.length} tokens. The context window holds ${c.max_seq_len}, and the reply needs at least one free position.`;
      return run;
    }

    const cache = model.newCache();
    const rng = rng32(settings.seed);
    const stream = new StreamDecoder(tok);
    const fed = [];
    let pending = prompt.ids.slice();
    let generatedCount = 0;

    for (let index = 0; ; index++) {
      const positions = pending.map((id) => {
        fed.push(id);
        return model.forward(id, cache);
      });
      const last = positions[positions.length - 1];
      const lens = last.layers.map((L) => ({
        afterAttention: softmax(model.unembed(L.residMid)),
        afterMlp: softmax(model.unembed(L.residOut)),
      }));
      const draw = sample(last.logits, fed, settings, rng);
      const token = draw.chosen;
      generatedCount++;
      const emitted = stream.push(token);
      const before = run.text;
      run.text += emitted.text;

      const checks = [];
      let finish = null;
      const isStopToken = tok.stopTokens.has(token);
      checks.push({ id: "stop-token", label: "Stop token", passed: isStopToken, detail: tok.label(token) });
      let matched = null;
      if (!isStopToken) {
        for (const s of settings.stop) {
          if (!s) continue;
          const from = Math.max(0, before.length - s.length + 1);
          const at = run.text.indexOf(s, from);
          if (at >= 0) {
            matched = s;
            run.text = run.text.slice(0, at);
            break;
          }
        }
      }
      checks.push({ id: "stop-sequence", label: "Stop sequence", passed: !!matched, detail: matched });
      const atMax = generatedCount >= settings.maxTokens;
      checks.push({ id: "max-tokens", label: "Maximum tokens", passed: atMax, detail: `${generatedCount} of ${settings.maxTokens}` });
      const full = cache.length >= c.max_seq_len;
      checks.push({ id: "context", label: "Context window", passed: full, detail: `${cache.length} of ${c.max_seq_len} positions` });

      if (isStopToken) finish = { reason: "stop", by: "stop-token", detail: tok.label(token) };
      else if (matched) finish = { reason: "stop", by: "stop-sequence", detail: matched };
      else if (atMax) finish = { reason: "length", by: "max-tokens", detail: `max_tokens = ${settings.maxTokens}` };
      else if (full) finish = { reason: "length", by: "context", detail: `context window = ${c.max_seq_len}` };

      const pos = cache.length;
      run.tokens.push({ pos, id: token, origin: "generated", kind: tok.isSpecial(token) ? "special" : "output", pass: index, fed: !finish });
      run.passes.push({
        index,
        kind: index === 0 ? "prefill" : "decode",
        positions,
        lens,
        draw,
        token,
        tokenPos: pos,
        emitted,
        textAfter: run.text,
        checks,
        finish,
        cacheLength: cache.length,
      });
      if (finish) {
        run.finish = finish;
        break;
      }
      pending = [token];
    }
    return run;
  }

  const api = { Model, Tokenizer, StreamDecoder, simulate, sample, softmax, topIndices, norm2, rng32, DEFAULT_SETTINGS, PRETOKENIZE };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TokenEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
