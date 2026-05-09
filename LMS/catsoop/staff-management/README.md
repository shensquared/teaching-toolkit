# Managing course staff in CAT-SOOP

## The two-location pattern

Staff information lives in two places that must stay in sync:

| Location | Purpose | Format |
|----------|---------|--------|
| `__USERS__/<kerb>.py` | Access control (permissions) | `role = "..."` |
| `info/staff/preload.py` | Display only (public staff page) | `(name, kerb)` tuples |

Forgetting either side:

- Display only → appears on staff page, can't actually do anything.
- Access only → has correct permissions, invisible on staff page.

## Roles

In `__USERS__/<kerb>.py`:

- `"Instructor"` — full admin
- `"TA"` — teaching assistant
- `"LA"` — learning assistant
- `"Student"` — student

Your course may add others.

## Operations

See [operations.md](operations.md) for: add a TA, promote LA→TA, remove staff, semester rollover, sync verification.
