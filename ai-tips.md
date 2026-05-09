# AI tips

Background: my AI-as-TA talk to the MIT Engineering Council, [slides](https://slides.com/shensquared/engineering-council-talk-d85522).

## Dictate prompts

Speech-to-text (macOS dictation, Whisper, SuperWhisper) is faster than typing for most of the workflows below. Talk through what you want; the agent reads the transcript the same way it would read a typed prompt.

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
4. **iOS client.** I use [Moshi](https://getmoshi.app/).

## Slash commands / skills

For tasks you repeat across the semester, define a slash command (or skill, depending on your tool) so the prompt + context-loading is one keystroke. Examples worth having:

- `/grade-<qN>`: load the rubric and a few hand-graded examples, then grade a batch.
- `/draft-pset`: open the problem template, point at the topic, get a first draft.
- `/exam-feedback`: collect TA debrief notes into a structured form after each exam.

Keep the command definitions in the course repo so the whole staff inherits them.

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
