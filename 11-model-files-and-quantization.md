# 11 — Model Files and Quantization

**Scope:** what a model looks like on disk, the two main file formats, and how quantization shrinks a model.
**Previous:** [10 Mixture of experts](10-mixture-of-experts.md). **Next:** [12 Training lifecycle](12-training-lifecycle.md).

## A model repository on disk

A model in the Hugging Face layout is a folder of plain files. Each file maps to a component in this document set:

| File | Contents | Component |
|------|----------|-----------|
| `config.json` | Architecture settings: layers, model dimension, heads, KV heads, MLP width, vocabulary size, RoPE settings | The graph shape ([00](00-big-picture.md)) |
| `tokenizer.json` | Vocabulary, merge rules, normalizer, pre-tokenizer | [01 Tokenizer](01-tokenizer.md) |
| `tokenizer_config.json` | Special tokens and the **chat template** | [01 Tokenizer](01-tokenizer.md) |
| `generation_config.json` | Default sampler settings, such as temperature and stop tokens | [07 Sampling](07-output-and-sampling.md) |
| `model-00001-of-00004.safetensors` … | The weight tensors, split into shards | [02 Tensors and weights](02-tensors-and-weights.md) |
| `model.safetensors.index.json` | A map from each tensor name to its shard file | — |

The config and the weights must agree. The runtime builds the empty graph from `config.json`, then fills it with tensors by name.

## Tensor names show the architecture

Each tensor has a path-like name. A Llama-style model uses names like these:

```
model.embed_tokens.weight                    # embedding table (03)
model.layers.0.input_layernorm.weight        # RMSNorm before attention (04)
model.layers.0.self_attn.q_proj.weight       # W_Q (05)
model.layers.0.self_attn.k_proj.weight       # W_K (05)
model.layers.0.self_attn.v_proj.weight       # W_V (05)
model.layers.0.self_attn.o_proj.weight       # W_O (05)
model.layers.0.post_attention_layernorm.weight
model.layers.0.mlp.gate_proj.weight          # SwiGLU gate (06)
model.layers.0.mlp.up_proj.weight            # SwiGLU up (06)
model.layers.0.mlp.down_proj.weight          # SwiGLU down (06)
...                                          # layers 1 to N-1
model.norm.weight                            # final norm (07)
lm_head.weight                               # output head (07)
```

A list of tensor names and shapes is a reliable way to learn a model's real architecture.

## safetensors

[safetensors](https://github.com/huggingface/safetensors) is the standard weight format on the Hugging Face Hub. Its layout:

1. **8 bytes:** the length of the header.
2. **JSON header:** for each tensor, its name, dtype, shape, and byte offsets. An optional `__metadata__` entry holds string key-value pairs.
3. **Data:** the raw tensor bytes, back to back.

Design properties:

- **No code execution.** The older PyTorch format uses Python pickle, which can run arbitrary code at load time. In February 2024, JFrog reported models on the Hugging Face Hub whose pickle files opened a remote shell for the attacker when a user loaded them. safetensors contains only data.
- **Memory mapping.** The runtime can map the file into memory and load each tensor only when it needs it.
- **Cheap inspection.** A tool can read only the header, even over HTTP range requests, to list the tensors without a download of the weights ([safetensors docs](https://huggingface.co/docs/safetensors/metadata_parsing)).

## GGUF

[GGUF](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md) is the format of llama.cpp and the ggml library. It puts **everything in one file**: architecture settings, tokenizer, chat template, and weights.
Its layout is a magic number, a version, typed key-value metadata (for example `general.architecture`, `{arch}.block_count`, and `tokenizer.ggml.*` keys), tensor descriptors, and aligned tensor data that the runtime can memory-map.

GGUF targets local inference. Its file names often carry the quantization type, such as `Q4_K_M` or `Q8_0`.

## Quantization

Quantization stores numbers in fewer bits. Most methods store small integers plus a **scale factor** for each block of numbers. At run time, the kernel converts each block back to an approximate real value.

| Llama 2 70B weights | Bytes per parameter | Approximate size |
|---------------------|---------------------|------------------|
| bf16 | 2 | 140 GB |
| int8 | 1 | 70 GB |
| 4-bit | about 0.5 (plus scales) | about 35–40 GB |

### Why quantization makes generation faster

Decode is limited by memory bandwidth ([08](08-inference-runtime.md)). Half the bytes means about half the time to read the weights. So quantization raises speed as well as capacity, even if the arithmetic itself stays in 16-bit.

### What to quantize

| Target | Effect |
|--------|--------|
| Weights only | The most common choice. It shrinks the model and speeds up decode. |
| Weights and activations | Also speeds up compute-bound work such as prefill. It is harder to keep accurate. |
| KV cache | Fits longer contexts and larger batches. |

### Two reference methods

- **LLM.int8()** ([Dettmers et al., 2022](https://arxiv.org/abs/2208.07339)) found that large models develop a few **outlier features** with very large values. A plain 8-bit format damages them. The method keeps the outlier dimensions in 16-bit and puts more than 99.9% of the values in 8-bit. The authors report no quality loss up to 175 B parameters.
- **GPTQ** ([Frantar et al., 2022](https://arxiv.org/abs/2210.17323)) is a one-time, post-training method. It uses a small calibration dataset to choose the rounding that does the least damage. It quantized 175 B-parameter models to 3–4 bits in about four GPU hours, with small accuracy loss.

### Trade-offs

- Accuracy falls as bits fall. 8-bit is usually close to the original. 4-bit is a common practical balance. Below 4 bits, quality loss is often visible.
- Post-training quantization (PTQ) needs no retraining. Quantization-aware training (QAT) trains the model with the low-bit format in the loop and usually keeps more quality.

## Sources

- Hugging Face, *safetensors* repository — https://github.com/huggingface/safetensors
- Hugging Face, *safetensors: metadata parsing* — https://huggingface.co/docs/safetensors/metadata_parsing
- ggml project, *GGUF specification* — https://github.com/ggml-org/ggml/blob/master/docs/gguf.md
- JFrog Security Research, *Data Scientists Targeted by Malicious Hugging Face ML Models with Silent Backdoor*, 2024 — https://jfrog.com/blog/data-scientists-targeted-by-malicious-hugging-face-ml-models-with-silent-backdoor/
- Dettmers et al., *LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale*, NeurIPS 2022 — https://arxiv.org/abs/2208.07339
- Frantar et al., *GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers*, ICLR 2023 — https://arxiv.org/abs/2210.17323
