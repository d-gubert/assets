# 02 — Tensors and Weights

**Scope:** the data structure that holds the model, the four kinds of memory an LLM uses, and how to compute a model's size.
**Previous:** [01 Tokenizer](01-tokenizer.md). **Next:** [03 Embeddings and positions](03-embeddings-and-positions.md).

## What a tensor is

A tensor is a multi-dimensional array of numbers of one type. Every piece of data inside an LLM is a tensor: the weights, the token vectors, and the cache.

PyTorch describes a tensor as a **storage** plus **metadata** ([PyTorch docs, storage](https://docs.pytorch.org/docs/main/storage.html); [tensor attributes](https://docs.pytorch.org/docs/stable/tensor_attributes.html)):

| Part | Meaning | Example |
|------|---------|---------|
| Storage | One flat, contiguous block of bytes | 33,554,432 bytes |
| dtype | The number format of each element | `bfloat16` |
| Shape | The size of each dimension | `(4096, 4096)` |
| Stride | How many elements to skip to move one step in each dimension | `(4096, 1)` |
| Offset | Where the tensor starts inside the storage | `0` |
| Device | Where the storage lives | `cuda:0` |

This split is a systems design choice. A transpose or a slice changes only the metadata. It creates a new **view** of the same storage, with no data copy.

## The four kinds of memory

An LLM process holds four different kinds of tensor. Each kind has a different lifetime and a different owner.

| Kind | What it holds | Lifetime | Size depends on | Document |
|------|---------------|----------|-----------------|----------|
| **Weights** (parameters) | The learned numbers | Fixed after training; loaded once | Model architecture | this page |
| **Activations** | The intermediate vectors of one forward pass | One pass | Batch size × sequence length × model dimension | [04](04-transformer-block.md) |
| **KV cache** | Saved attention keys and values for earlier tokens | One request or conversation | Tokens in context × layers × KV heads | [08](08-inference-runtime.md) |
| **Optimizer state** | Gradients, master weights, and optimizer moments | Training only | Parameter count (about 16 bytes per parameter in total with Adam and mixed precision) | [12](12-training-lifecycle.md) |

For inference, the weights and the KV cache take nearly all GPU memory.

## Shapes inside the model

The main activation tensor has the shape `[batch, sequence length, model dimension]`.
Each row along the last dimension is the vector for one token. Every block reads a tensor of this shape and writes a tensor of the same shape (see [04](04-transformer-block.md)).

Most weights are 2-D matrices. A matrix with shape `[input size, output size]` converts a vector of one length into a vector of another length. Matrix multiplication is the dominant operation in an LLM, and GPUs are built to do it fast.

## Number formats (dtypes)

| dtype | Bytes per number | Notes |
|-------|------------------|-------|
| float32 (fp32) | 4 | The full-precision reference format. |
| float16 (fp16) | 2 | 5 exponent bits. Small range: the maximum is about 65,504. |
| bfloat16 (bf16) | 2 | 8 exponent bits, the same range as fp32, with less precision. Google designed it for TPUs ([Google Cloud blog](https://cloud.google.com/blog/products/ai-machine-learning/bfloat16-the-secret-to-high-performance-on-cloud-tpus)). Most modern LLMs train in bf16. |
| int8 | 1 | Used for quantized weights. See [11](11-model-files-and-quantization.md). |
| 4-bit | 0.5 | Used for quantized weights. Needs a scale factor per block of numbers. |

## Where the parameters are: a worked count

Llama 2 7B has 32 layers, a model dimension of 4,096, an MLP width of 11,008, and a vocabulary of 32,000. The count below uses only these values.

| Part | Calculation | Parameters |
|------|-------------|------------|
| Embedding table ([03](03-embeddings-and-positions.md)) | 32,000 × 4,096 | 131 M |
| Attention, per layer ([05](05-attention.md)) | 4 matrices × 4,096 × 4,096 | 67 M |
| MLP, per layer ([06](06-mlp-and-neurons.md)) | 3 matrices × 4,096 × 11,008 | 135 M |
| Norms, per layer | 2 × 4,096 | 0.008 M |
| **All 32 layers** | 32 × 202 M | 6,480 M |
| Output head ([07](07-output-and-sampling.md)) | 4,096 × 32,000 | 131 M |
| **Total** | | **about 6.74 B** |

Three observations:

1. **The MLP layers hold about two thirds of the per-layer weights.** [Geva et al. (2021)](https://aclanthology.org/2021.emnlp-main.446) report the same two-thirds share for transformers in general.
2. **The norms are tiny.** They have almost no parameters.
3. **The vocabulary matters.** The embedding table and output head together hold 262 M parameters here. With a 128K vocabulary, they hold four times as many.

## From parameter count to memory and compute

- **Memory for weights** = parameters × bytes per parameter. Llama 2 7B in bf16 needs 6.74 B × 2 = about 13.5 GB. Llama 2 70B needs about 140 GB.
- **Compute per token** is about 2 × parameters floating-point operations for a forward pass. This is a standard estimate ([Kaplan et al., 2020](https://arxiv.org/abs/2001.08361)). One multiply and one add for each weight.
- **Memory traffic per token** matters more than compute in text generation. To produce one token, the GPU must read every weight once. [08 Inference runtime](08-inference-runtime.md) explains why this sets the speed limit.

## Sources

- PyTorch documentation, *torch.Storage* — https://docs.pytorch.org/docs/main/storage.html
- PyTorch documentation, *Tensor Attributes* — https://docs.pytorch.org/docs/stable/tensor_attributes.html
- Google Cloud, *BFloat16: The secret to high performance on Cloud TPUs* — https://cloud.google.com/blog/products/ai-machine-learning/bfloat16-the-secret-to-high-performance-on-cloud-tpus
- Higham, *What Is Bfloat16 Arithmetic?* — https://nhigham.com/2020/06/02/what-is-bfloat16-arithmetic/
- Touvron et al., *Llama 2: Open Foundation and Fine-Tuned Chat Models*, 2023 — https://arxiv.org/abs/2307.09288
- Geva et al., *Transformer Feed-Forward Layers Are Key-Value Memories*, EMNLP 2021 — https://aclanthology.org/2021.emnlp-main.446
- Kaplan et al., *Scaling Laws for Neural Language Models*, 2020 — https://arxiv.org/abs/2001.08361
