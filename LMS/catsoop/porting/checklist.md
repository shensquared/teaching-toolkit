# Semester porting checklist

Generic checklist; adapt to your course's files and conventions.

## Before the new semester

### Core configuration

- [ ] Update `YEAR` (or equivalent) in `preload.py`.
- [ ] Set `STAGE` to `pre_semester`.
- [ ] Update `cs_first_monday` (or equivalent first-day date).
- [ ] Update term-scoped external links: Piazza, schedule sheet, feedback forms.
- [ ] Update homepage title / branding.

### Pre-semester announcement

- [ ] Refresh `_presemester.md` (or equivalent) with new dates.
- [ ] Update first class meeting date.
- [ ] Update cross-registration / waitlist timelines.
- [ ] Update embedded forms / links.

### Staff

Two locations must both be updated:

- [ ] **Access** (`__USERS__/<kerb>.py`) — clear prior-term students, keep instructors/staff, add new TAs/LAs.
- [ ] **Display** (e.g., `info/staff/preload.py`) — update instructor / TA / LA lists.
- [ ] Add staff photos under `__STATIC__/staffpics/<kerb>.png`.

### Plugins

- [ ] Disable end-of-term plugins (rename `post_load.py` → `disabled_post_load.py`).
- [ ] Enable any pre-semester / regular-term plugins.

### Assets

- [ ] Replace term-specific audio / video / photos.
- [ ] Verify fallback assets (e.g., `nopicture.jpg`) are in their permanent location.
- [ ] Clean out previous semester's student photos.

### Sections / rooms

- [ ] Office hours schedule.
- [ ] Lab / recitation times and rooms.
- [ ] Midterm / exam rooms (if applicable).

## When the semester begins

- [ ] Set `STAGE` to `regular`.
- [ ] Begin the weekly announcements rollout.

## During the semester

- [ ] Add students to `__USERS__/` as they register / drop.
- [ ] Update staff photos as new staff join.

## End of semester

- [ ] Set `STAGE` to `post_semester`.
- [ ] Re-enable the end-of-term plugin (rename back).
- [ ] Archive per your retention policy.

## Reference parameters

| Parameter | Example: Fall | Example: Spring |
|-----------|---------------|-----------------|
| `YEAR` | `fall25` | `spring26` |
| `STAGE` (initial) | `pre_semester` | `pre_semester` |
| First Monday | 2025-09-08 | 2026-02-02 |
