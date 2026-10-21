# Sources

This page lists every source in the document set, grouped by trust tier. Each entry names the documents that use it.

## Trust tiers

| Tier | Meaning |
|------|---------|
| **1 — Primary, reviewed** | A peer-reviewed paper, or the official technical report or documentation of the team that built the system. |
| **2 — Primary, not peer-reviewed** | Original research or engineering write-ups from the lab or vendor that did the work. Reliable for what the authors did. Read claims of general truth with care. |
| **3 — Expert teaching material** | Explanations by recognized experts. Good for intuition. Check exact numbers against tier 1. |

## Method and limits

- Research date: 2026-10-08. Document 14 was added on 2026-10-11. The simulation in `simulation/` was added on 2026-10-21. Its section below logs each web search and fetch.
- The network policy of the research environment blocked direct page fetches for arxiv.org, huggingface.co, and transformer-circuits.pub. The research confirmed each source through web search results: titles, authors, venues, abstracts, and quoted passages.
- Some claims rest on well-established facts that the search did not quote word for word. Examples: the Llama 2 7B layer sizes, and the tensor names in [11](11-model-files-and-quantization.md). Verify exact numbers against the primary source before you rely on them.

## Architecture and foundations

| Source | Tier | Used in |
|--------|------|---------|
| Vaswani et al., *Attention Is All You Need*, NeurIPS 2017 — https://arxiv.org/abs/1706.03762 | 1 | 00, 03, 05 |
| Touvron et al., *Llama 2: Open Foundation and Fine-Tuned Chat Models*, 2023 — https://arxiv.org/abs/2307.09288 | 1 | 02, 03, 04, 06 |
| Llama Team, *The Llama 3 Herd of Models*, 2024 — https://arxiv.org/abs/2407.21783 | 1 | 00, 01, 04, 05, 12 |
| Zhang and Sennrich, *Root Mean Square Layer Normalization*, NeurIPS 2019 — https://arxiv.org/abs/1910.07467 | 1 | 04 |
| Xiong et al., *On Layer Normalization in the Transformer Architecture*, ICML 2020 — https://arxiv.org/abs/2002.04745 | 1 | 04 |
| Shazeer, *GLU Variants Improve Transformer*, 2020 — https://arxiv.org/abs/2002.05202 | 2 | 06 |
| Kaplan et al., *Scaling Laws for Neural Language Models*, 2020 — https://arxiv.org/abs/2001.08361 | 2 | 02, 12 |

## Tokenizer

| Source | Tier | Used in |
|--------|------|---------|
| Sennrich, Haddow, Birch, *Neural Machine Translation of Rare Words with Subword Units*, ACL 2016 — https://arxiv.org/abs/1508.07909 | 1 | 01 |
| Kudo and Richardson, *SentencePiece*, EMNLP 2018 — https://arxiv.org/abs/1808.06226 | 1 | 01 |
| Hugging Face, *Tokenizers: the tokenization pipeline* — https://huggingface.co/docs/tokenizers/pipeline | 1 | 01 |
| Hugging Face, *Chat templates* — https://huggingface.co/docs/transformers/main/chat_templating | 1 | 01 |
| Karpathy, *minbpe* — https://github.com/karpathy/minbpe | 3 | 01 |
| Karpathy, *Let's build the GPT Tokenizer* (video) — https://www.youtube.com/watch?v=zduSFxRajkE | 3 | 01 |
| Hugging Face, *LLM Course, chapter 6.5: BPE* — https://huggingface.co/learn/llm-course/chapter6/5 | 3 | 01 |
| Cloudflare, *Meta Llama 3 available on Cloudflare Workers AI* — https://blog.cloudflare.com/meta-llama-3-available-on-cloudflare-workers-ai/ | 2 | 01 |

## Tensors and number formats

| Source | Tier | Used in |
|--------|------|---------|
| PyTorch, *torch.Storage* — https://docs.pytorch.org/docs/main/storage.html | 1 | 02 |
| PyTorch, *Tensor Attributes* — https://docs.pytorch.org/docs/stable/tensor_attributes.html | 1 | 02 |
| Google Cloud, *BFloat16: The secret to high performance on Cloud TPUs* — https://cloud.google.com/blog/products/ai-machine-learning/bfloat16-the-secret-to-high-performance-on-cloud-tpus | 2 | 02 |
| Higham, *What Is Bfloat16 Arithmetic?* — https://nhigham.com/2020/06/02/what-is-bfloat16-arithmetic/ | 3 | 02 |

