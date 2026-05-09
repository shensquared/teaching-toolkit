# AGENTS.md

Conventions for AI agents extending this toolkit. The repo is Shen Shen's teaching toolkit, with 6.390 (MIT Intro to ML) as the running concrete example.

## Voice

- Concise. Cut wordy lead-ins, redundant section headers, and prose that re-explains an adjacent table or code block.
- No tool-name namedrops in narrative text (Claude, ChatGPT, Cursor, etc.) unless functionally necessary.
- No em dashes in prose. Use commas, colons, periods, or semicolons.
- No emojis unless explicitly requested.
- No fabricated tips. Only write content the maintainer has explicitly contributed; don't invent best-practices to fill space.

## Structure

- Purpose-organized, not platform-organized. Group by what a thing *does*, not which vendor it touches. Example: GitHub Actions live next to the workflow they automate (`announcements/`, `deploy/`), not in a `github/` umbrella.
- Flatten single-README folders into top-level `.md` files when no scripts or supporting files are likely to follow.
- Each top-level folder gets its own `README.md` describing scope, contents, and any cross-links.
- Keep cross-links between related sections. Don't duplicate content.

## Extracting from external sources

- Genericize: strip course-internal emails, Slack channel names, per-staff routing, hardcoded student data.
- Keep concrete operational specifics (room numbers, IPs, scanner models, printer names). Those are the value.
- Always link back to the source.
- Sanitize hardcoded local paths in scripts before checking in.

## Commits

- Brief one-line subject. Body explains *why* if it's not obvious from the diff.
- Don't skip hooks (`--no-verify`) or bypass signing without explicit instruction.

## Adding scripts

- Add an `Author: shensquared` line to the top of any script being checked in (in a module-level docstring or comment).
- Sanitize paths and credentials before copying from `~/code/`.
- Note required environment variables and external dependencies in the script's accompanying README.
