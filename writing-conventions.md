# Writing conventions for AI-assisted material development

If you commit your conventions to a file at the root of your course repo, an AI assistant can do most of the boring formatting — consistent notation, problem templates, time-gates, build commands — without you re-explaining each session.

## The pattern

Two file types do most of the work:

- **`AGENTS.md`** — operational conventions for AI agents (file layout, build commands, problem templates, style rules). A cross-tool standard: Claude Code, Cursor, Codex, etc. read it automatically.
- **`NOTATION.md`** (or similar) — domain-specific notation rules (vector / matrix / subscript conventions). Reference it from `AGENTS.md` so the agent pulls it into context.

Drop them at your repo root; from then on, "format this problem" or "add a recitation slide block" usually requires no further instruction.

## Examples

- **[6.390 notes — `NOTATION.md`](https://github.com/390introml/notes/blob/main/NOTATION.md)** *(public)* — notation conventions for ML: vectors, matrices, subscripts, superscripts.
- **6.390 course site — `AGENTS.md`** *(private)* at `390introml/spring26` — repo layout for a CAT-SOOP course site, plus a worked example of a "skill" (time-gated recitation slide block).
- **6.390 exams — `AGENTS.md`** *(private)* at the exam Overleaf — LaTeX problem template, point-assignment rules, question-design preferences.

## Starting your own

1. For one week, notice every time you correct an AI assistant's formatting.
2. Write those rules down in `AGENTS.md` at your repo root. Five to ten bullets is enough to start.
3. If your subject has notation, write a `NOTATION.md` and reference it from `AGENTS.md`.
4. Check the file in. The next session, the agent already knows.