## Positions and attention

| Source | Tier | Used in |
|--------|------|---------|
| Su et al., *RoFormer: Rotary Position Embedding*, 2021 — https://arxiv.org/abs/2104.09864 | 1 | 03 |
| Press, Smith, Lewis, *ALiBi*, ICLR 2022 — https://arxiv.org/abs/2108.12409 | 1 | 03 |
| Chen et al., *Positional Interpolation*, 2023 — https://arxiv.org/abs/2306.15595 | 2 | 03 |
| Shazeer, *Fast Transformer Decoding: One Write-Head is All You Need* (MQA), 2019 — https://arxiv.org/abs/1911.02150 | 2 | 05 |
| Ainslie et al., *GQA*, EMNLP 2023 — https://arxiv.org/abs/2305.13245 | 1 | 05 |
| Dao et al., *FlashAttention*, NeurIPS 2022 — https://arxiv.org/abs/2205.14135 | 1 | 05, 08 |

## MLP, neurons, and interpretability

| Source | Tier | Used in |
|--------|------|---------|
| Geva et al., *Transformer Feed-Forward Layers Are Key-Value Memories*, EMNLP 2021 — https://aclanthology.org/2021.emnlp-main.446 | 1 | 02, 04, 06 |
| Meng et al., *Locating and Editing Factual Associations in GPT (ROME)*, NeurIPS 2022 — https://arxiv.org/abs/2202.05262 | 1 | 06, 13 |
| Olah et al., *Zoom In: An Introduction to Circuits*, Distill 2020 — https://distill.pub/2020/circuits/zoom-in/ | 1 | 13 |
| Elhage et al., *A Mathematical Framework for Transformer Circuits*, 2021 — https://transformer-circuits.pub/2021/framework/index.html | 2 | 04, 05, 13 |
| Elhage et al., *Toy Models of Superposition*, 2022 — https://transformer-circuits.pub/2022/toy_model/index.html | 2 | 06, 13 |
| Olsson et al., *In-context Learning and Induction Heads*, 2022 — https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html | 2 | 05, 13 |
| Bricken et al., *Towards Monosemanticity*, 2023 — https://transformer-circuits.pub/2023/monosemantic-features/index.html | 2 | 13 |
| Templeton et al., *Scaling Monosemanticity*, 2024 — https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html | 2 | 04, 13 |
| Anthropic, *Golden Gate Claude*, 2024 — https://www.anthropic.com/news/golden-gate-claude | 2 | 13 |
| Ameisen et al., *Circuit Tracing*, 2025 — https://transformer-circuits.pub/2025/attribution-graphs/methods.html | 2 | 13 |
| Lindsey et al., *On the Biology of a Large Language Model*, 2025 — https://transformer-circuits.pub/2025/attribution-graphs/biology.html | 2 | 13, 14 |

## Output and sampling

| Source | Tier | Used in |
|--------|------|---------|
| Holtzman et al., *The Curious Case of Neural Text Degeneration*, ICLR 2020 — https://arxiv.org/abs/1904.09751 | 1 | 07 |
| Hugging Face, *Generation strategies* — https://huggingface.co/docs/transformers/main/en/generation_strategies | 1 | 07 |
| Hugging Face blog, *How to generate text* — https://huggingface.co/blog/how-to-generate | 3 | 07 |
| Willard and Louf, *Efficient Guided Generation for LLMs*, 2023 — https://arxiv.org/abs/2307.09702 | 2 | 07 |
| He et al. (Thinking Machines Lab), *Defeating Nondeterminism in LLM Inference*, 2025 — https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/ | 2 | 07 |

## Inference and serving

| Source | Tier | Used in |
|--------|------|---------|
| Yu et al., *Orca*, OSDI 2022 — https://www.usenix.org/conference/osdi22/presentation/yu | 1 | 08 |
| Kwon et al., *PagedAttention / vLLM*, SOSP 2023 — https://arxiv.org/abs/2309.06180 | 1 | 08 |
| Leviathan, Kalman, Matias, *Speculative Decoding*, ICML 2023 — https://arxiv.org/abs/2211.17192 | 1 | 08 |
| NVIDIA, *Mastering LLM Techniques: Inference Optimization* — https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/ | 2 | 08 |
| NVIDIA, *TensorRT-LLM Chunked Prefill* — https://developer.nvidia.com/blog/streamlining-ai-inference-performance-and-deployment-with-nvidia-tensorrt-llm-chunked-prefill/ | 2 | 08 |

