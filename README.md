# teaching-toolkit

Tips, scripts, and tool pointers for running a course. Written for both human readers and AI agents.

**Work in progress**: organizing as I find time and as colleagues ask about specific workflows. Feel free to raise an issue.

## Using this in your own workflow

Point an AI agent at this repo (or open GitHub Copilot from the repo's top-right menu if you're viewing on github.com), describe what you want, and ask whether anything here can be repurposed. The folder READMEs and per-topic notes carry enough context for an agent to recognize matches, light enough to skim.

*This repo is currently private. An AI agent reading it needs a GitHub personal access token; paste the prompt below into your AI tool and follow along:*

```
Walk me through creating a fine-grained GitHub personal access token so an AI agent can read this private repo: https://github.com/shensquared/teaching-toolkit. Scope it to just that repo with read-only Contents + Metadata.
```

## What's inside

```
LMS/
  catsoop/             setup, porting, staff, announcements, deploy, OH queue
  canvas/              API setup
  panopto.md           API setup; download lecture videos on a schedule
  recording.md         how lectures get captured at MIT (Open Learning, large classrooms, LWLC)
MIT/
  EECS/                exam day, exam printing, Education Portal scripts
  registration/        class lists, cross-reg, instructor approval userscripts
  exams.md             cross-MIT exam ops: proctoring, accommodations
  scaling-tips.md      public site models, Moira lists, Registrar Catalog
ai-tips.md             AGENTS.md / NOTATION.md conventions; remote AI workflow
local-llm/             running an LLM on your own machine; pair with opencode / Claude Code / etc.
```
