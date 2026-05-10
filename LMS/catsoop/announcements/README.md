# Weekly announcements workflow

## Why a separate branch

Drafts and review without touching the live site; auto-publish on a fixed weekly schedule.

## How it works

1. Edits happen on `announcements` (typically `web/announcements/_weekN.md` and includes).
2. When week N is ready, open a PR `announcements` → `main`.
3. A scheduled Action auto-merges any open PR at the configured time.
4. Your normal `main`-deploy workflow ships it.

No open PR when the schedule fires → no-op.

## Setup pieces

- `announcements` branch (long-lived; do not delete after merge).
- Branch protection on `announcements`.
- Scheduled Action: see [scheduled-merge.yaml.example](scheduled-merge.yaml.example).
- Site-deploy workflow on `main` (covered separately).

## Weekly runbook

See [weekly-runbook.md](weekly-runbook.md).

## DST note

Cron in GitHub Actions runs in UTC. For a fixed local-time publish (e.g., 5 PM Eastern), shift the cron by an hour twice a year.