## Distributed execution and MoE

| Source | Tier | Used in |
|--------|------|---------|
| Shoeybi et al., *Megatron-LM*, 2019 — https://arxiv.org/abs/1909.08053 | 2 | 09 |
| Narayanan et al., *Efficient Large-Scale Training with Megatron-LM*, SC 2021 — https://arxiv.org/abs/2104.04473 | 1 | 09 |
| Huang et al., *GPipe*, NeurIPS 2019 — https://arxiv.org/abs/1811.06965 | 1 | 09 |
| Rajbhandari et al., *ZeRO*, SC 2020 — https://arxiv.org/abs/1910.02054 | 1 | 02, 09, 12 |
| PyTorch, *FSDP tutorial* — https://docs.pytorch.org/tutorials/intermediate/FSDP_tutorial.html | 1 | 09 |
| Shazeer et al., *Sparsely-Gated Mixture-of-Experts*, ICLR 2017 — https://arxiv.org/abs/1701.06538 | 1 | 10 |
| Lepikhin et al., *GShard*, 2020 — https://arxiv.org/abs/2006.16668 | 2 | 10 |
| Fedus, Zoph, Shazeer, *Switch Transformers*, JMLR 2022 — https://arxiv.org/abs/2101.03961 | 1 | 10 |
| Jiang et al., *Mixtral of Experts*, 2024 — https://arxiv.org/abs/2401.04088 | 1 | 10 |

## Files, quantization, and training

| Source | Tier | Used in |
|--------|------|---------|
| Hugging Face, *safetensors* — https://github.com/huggingface/safetensors | 1 | 11 |
| Hugging Face, *safetensors: metadata parsing* — https://huggingface.co/docs/safetensors/metadata_parsing | 1 | 11 |
| ggml project, *GGUF specification* — https://github.com/ggml-org/ggml/blob/master/docs/gguf.md | 1 | 11 |
| JFrog, *Malicious Hugging Face ML Models with Silent Backdoor*, 2024 — https://jfrog.com/blog/data-scientists-targeted-by-malicious-hugging-face-ml-models-with-silent-backdoor/ | 2 | 11 |
| Dettmers et al., *LLM.int8()*, NeurIPS 2022 — https://arxiv.org/abs/2208.07339 | 1 | 11 |
| Frantar et al., *GPTQ*, ICLR 2023 — https://arxiv.org/abs/2210.17323 | 1 | 11 |
| Hoffmann et al., *Chinchilla*, 2022 — https://arxiv.org/abs/2203.15556 | 1 | 12 |
| Ouyang et al., *InstructGPT*, NeurIPS 2022 — https://arxiv.org/abs/2203.02155 | 1 | 12 |
| Rafailov et al., *DPO*, NeurIPS 2023 — https://arxiv.org/abs/2305.18290 | 1 | 12 |
| Hu et al., *LoRA*, ICLR 2022 — https://arxiv.org/abs/2106.09685 | 1 | 12 |

## Reasoning models

