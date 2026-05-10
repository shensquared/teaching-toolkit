# Porting a CAT-SOOP course to a new semester

For migrating an existing course from one term to the next.

## When to port

<!-- TODO: when in the term cycle, who owns it. -->

## What changes

1. **Semester identifiers**: year string, term stage, key dates.
2. **Staff**: clear out students, add new TAs/LAs, update the staff display.
3. **Plugins**: disable end-of-term, enable pre-semester.
4. **Assets**: replace term-specific media.
5. **Announcements**: clear stale weeks; refresh pre-semester message.
6. **External links**: Piazza, schedule sheet, feedback forms.

## Quick start

```bash
./port-semester.sh <old-term> <new-term>     # mechanical renames + var bumps
```

Then [checklist.md](checklist.md) for the rest, and [gotchas.md](gotchas.md) for things that have bitten people.
