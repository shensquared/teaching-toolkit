# Ollama

The easiest way to run a model locally on macOS / Linux.

## Install

```bash
brew install ollama       # macOS
ollama serve              # starts the local server on port 11434
ollama pull <model>       # download a model
ollama run <model>        # interactive chat
```

## Models

<!-- TODO: list models you've used, with sizes and what each is good for. -->

## Wiring into your editor

OpenAI-compatible endpoint at `http://localhost:11434/v1`. Most editor integrations (Claude Code, Cursor, Continue, etc.) accept a custom base URL.

Smoke test:

```bash
curl http://localhost:11434/api/tags
```

## Use cases for teaching

<!-- TODO: drafting problems, summarizing student feedback, formatting LaTeX / catsoop, etc. -->

## Sharing on a trusted network

To let other devices on your LAN hit Ollama, bind to `0.0.0.0`:

```bash
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

**Only on a trusted network** — Ollama has no auth. For remote access, expose it via [`../wireguard/`](../wireguard/) instead of port-forwarding.

## Telemetry

Ollama doesn't phone home, but the desktop app does check for updates. Set `OLLAMA_NO_ANALYTICS=1` if you want to disable any future telemetry.
