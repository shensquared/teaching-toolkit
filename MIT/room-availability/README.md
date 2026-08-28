# Finding when a classroom is free

Answers "is 45-102 free Tuesday at 2:30" without emailing anyone. Fireroad, the course-data API behind most MIT scheduling tools, carries the assigned room for every scheduled section, so one request gives you the meeting schedule of every classroom on campus.

For reserving a room once you've found one, see [../EECS/rooms.md](../EECS/rooms.md). For getting a lecture recorded in it, see [../recording.md](../recording.md).

## The endpoint

```
https://fireroad.mit.edu/courses/all?full=true
```

No authentication, CORS open, about 8.8 MB of JSON covering roughly 7,200 subjects. It serves the current term and updates every few minutes.

## The schedule field

Each course carries a `schedule` string with the room baked in:

```
Lecture,10-250/M/0/2.30-4;Lab,34-501/W/0/9.30-11,32-044/W/0/11-12.30
```

Semicolons separate section kinds (`Lecture`, `Recitation`, `Lab`, `Design`). Commas separate the sections of one kind. Each section is `room/days/pm/time`, and the last three repeat when a section meets at different times on different days (`32-123/TR/0/11/F/0/2`).

Three traps in the time field:

- The `pm` flag is unreliable on its own. Evening sections instead carry a literal suffix, as in `66-144/W/1/5-7 PM`. About 6% of sections look like this, and a parser that ignores the suffix drops them and reports the room as free.
- A bare time means one hour, so `/0/11` is 11:00 to 12:00.
- With the flag off, hours 1 through 5 still mean afternoon. Only 6 through 12 are morning.

Courses not yet scheduled have `schedule: null`, and cross-listed subjects repeat the same meeting under each number.

## Script

[`scripts/room-schedule.py`](scripts/room-schedule.py) parses the above. Standard library only, caches the download for six hours.

```bash
./room-schedule.py 45-102                              # weekly grid for one room
./room-schedule.py --free "T 2:30pm-4pm" --rooms openlearning
./room-schedule.py --free "F 10am-12pm" --rooms 1-190,26-100 --refresh
```

`--rooms` takes a comma-separated list or one of three named sets matching the Registrar's lecture-capture groups: `openlearning`, `ist-lwlc`, `mvp`.

```
$ ./room-schedule.py --free "T 2:30pm-4pm" --rooms openlearning
T 2:30pm-4pm  (4/15 free)

free: 10-250, 35-225, 46-3002, E25-117
  busy 2-131     21H.276
  busy 2-142     21G.111
  ...
```

## What this does not cover

Registrar-scheduled class meetings, and nothing else. One-off reservations, seminars, exams, thesis defenses, and department events never reach Fireroad, so an empty slot here is a candidate to confirm with whoever owns the room, not a booking. The data also gives room numbers alone, with no capacity, layout, or AV inventory; [classrooms.mit.edu](http://www.classrooms.mit.edu) has those.

Only the current term is available. For a past term, [Hydrant](https://github.com/sipb/hydrant) commits packaged per-term snapshots under `public/*.json` going back to Fall 2022.

## Credit

Hydrant, SIPB's course planner, reads the same field, and its `scrapers/fireroad.py` is the reference implementation for the format. The script here reimplements the parser so it runs without the Hydrant checkout; both agree on all 3,254 sections in the current term.