| Source | Tier | Used in |
|--------|------|---------|
| Wei et al., *Chain-of-Thought Prompting*, NeurIPS 2022 — https://arxiv.org/abs/2201.11903 | 1 | 14 |
| Kojima et al., *Large Language Models are Zero-Shot Reasoners*, NeurIPS 2022 — https://arxiv.org/abs/2205.11916 | 1 | 14 |
| Wang et al., *Self-Consistency*, ICLR 2023 — https://arxiv.org/abs/2203.11171 | 1 | 14 |
| Lightman et al., *Let's Verify Step by Step*, ICLR 2024 — https://arxiv.org/abs/2305.20050 | 1 | 14 |
| Li et al., *Chain of Thought Empowers Transformers to Solve Inherently Serial Problems*, ICLR 2024 — https://arxiv.org/abs/2402.12875 | 1 | 14 |
| OpenAI, *Learning to Reason with LLMs*, 2024 — https://openai.com/index/learning-to-reason-with-llms/ | 2 | 14 |
| Snell et al., *Scaling LLM Test-Time Compute Optimally*, 2024 — https://arxiv.org/abs/2408.03314 | 2 | 14 |
| Shao et al., *DeepSeekMath* (GRPO), 2024 — https://arxiv.org/abs/2402.03300 | 2 | 14 |
| Lambert et al., *Tülu 3* (RLVR), 2024 — https://arxiv.org/abs/2411.15124 | 2 | 14 |
| DeepSeek-AI, *DeepSeek-R1*, 2025 — https://arxiv.org/abs/2501.12948 | 2 | 14 |
| Muennighoff et al., *s1: Simple test-time scaling*, EMNLP 2025 — https://arxiv.org/abs/2501.19393 | 1 | 14 |
| Yue et al., *Does RL Really Incentivize Reasoning Capacity Beyond the Base Model?*, NeurIPS 2025 — https://arxiv.org/abs/2504.13837 | 1 | 14 |
| Chen et al. (Anthropic), *Reasoning Models Don't Always Say What They Think*, 2025 — https://www.anthropic.com/research/reasoning-models-dont-say-think | 2 | 14 |
| Baker et al. (OpenAI), *Monitoring Reasoning Models for Misbehavior*, 2025 — https://arxiv.org/abs/2503.11926 | 2 | 14 |
| Anthropic, *Tracing the thoughts of a large language model*, 2025 — https://www.anthropic.com/research/tracing-thoughts-language-model | 2 | 14 |
| Shojaee et al. (Apple), *The Illusion of Thinking*, 2025 — https://machinelearning.apple.com/research/illusion-of-thinking | 2 | 14 |
| Lawsen, *The Illusion of the Illusion of Thinking*, 2025 — https://arxiv.org/abs/2506.09250 | 2 | 14 |
| Anthropic, *Building with extended thinking* (API docs) — https://platform.claude.com/docs/en/build-with-claude/extended-thinking | 1 | 14 |

## Token lifecycle simulation

The [simulation](simulation/README.md) builds on documents 00 to 08. The research for it on 2026-10-21 looked for the exact details that a working model and runtime need: the Llama 3 chat format and its token IDs, the order of the logit processors, the stop rules, and two interpretability methods that the page shows.

Unlike in the first research round, direct fetches from GitHub, docs.vllm.ai, and huggingface.co worked.

### Search log

| # | Search or fetch | What it confirmed | Used for |
|---|-----------------|-------------------|----------|
| 1 | Web search: `Meta-Llama-3-8B-Instruct config.json vocab_size 128256 rope_theta 500000 num_key_value_heads 8 intermediate_size 14336` | Community copies of the config agree on these values. No official copy was in the results, so fetch 11 checked them. | Llama 3 8B column of the comparison table |
| 2 | Web search: `Llama 3 prompt format special tokens begin_of_text start_header_id end_header_id eot_id 128009 generation_config eos_token_id` | Meta's prompt-format page gives the role of each special token. It gives no token IDs. | Chat template stage |
| 3 | Web search: `llama3 tokenizer.py pat_str regex …` | torchtune and llama.cpp use the same pre-tokenizer pattern. The upstream file was not in the results, so fetch 8 read it. | Pre-tokenizer stage |
| 4 | Web search: `Hugging Face transformers generate logits processor order repetition penalty temperature top_k top_p` | No clear answer. Fetch 10 read the source code. | Sampler stage |
| 5 | Web search: `vLLM sampler order penalties temperature top-k top-p min-p` | The vLLM `Sampler` documentation lists the order. Fetch 9 read the full list. | Sampler stage |
| 6 | Web search: `CTRL Keskar 2019 repetition penalty discount logits of previously generated tokens penalty 1.2` | CTRL introduced "penalized sampling": a factor θ on the logits of earlier tokens, with θ ≈ 1.2. | Repetition penalty setting |
| 7 | Web search: `OpenAI chat completions finish_reason "stop" "length" natural stop point or stop sequence max_tokens` | `"stop"` means a natural stop or a stop sequence. `"length"` means the token limit. | Stop check and final event |
| 8 | Fetch: `raw.githubusercontent.com/meta-llama/llama3/main/llama/tokenizer.py` | The full pattern. The special-token list, with ID = 128,000 + list index. Stop tokens `<\|end_of_text\|>` and `<\|eot_id\|>`. The `ChatFormat` code. | Tokenizer and template of the toy model |
| 9 | Fetch: `docs.vllm.ai/en/latest/api/vllm/v1/sample/sampler/` | Order: allowed-token and bad-word masks, other logit processors, penalties, then temperature, min-p, top-k and top-p, and the draw. | Note in the sampler stage |
| 10 | Fetch: `raw.githubusercontent.com/huggingface/transformers/main/src/transformers/generation/utils.py` | `_get_logits_processor` adds `RepetitionPenaltyLogitsProcessor` before the warpers. The warpers follow: temperature first, then top-k, top-p, and min-p, among others. | Order of the sampler in `engine.js` |
| 11 | Download: `tokenizer.json`, `config.json`, and `generation_config.json` from the `NousResearch/Meta-Llama-3-8B-Instruct` mirror | `vocab_size` 128,256, `rope_theta` 500,000, `max_position_embeddings` 8,192, `tie_word_embeddings` false. `eos_token_id` [128001, 128009], `temperature` 0.6, `top_p` 0.9. The real token IDs of the example messages. | Default sampler settings, Llama 3 IDs in the token ID stage |
| 12 | Web search: `nostalgebraist "interpreting GPT: the logit lens" 2020 LessWrong` | The original logit lens post. The Tuned Lens paper reports that the logit lens is unreliable for some models. | Logit lens rows, with a caution |
| 13 | Web search: `Geva 2022 "Transformer Feed-Forward Layers Build Predictions by Promoting Concepts in the Vocabulary Space" EMNLP` | EMNLP 2022. Each MLP sub-update promotes tokens that can be read through the output head. | "Its write vector raises" column in the MLP stage |

