# AI tips

Background: a colleague-facing talk on this — [slides](https://slides.com/shensquared/colleage-dac-talk).

## Conventions

Drop two files at the root of your repo:

- **`AGENTS.md`** — file layout, build commands, problem templates, style rules.
- **`NOTATION.md`** (or similar) — domain-specific notation rules. Reference it from `AGENTS.md`.

Examples:

- [6.390 notes — `NOTATION.md`](https://github.com/390introml/notes/blob/main/NOTATION.md) *(public)*: vector / matrix / subscript conventions for ML.
- 6.390 course site — `AGENTS.md` *(private)*: CAT-SOOP repo layout, time-gated recitation slide block.
- 6.390 exams — `AGENTS.md` *(private)*: LaTeX problem template, point-assignment rules, design preferences.

## Remote AI workflow

1. **CLI + tmux.** Sessions stay local, organized, and survive disconnects.
2. **VPN.** See [local-llm/wireguard/](local-llm/wireguard/).
3. **SSH tunnels** for one-off port forwards: `ssh -L 11434:localhost:11434 user@host`.
4. **iOS client.** I use [Moshi](https://getmoshi.app/).
