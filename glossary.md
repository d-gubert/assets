# Glossary

One-line definitions for the terms in this document set. The number in brackets points to the document that explains the term.

| Term | Definition |
|------|------------|
| Activation function | A fixed non-linear function inside the MLP, for example SiLU or GELU. [06](06-mlp-and-neurons.md) |
| Activation | An intermediate value that the model computes during a forward pass. [02](02-tensors-and-weights.md) |
| Attention head | One of many parallel, independent attention lookups inside a layer. [05](05-attention.md) |
| Attention | The sub-layer that moves information between token positions. [05](05-attention.md) |
| Attribution graph | A traced graph of the features that caused one output. [13](13-interpretability.md) |
| Autoregressive generation | The loop that predicts one token, appends it, and predicts again. [00](00-big-picture.md) |
| Base model | The model after pretraining and before instruction tuning. [12](12-training-lifecycle.md) |
| bfloat16 (bf16) | A 16-bit number format with the same range as float32. [02](02-tensors-and-weights.md) |
| Block (layer) | One repeated unit of the stack: attention plus MLP, with norms and residual additions. [04](04-transformer-block.md) |
| BPE (Byte-Pair Encoding) | A tokenizer algorithm that merges frequent adjacent pairs into new tokens. [01](01-tokenizer.md) |
| Causal mask | The rule that a token can attend only to itself and earlier tokens. [05](05-attention.md) |
| Chain of thought (CoT) | Intermediate reasoning tokens that a model writes before its final answer. [14](14-reasoning-models.md) |
| Chat template | A Jinja template that converts chat messages into one token sequence. [01](01-tokenizer.md) |
| Circuit | A sub-graph of features and weights that implements one behavior. [13](13-interpretability.md) |
| Context window | The maximum number of tokens the model accepts in one sequence. [03](03-embeddings-and-positions.md) |
| Continuous batching | A scheduler that adds and removes requests after every decode step. [08](08-inference-runtime.md) |
| Decode | The phase that generates output tokens one at a time. Memory-bound. [08](08-inference-runtime.md) |
| Detokenizer | The function that converts token IDs back to text. [01](01-tokenizer.md) |
| Distillation | Fine-tuning a small model on outputs, such as reasoning chains, from a large model. [14](14-reasoning-models.md) |
| dtype | The number format of a tensor's elements. [02](02-tensors-and-weights.md) |
| Embedding table | The weight matrix that maps each token ID to a vector. [03](03-embeddings-and-positions.md) |
| Expert | One of many MLPs in a mixture-of-experts layer. [10](10-mixture-of-experts.md) |
| Feature | A meaningful direction in activation space. Not the same as a neuron. [13](13-interpretability.md) |
| FlashAttention | An exact attention implementation that reduces GPU memory traffic. [05](05-attention.md) |
| GGUF | The single-file model format of llama.cpp. [11](11-model-files-and-quantization.md) |
| GQA (grouped-query attention) | Attention in which groups of query heads share one key/value head. [05](05-attention.md) |
| GRPO | An RL method that compares each attempt with the average of a group of attempts for the same problem. [14](14-reasoning-models.md) |
| Induction head | An attention circuit that finds an earlier copy of the current token and predicts what followed it. [05](05-attention.md) |
| KV cache | Saved attention keys and values of earlier tokens, reused at each decode step. [08](08-inference-runtime.md) |
| Logit | The raw score that the output head gives to one vocabulary entry. [07](07-output-and-sampling.md) |
| LoRA | Small add-on matrices that fine-tune a frozen model. [12](12-training-lifecycle.md) |
| MLP (feed-forward network) | The sub-layer that transforms each token vector alone. [06](06-mlp-and-neurons.md) |
| Model dimension (d_model) | The length of each token vector in the residual stream. [04](04-transformer-block.md) |
| MoE (mixture of experts) | A design in which a router sends each token to a few of many experts. [10](10-mixture-of-experts.md) |
| Neuron | One hidden unit of an MLP layer: a read vector, an activation function, and a write vector. [06](06-mlp-and-neurons.md) |
| Output head (LM head, unembedding) | The matrix that converts the final vector into one logit per vocabulary entry. [07](07-output-and-sampling.md) |
| PagedAttention | KV cache management with fixed-size blocks, like OS memory pages. [08](08-inference-runtime.md) |
| Parameter (weight) | One learned number in the model. [02](02-tensors-and-weights.md) |
| Pipeline parallelism | A split that puts different blocks on different GPUs. [09](09-scaling-across-devices.md) |
| Polysemantic neuron | A neuron that responds to several unrelated features. [13](13-interpretability.md) |
| Prefill | The phase that processes the whole prompt in one pass. Compute-bound. [08](08-inference-runtime.md) |
| Quantization | Storage of numbers in fewer bits, with scale factors. [11](11-model-files-and-quantization.md) |
| Reasoning model | A model trained with RL to write a long chain of thought before it answers. [14](14-reasoning-models.md) |
| Residual stream | The shared vector per token that every layer reads from and adds to. [04](04-transformer-block.md) |
| RLHF | Reinforcement learning from human feedback: tuning with a reward model trained on human rankings. [12](12-training-lifecycle.md) |
| RLVR | Reinforcement learning with verifiable rewards: a program, not a person, checks the answer. [14](14-reasoning-models.md) |
| RMSNorm | A normalization that rescales a vector by its root-mean-square size. [04](04-transformer-block.md) |
| RoPE | Rotary position embedding: a position-dependent rotation of queries and keys. [03](03-embeddings-and-positions.md) |
| Router | The small layer in an MoE block that picks experts for each token. [10](10-mixture-of-experts.md) |
| safetensors | A weight file format with a JSON header and raw data, and no executable code. [11](11-model-files-and-quantization.md) |
| Sampler | The runtime policy that picks one token from the logits. [07](07-output-and-sampling.md) |
| Sparse autoencoder (SAE) | A helper network that decomposes activations into interpretable features. [13](13-interpretability.md) |
| Special token | A vocabulary entry with a control meaning, such as end-of-sequence. [01](01-tokenizer.md) |
| Speculative decoding | A small model proposes tokens, and the large model verifies them in one pass. [08](08-inference-runtime.md) |
| Superposition | The storage of more features than dimensions in overlapping directions. [13](13-interpretability.md) |
| SwiGLU | A gated MLP variant with three matrices: gate, up, and down. [06](06-mlp-and-neurons.md) |
| Temperature | A sampler setting that sharpens or flattens the probability distribution. [07](07-output-and-sampling.md) |
| Tensor parallelism | A split of each weight matrix across GPUs. [09](09-scaling-across-devices.md) |
| Tensor | A multi-dimensional array of numbers with a dtype, shape, and device. [02](02-tensors-and-weights.md) |
| Test-time compute | Extra inference work, such as longer chains or more samples, spent to improve an answer. [14](14-reasoning-models.md) |
| Token | A unit of text that the tokenizer maps to one integer ID. [01](01-tokenizer.md) |
| Tokenizer | The component that converts text to token IDs and back. [01](01-tokenizer.md) |
| Top-k / top-p | Sampler filters that keep only the most probable tokens. [07](07-output-and-sampling.md) |
| Vocabulary | The fixed set of all tokens that a tokenizer can produce. [01](01-tokenizer.md) |
