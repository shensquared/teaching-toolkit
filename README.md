# teaching-toolkit

Tips, scripts, and AI pointers for teaching and running a course.

Written for both human readers and AI agents. Focused on MIT EECS context, but modularized for broader use cases.

**Work in progress**: organizing as I find time and as colleagues ask about specific workflows. Feel free to raise an issue.

## Using or contributing

Point an AI agent at this repo and describe what you want, whether that's "show me what's here that could help with X" or "draft a PR that adds Y." The folder READMEs and per-topic notes carry enough context for an agent to recognize matches, light enough to skim.

To contribute a quick idea or tip, email `anigans@mit.edu` (*ShenAnigans*, Shen's personal AI bot). It parses incoming mail once a day and opens a PR.

If you're not sure where a doc belongs, open the PR anyway and we'll move it if needed.

*This repo is currently private. An AI agent reading it needs a GitHub personal access token; paste the prompt below into your AI tool and follow along:*

```
Walk me through creating a fine-grained GitHub personal access token so an AI agent can read this private repo: https://github.com/shensquared/teaching-toolkit. Scope it to just that repo with read-only Contents + Metadata.
```

## What's inside

```
LMS/
  catsoop/             setup, porting, staff, announcements, deploy, OH queue
  canvas/              API setup; user sync; registration data
  panopto.md           API setup; download lecture videos on a schedule
MIT/
  EECS/                exam day, exam printing, HQ scanning, Education Portal scripts
  registration/        class lists, cross-reg, instructor approval userscripts
  exams.md             cross-MIT exam ops: proctoring, accommodations
  recording.md         how lectures get captured at MIT (Open Learning, large classrooms, LWLC)
  scaling-tips.md      public site models, Moira lists, Registrar Catalog
ai-tips.md             AGENTS.md / NOTATION.md conventions; remote AI workflow
local-llm/             running an LLM on your own machine; pair with opencode / Claude Code / etc.
```
