# Open WebUI

[Open WebUI](https://openwebui.com/) is a self-hosted, ChatGPT-style web interface for local models. Multi-user, persistent chat history, with built-in RAG ("Knowledge") for asking questions over uploaded documents.

## Why use it

- **Familiar UI** for anyone who has used ChatGPT — easier than the CLI for less-technical TAs / colleagues.
- **Multi-user with auth** — share one instance with course staff; each user gets their own history.
- **RAG built-in** — upload PDFs, lecture notes, past exams; ask questions across the corpus and get answers with citations from your uploads.
- **Pluggable backends** — works with Ollama, MLX-LM, or any OpenAI-compatible endpoint.

## Setup

```bash
docker run -d --name open-webui -p 3000:3000 \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  -e ENABLE_OPENAI_API=false \
  -v open-webui:/app/backend/data \
  ghcr.io/open-webui/open-webui:main
```

Open <http://localhost:3000>; create an admin account on first visit. Subsequent signups can be set to require admin approval.

## RAG for course material

Useful applications:

- Upload an entire term's lecture notes; let TAs ask "where did we cover X?" with cited sources.
- Upload textbook PDFs; ask conceptual questions and get grounded answers.
- Upload past exam problems for pattern reference when writing new ones.

Files are stored on disk under the `open-webui` Docker volume; nothing leaves your machine.

## Telemetry

Open WebUI is privacy-focused by default but check the admin settings on first run. To be safe, set `ENABLE_OPENAI_API=false` (above) unless you actually need OpenAI as a backend, and review the "External Tools" panel.
