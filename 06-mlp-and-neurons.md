# 06 — MLP Layers and Neurons

**Scope:** the MLP (feed-forward) sub-layer, what a "neuron" is in an LLM, and where the model stores facts.
**Previous:** [05 Attention](05-attention.md). **Next:** [07 Output and sampling](07-output-and-sampling.md).

## Role in the system

The MLP (multi-layer perceptron, also "feed-forward network") is the second sub-layer of every block ([04](04-transformer-block.md)).
It processes each token vector **alone**. It does not look at other tokens. That is the job of attention ([05](05-attention.md)).

The MLP layers hold about two thirds of the model's weights ([Geva et al., 2021](https://aclanthology.org/2021.emnlp-main.446); worked count in [02](02-tensors-and-weights.md)). So they also do most of the arithmetic.

## Structure: expand, filter, compress

```mermaid
flowchart LR
    A["Token vector<br/>4,096 numbers"] --> B["Up projection<br/>4,096 → 11,008"]
    B --> C["Activation function<br/>(non-linear filter)"]
    C --> D["Down projection<br/>11,008 → 4,096"]
    D --> E["Add to residual stream"]
```

The sizes are for Llama 2 7B.

1. **Expand.** A matrix projects the vector into a wider space. The width is the "MLP width" or "hidden size".
2. **Filter.** A fixed non-linear function acts on each number on its own. It suppresses some numbers and passes others. Without this step, the whole network would reduce to one big linear function.
3. **Compress.** A second matrix projects the result back to the model dimension. The result is added to the residual stream.

Modern models use a **gated** variant, SwiGLU ([Shazeer, 2020](https://arxiv.org/abs/2002.05202)). It has **three** matrices: a "gate" projection and an "up" projection run side by side, and their results multiply before the "down" projection. Llama 2 uses SwiGLU ([Llama 2 paper](https://arxiv.org/abs/2307.09288)).

## What a "neuron" is

In an LLM, a **neuron** is one dimension of the MLP's wide hidden layer. Llama 2 7B has 11,008 neurons per layer, so 32 × 11,008 = 352,256 MLP neurons in total.

Each neuron is a small, fixed unit with three parts:

| Part | Where it lives | What it does |
|------|----------------|--------------|
| Read vector | One row of the up (and gate) matrix | Measures how much the input matches a pattern. |
| Activation | The non-linear function | Decides how strongly the neuron fires. |
| Write vector | One column of the down matrix | The direction the neuron adds to the residual stream when it fires. |

So each neuron acts as a rule: **"if the input matches pattern P, add vector W to the stream, in proportion to the match."**

An LLM neuron is not a biological neuron. It is a dot product plus a fixed function. The name is historical.

"Neuron" sometimes also means one dimension of the residual stream. This document set uses "neuron" only for the MLP hidden units.

## MLP layers as key-value memories

[Geva et al. (2021)](https://aclanthology.org/2021.emnlp-main.446) propose a memory view of the MLP:

- The read vectors act as **keys**. Each key detects a text pattern from the training data.
- The write vectors act as **values**. Each value pushes the output toward a set of likely next tokens.
- Lower layers detect shallow patterns. Upper layers detect more semantic patterns.
- The MLP output is a mix of many such memories. Later layers refine it through the residual stream.

## Where the model stores facts

Evidence points to the middle-layer MLPs as a main store of factual associations, such as "the Eiffel Tower is in Paris".

- [Meng et al. (2022), ROME](https://arxiv.org/abs/2202.05262) traced which components carry a fact. They found decisive activity in mid-layer MLPs at the subject's last token. They then changed one fact by an edit to one MLP weight matrix.
- 3Blue1Brown's chapter 7, *How might LLMs store facts*, explains the same idea visually ([3Blue1Brown](https://www.3blue1brown.com/topics/neural-networks)).

Facts are not stored in one place like a row in a database. They are spread across many weights and layers.

## Neurons are usually not clean concepts

It is tempting to expect one neuron per concept. In practice, most neurons in an LLM are **polysemantic**: one neuron fires for several unrelated things.
The cause is **superposition**. The model represents more concepts ("features") than it has neurons, so it shares neurons between features ([Elhage et al., 2022](https://transformer-circuits.pub/2022/toy_model/index.html)).
So the useful unit of analysis is the **feature**, not the neuron. See [13 Interpretability](13-interpretability.md).

## System properties

- **Embarrassingly parallel across tokens.** The MLP treats each token alone, so a batch of tokens is one large matrix multiplication.
- **The largest weight block.** Quantization ([11](11-model-files-and-quantization.md)) saves the most memory here.
- **The target of mixture of experts.** MoE models replace the single MLP with many expert MLPs and run only a few per token. See [10](10-mixture-of-experts.md).

## Sources

- Geva et al., *Transformer Feed-Forward Layers Are Key-Value Memories*, EMNLP 2021 — https://aclanthology.org/2021.emnlp-main.446
- Meng et al., *Locating and Editing Factual Associations in GPT (ROME)*, NeurIPS 2022 — https://arxiv.org/abs/2202.05262
- Shazeer, *GLU Variants Improve Transformer*, 2020 — https://arxiv.org/abs/2002.05202
- Touvron et al., *Llama 2*, 2023 — https://arxiv.org/abs/2307.09288
- Elhage et al., *Toy Models of Superposition*, Anthropic, 2022 — https://transformer-circuits.pub/2022/toy_model/index.html
- 3Blue1Brown, *How might LLMs store facts* (Deep Learning, chapter 7) — https://www.3blue1brown.com/topics/neural-networks
