# Running a CAT-SOOP course

Conventions and recipes for instructors and TAs maintaining a CAT-SOOP course over multiple semesters.

## Recommended setup

1. **Version-control your courseware** in a git repo. Multi-staff collaboration, history, audit trail.
2. **Host on GitHub** specifically: Actions, branch protection, and PRs are familiar to TAs. GitLab CI / Gitea Actions also work.
3. **Use GitHub Actions for two recurring jobs**:
   - Deploy to the live server on merge to `main` — see [deploy/](deploy/).
   - Auto-merge the weekly announcements PR on schedule — see [announcements/](announcements/).

## Folders

| Folder | What's inside |
|--------|---------------|
| [setup/](setup/) | Installing and running CAT-SOOP locally. |
| [porting/](porting/) | Migrating a course from one semester to the next. |
| [staff-management/](staff-management/) | Adding, promoting, and removing course staff. |
| [announcements/](announcements/) | Weekly announcement workflow with a scheduled auto-merge. |
| [deploy/](deploy/) | Pushing courseware to the live catsoop server on merge to `main`. |

If your course also has a Canvas presence, see [../canvas/](../canvas/) for syncing `__USERS__/` from Canvas.
