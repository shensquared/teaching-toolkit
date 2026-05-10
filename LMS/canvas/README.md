# Canvas API + CAT-SOOP integration

Get started with the Canvas API, then use it to keep CAT-SOOP `__USERS__/` in sync with Canvas enrollment.

## 1. Canvas API access

You need: a Canvas account at your institution, instructor/designer access to the course.

### Get a token

**Account → Settings → + New Access Token**. Copy it immediately; Canvas shows it once.

For shared / production use, ask your Canvas admin for a developer key instead.

### Store it (don't commit)

```bash
export CANVAS_BASE_URL="https://canvas.mit.edu"
export CANVAS_TOKEN="<paste-your-token>"
```

### Find your course ID

In the URL: `https://canvas.mit.edu/courses/<COURSE_ID>`. Or list via API:

```bash
curl -H "Authorization: Bearer $CANVAS_TOKEN" \
  "$CANVAS_BASE_URL/api/v1/courses?per_page=100"
```

### Smoke test

```bash
curl -H "Authorization: Bearer $CANVAS_TOKEN" \
  "$CANVAS_BASE_URL/api/v1/users/self"
```

401 → wrong token. 404 → wrong base URL.

### References

- [Canvas API docs](https://canvas.instructure.com/doc/api/)
- Pagination: follow the `Link` header's `rel="next"` URL until it disappears.

## 2. Sync CAT-SOOP users from Canvas

CAT-SOOP needs `__USERS__/<kerb>.py` for each enrolled student (see [../catsoop/staff-management/](../catsoop/staff-management/)). Generate them from Canvas instead of by hand.

Workflow:

1. `GET /api/v1/courses/<COURSE_ID>/users?enrollment_type[]=student` (paginated).
2. Extract each user's `login_id` (the kerb at MIT).
3. Create `__USERS__/<kerb>.py` with `role = "Student"`. Skip files that already exist (could be staff).
4. Report kerbs in `__USERS__/` but not Canvas (likely drops).

Starter: [`sync-canvas-to-catsoop.py.example`](sync-canvas-to-catsoop.py.example). Copy in, edit `COURSE_ID` and `USERS_DIR`, run.

**Cadence**: once after registration closes, weekly during add/drop, once mid-term for late drops.
