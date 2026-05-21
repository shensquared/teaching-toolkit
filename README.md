# Teaching Toolkit

Tips, scripts, and AI pointers for teaching and running a course.

Written for both human readers and AI agents. MIT EECS-flavored; modular for broader use.

**Work in progress**: organizing as I find time and as colleagues ask about specific workflows. Want a topic covered? Raise an issue.

## Using or contributing

Point an AI agent at this repo and describe what you want, whether that's "show me what's here that could help with X" or "draft a PR that adds Y."

*Paste the prompt below into your AI tool, then describe your task as a follow-up message:*

```
Read https://github.com/shensquared/teaching-toolkit (start with the top-level README, then dive into folder READMEs as relevant). Confirm when you're ready and I'll tell you what I need next.
```

To contribute a quick idea or tip, email `anigans@mit.edu` (*ShenAnigans*, Shen's personal AI bot). It parses incoming mail once a day and opens a PR.

If you're not sure where a doc belongs, open the PR anyway and we'll move it if needed.

## What's inside

```
LMS/
  catsoop/             setup, porting, staff, announcements, deploy, OH queue, extensions
  canvas/              API setup; user sync; registration data
  panopto.md           API setup; download lecture videos on a schedule
MIT/
  EECS/                exam day, exam printing, HQ scanning, room reservations, Education Portal scripts
  registration/        class lists, cross-reg, instructor approval userscripts
  exams.md             cross-MIT exam ops: proctoring, accommodations
  recording.md         how lectures get captured at MIT (Open Learning, large classrooms, LWLC)
  scaling-tips.md      public site models, Moira lists, Registrar Catalog
ai-tips.md             AGENTS.md / NOTATION.md conventions; remote AI workflow
local-llm/
  ollama/              easiest way to run a model locally; OpenAI-compatible API
  apple-silicon/       MLX-based serving (mlx-lm, oMLX); faster than Ollama on M-series
  openwebui/           ChatGPT-style web UI; multi-user; RAG over uploads
  n8n/                 workflow automation; batched / scheduled LLM jobs
  wireguard/           VPN for remote access to local services
  hermes.md            course-data assistant on top of the local stack; dedicated-host guidance
```
