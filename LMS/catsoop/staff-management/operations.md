# Staff operations

Each procedure touches both locations; see [README.md](README.md) for the pattern.

## Add a TA

1. Create `__USERS__/<kerb>.py`:
   ```python
   role = "TA"
   ```
2. Add to `_tas` in `info/staff/preload.py`:
   ```python
   _tas = [
       # ...
       ("Full Name", "<kerb>"),
   ]
   ```
3. (Optional) Add `__STATIC__/staffpics/<kerb>.png`.

## Add an LA

Same as TA, but `role = "LA"` and `_las` instead of `_tas`.

## Promote LA → TA

1. Change `role = "LA"` to `role = "TA"` in `__USERS__/<kerb>.py`.
2. **Move** the entry from `_las` to `_tas` in `info/staff/preload.py` (don't duplicate).

## Remove a staff member

1. Delete `__USERS__/<kerb>.py`.
2. Remove from `_tas` / `_las` / `_instructors` in `info/staff/preload.py`.
3. (Optional) Remove their photo.

## Semester rollover

Clear prior-term students from `__USERS__/`. Staff stay until they actually leave.

To populate `__USERS__/` for the new term from your Canvas roster, see [`../../canvas/`](../../canvas/) — the sync script creates one `<kerb>.py` per enrolled student and flags anyone in `__USERS__/` no longer in Canvas (likely drops or staff).

```bash
# See current __USERS__/ contents with role:
for f in __USERS__/*.py; do
  echo "$(basename "$f" .py): $(grep -E '^role' "$f")"
done
```

## Verify sync

```bash
ls __USERS__/ | sed 's/\.py$//' | sort > /tmp/users.txt
grep -oE '"[a-z][a-z0-9_]*"' info/staff/preload.py | tr -d '"' | sort -u > /tmp/staff.txt
diff /tmp/users.txt /tmp/staff.txt
```

Anyone on only one side is a sync bug.
