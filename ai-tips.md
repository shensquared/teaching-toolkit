# AI tips

Background: my AI-as-TA talk to the MIT Engineering Council, [slides](https://slides.com/shensquared/engineering-council-talk-d85522).

## Version-control everything

Commit every artifact AI helps you build (code, prompts, drafts, slide source, problem sets, slash commands, skill definitions) to git where possible. Lets you bisect when output quality regresses, see what's AI-generated vs. hand-edited, and feed full history back as context next time.

## Conventions

Drop two files at the root of your repo:

- **`AGENTS.md`**: file layout, build commands, problem templates, style rules.
- **`NOTATION.md`** (or similar): domain-specific notation rules. Reference it from `AGENTS.md`.

Examples:

- [6.390 notes / `NOTATION.md`](https://github.com/390introml/notes/blob/main/NOTATION.md) *(public)*: vector / matrix / subscript conventions for ML.
- 6.390 course site / `AGENTS.md` *(private)*: CAT-SOOP repo layout, time-gated recitation slide block.
- 6.390 exams / `AGENTS.md` *(private)*: LaTeX problem template, point-assignment rules, design preferences.

## Remote AI workflow

1. **CLI + tmux.** Sessions stay local, organized, and survive disconnects.
2. **VPN.** See [local-llm/wireguard/](local-llm/wireguard/).
3. **SSH tunnels** for one-off port forwards: `ssh -L 11434:localhost:11434 user@host`.
4. **iOS client + dictation.** I use [Moshi](https://getmoshi.app/); pair with iOS dictation (or a Whisper-based keyboard) so you can talk through prompts instead of thumb-typing on the go.

## Slash commands / skills

For tasks you repeat across the semester, define a slash command (or skill, depending on your tool) so the prompt + context-loading is one keystroke. Examples worth having:

- `/draft-pset`: open the problem template, point at the topic, get a first draft.
- `/exam-feedback`: collect TA debrief notes into a structured form after each exam.

Keep the command definitions in the course repo so the whole staff inherits them.

## Share context across the team

Whatever you tune (CLAUDE.md, AGENTS.md, NOTATION.md, slash commands, skill definitions), commit it to the course repo, not to personal dotfiles. New TAs / LAs onboarding mid-semester inherit the same agent behavior, so outputs stay consistent across the team. Otherwise one TA's well-tuned setup and another's defaults produce visibly different work.

Same idea on the GitHub-access side (teams, bot tokens, `gh` CLI): see [`MIT/scaling-tips.md` > Team management tools](MIT/scaling-tips.md#team-management-tools).

## Team AI tooling

*Patterns I use but haven't written up yet:*

- Shared knowledge base (Outline at `outline.shenshen.mit.edu`) for team-readable docs that AI agents can also search.
- The anigans bot triage system.

## Subagents for parallel exploration

When the task spans the whole course site (porting a folder, auditing all problem files, scanning every lecture's recitation block), fan out to subagents instead of letting one agent burn through context sequentially. Two patterns:

- **Independent reads**: one agent per top-level folder, each reports back a short summary.
- **Search + synthesize**: subagents grep for matches; the main agent reads only the hits and decides.

The main context stays clean and you finish in one pass instead of three.

## Lecture prep loop

Closes the loop with [LMS/panopto.md](LMS/panopto.md):

1. Pull last year's recording for the lecture you're about to give.
2. Transcribe (Whisper or similar), local-llm-friendly.
3. Hand the transcript + this year's slides to an AI and ask: *what landed, what didn't, what to revisit, where did I rush*.
4. Use the answers to retune the slide order or add a recap slide.

Private feedback before you walk into the room.
