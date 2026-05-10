# Scaling teaching at MIT

Highlights extracted from the [scalableTeaching](https://github.com/shensquared/scalableTeaching) site. Actionable tips for instructors running larger MIT courses; see the source for fuller context.

## Plan ahead, divvy up tasks

Mimic separation of powers: one person (or a small group) sets policy; a different group executes. Reduces decision fatigue for executors and keeps rulings consistent.

## Team management tools

Tooling that pays off as the staff grows beyond a handful:

- **GitHub teams for tiered access.** Create separate teams (e.g., `instructors`, `tas`, `las`) and grant repo / branch-protection rules per team. Easier than per-user permissions and survives staff turnover.
- **Bot account + token for automation.** Use a dedicated service account (or fine-grained PAT) for CI, scheduled jobs, and sync scripts. If a person leaves or rotates keys, automation doesn't break.
- **`gh` CLI for everyday repo work.** Faster than the web UI for batch ops: `gh pr create`, `gh issue list`, `gh api ...`. Scriptable; pairs well with the bot token above.

For the AI-context analogue (committing `AGENTS.md` / skills / slash commands so agent behavior stays consistent across staff), see [`../ai-tips.md` > Share context across the team](../ai-tips.md#share-context-across-the-team).

## Public-facing site cuts inquiry volume

A publicly-accessible course site (even just logistics + FAQs) reduces pre-semester emails and doubles as onboarding material for new staff. Site models, in roughly decreasing complexity:

- **All-in-one**: info, courseware, grades on one self-hosted site (e.g., CAT-SOOP).
- **Hybrid I**: public info + courseware site, Canvas for grades / private modules.
- **Hybrid II**: separate sites for info and courseware, other tech for the rest.
- **Canvas-only with public module**: make a single FAQ module public, keep the rest gated.

## Update the Registrar Course Catalog

Most students shop via [student.mit.edu/catalog](http://student.mit.edu/catalog/). Keep the listing current and link your course site as "extra info" there. Lisa Bella is the contact for changes.

## Moira lists from Athena

Programmatic creation beats clicking through WebMoira:

```bash
blanche <list-name> -al <kerb-list>.txt    # one kerb per line
```

## Funnel logistical requests to one place

Piazza, Discourse, or similar. Many staff with read access; few staff acting on requests.

## Open-source course materials

Open source the texts and code where you can. You'll get unsolicited PRs, broader reach, and easier onboarding for new staff. The reciprocity is real.

## Remembering students by name and face

The Registrar releases a pictured roster PDF. Canvas exposes student photos via the back-end People page even when the course is unpublished. Either source can feed an Anki deck.

## Useful tools

- **[Enrollment Pie](https://shenshen.mit.edu/pie/)**: visualize enrollment composition. (Also covered in [registration/](registration/).)
- **[On-demand OH booking](https://cal.shenshen.mit.edu/)**: complements fixed OH hours; offers shared "seats."
- **[Course Calendar Template](https://shenshen.mit.edu/git/shensquared/teachingcalendar)**: pulls Registrar key dates, cross-checked against the official `.ics`.
- **[w2m](https://w2m.shenshen.mit.edu/)**: private When2Meet alternative.
- **[ML Courses Tree](https://shenshen.mit.edu/tree/)**: for advising students on which ML courses to pick.

<!-- TODO: integrate notes from the `outline` VM (e.g., EECS printing and scanning). -->
