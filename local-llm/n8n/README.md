# n8n + local LLM

[n8n](https://n8n.io/) is a self-hosted workflow automation platform. Visual editor for chaining HTTP calls, databases, transforms, and LLM nodes. Useful for batched / scheduled tasks where one-shot chat doesn't fit.

## When to reach for it

- **Batched processing** — run a prompt across N inputs (student feedback, draft problems).
- **Scheduled jobs** — daily / weekly summaries, reminders.
- **Multi-step pipelines** — fetch from a sheet → transform → call LLM → write back.

## Setup

Docker is the easiest path:

```bash
docker run -d --name n8n -p 5678:5678 \
  -e N8N_DIAGNOSTICS_ENABLED=false \
  -e N8N_VERSION_NOTIFICATIONS_ENABLED=false \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```

Open <http://localhost:5678>. For sustained / shared use, run behind a reverse proxy with auth.

## Wiring in a local LLM

n8n's HTTP / OpenAI nodes take a base URL:

- Ollama: `http://host.docker.internal:11434/v1` (macOS / Windows) or `http://172.17.0.1:11434/v1` (Linux).
- MLX-LM: same idea, port 8080.

API key can be any non-empty string — local servers don't validate.