### Sources

| Source | Tier | Used in |
|--------|------|---------|
| Meta, *llama3* repository, `llama/tokenizer.py` — https://github.com/meta-llama/llama3/blob/main/llama/tokenizer.py | 1 | Simulation |
| Meta, *Meta Llama 3 model card and prompt format* — https://www.llama.com/docs/model-cards-and-prompt-formats/meta-llama-3/ | 1 | Simulation |
| Llama 3 8B Instruct `config.json`, `generation_config.json`, and `tokenizer.json`, from a community mirror of the gated official repository — https://huggingface.co/NousResearch/Meta-Llama-3-8B-Instruct | 2 | Simulation |
| Hugging Face transformers, `generation/utils.py` — https://github.com/huggingface/transformers/blob/main/src/transformers/generation/utils.py | 1 | Simulation |
| vLLM documentation, *Sampler* (v1) — https://docs.vllm.ai/en/latest/api/vllm/v1/sample/sampler/ | 1 | Simulation |
| Keskar et al., *CTRL: A Conditional Transformer Language Model for Controllable Generation*, 2019 — https://arxiv.org/abs/1909.05858 | 2 | Simulation |
| OpenAI API reference, *The completion object* (`finish_reason`) — https://developers.openai.com/api/docs/api-reference/completions/object | 1 | Simulation |
| nostalgebraist, *interpreting GPT: the logit lens*, LessWrong, 2020 — https://www.lesswrong.com/posts/AcKRB8wDpdaN6v6ru/interpreting-gpt-the-logit-lens | 2 | Simulation |
| Belrose et al., *Eliciting Latent Predictions from Transformers with the Tuned Lens*, 2023 — https://arxiv.org/abs/2303.08112 | 2 | Simulation |
| Geva, Caciularu, Wang, Goldberg, *Transformer Feed-Forward Layers Build Predictions by Promoting Concepts in the Vocabulary Space*, EMNLP 2022 — https://aclanthology.org/2022.emnlp-main.3 | 1 | Simulation |

## Teaching material for intuition

| Source | Tier | Used in |
|--------|------|---------|
| Karpathy, *Intro to Large Language Models* (talk) — https://www.youtube.com/watch?v=zjkBMFhNj_g | 3 | 00 |
| Alammar, *The Illustrated Transformer* — https://jalammar.github.io/illustrated-transformer/ | 3 | 05 |
| Alammar, *The Illustrated GPT-2* — https://jalammar.github.io/illustrated-gpt2/ | 3 | 00 |
| 3Blue1Brown, *Neural Networks* series, chapters 5–7 (GPT, attention, MLP) — https://www.3blue1brown.com/topics/neural-networks | 3 | 03, 05, 06 |

## A short path for further study

1. Watch 3Blue1Brown chapters 5–7 for visual intuition.
2. Read Alammar's *Illustrated GPT-2* for the data flow.
3. Watch Karpathy's tokenizer video and read the minbpe code.
4. Read Elhage et al. (2021) for the residual-stream view.
5. Read the vLLM PagedAttention paper for the serving view.
