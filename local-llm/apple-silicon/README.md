# Apple Silicon: local LLM serving

Apple's [MLX](https://github.com/ml-explore/mlx) framework gives faster inference than Ollama (which uses llama.cpp) on M-series Macs by leveraging unified memory and Metal more aggressively. Multiple ways to put MLX behind an OpenAI-compatible server.

## Options

### `mlx-lm` (bare)

The official server from the MLX project. Minimal, no extras.

```bash
python -m venv .venv && source .venv/bin/activate
pip install mlx-lm
mlx_lm.server --model <model-id>     # OpenAI-compatible at port 8080
```

### oMLX (wrapper with niceties)

[oMLX](https://github.com/jundot/omlx) is a Homebrew-installable server built on `mlx-lm`. Adds: continuous batching, tiered KV caching (RAM + SSD), persistent caches across model swaps, a menu bar app and web dashboard, vision-language model support.

```bash
brew tap jundot/omlx https://github.com/jundot/omlx
brew install omlx
```

<!-- TODO: other Apple Silicon-friendly modes (LM Studio MLX backend, llama.cpp Metal, etc.) as they prove useful. -->

## Models

Hugging Face's [`mlx-community`](https://huggingface.co/mlx-community) org hosts MLX-quantized variants of common models. Pass the HF id to `--model` (or import via oMLX).

## Wiring into your editor

Same shape as Ollama, different port:

```
http://localhost:8080/v1
```

## Ollama vs. MLX

| | Ollama | MLX (`mlx-lm` / oMLX) |
|---|---|---|
| Setup | one binary | Python venv (or `brew install omlx`) |
| Speed on Apple Silicon | good | typically faster |
| Cross-platform | yes | macOS only |
| Model selection | huge | smaller, growing |
| Tooling polish | high | mixed (oMLX raises it) |
