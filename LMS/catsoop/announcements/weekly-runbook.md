# Weekly announcement runbook

All edits on the `announcements` branch.

## 0. Sync the branch

```bash
git checkout announcements
git fetch origin
git reset --hard origin/announcements    # if local is ahead/diverged
```

## 1. Write `_weekN.md`

Create / rewrite `web/announcements/_weekN.md` (path depends on your layout).

- Header: `#### Announcements for (Monday, <date> - Sunday, <date>)`
- Carry forward recurring items (note-taker, midterm reminders).
- Add new announcements.
- Cross-check dates against your course calendar.

## 2. Update the homepage

In `web/content.md`:

- Swap the announcement include from `_weekN-1.md` → `_weekN.md`.
- Slide the calendar window to weeks N-1, N, N+1. Comment out others with `<comment>...</comment>`.

## 3. Update the announcements archive

In `web/announcements/content.catsoop`:

- Move `<include>_weekN.md</include>` out of the `<comment>` block.
- Above the prior week's include, separated by `---`.

## 4. Commit, push, open PR

```bash
git add web/announcements/_weekN.md web/content.md web/announcements/content.catsoop
git commit -m "announcements: week N"
git push origin announcements
gh pr create --base main --head announcements --title "Week N announcements" --body "..."
```

## 5. Wait

The scheduled Action auto-merges at the configured time. Merge manually if you need it earlier.

## After merge

- `announcements` is preserved for next week (do not delete).
- `main` deploys via the normal workflow.
