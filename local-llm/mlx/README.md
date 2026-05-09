# MLX-based local LLM serving

For Apple Silicon Macs (M-series). Apple's [MLX](https://github.com/ml-explore/mlx) framework typically gives faster inference than Ollama (which uses llama.cpp) by leveraging unified memory and Metal more aggressively. Trade-off: a bit more setup.

## Install

```bash
python -m venv .venv && source .venv/bin/activate
pip install mlx-lm
mlx_lm.server --model <model-id>     # OpenAI-compatible at port 8080
```

## Models

The Hugging Face org [`mlx-community`](https://huggingface.co/mlx-community) hosts MLX-quantized variants of common models. Pass the HF id to `--model`.

<!-- TODO: list specific models that have worked well for you. -->

## Wiring into your editor

Same shape as Ollama, different port:

```
http://localhost:8080/v1
```

## Ollama vs. MLX

| | Ollama | MLX |
|---|---|---|
| Setup | one binary | Python venv |
| Speed on Apple Silicon | good | typically faster |
| Cross-platform | yes | macOS only |
| Model selection | huge | smaller, growing |
| Tooling polish | high | lower |

If you're on an M-series Mac and care about speed, try MLX. If you want one-command setup or you're on Linux, stick with Ollama.
