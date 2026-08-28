#!/usr/bin/env python3
"""Show when MIT classrooms are booked for scheduled class meetings.

Author: shensquared

Data comes from the Fireroad API (https://fireroad.mit.edu/courses/all?full=true),
which carries the room for every scheduled section of the current term. Stdlib only.

    room-schedule.py 45-102 10-250          # weekly grid per room
    room-schedule.py --free "T 2:30pm-4pm" --rooms openlearning
    room-schedule.py --free "F 10am-12pm" --rooms 1-190,26-100 --refresh

Covers registrar-scheduled subject meetings only. One-off reservations, seminars,
exams, and department events do not appear, so a free slot here is a candidate to
confirm with the room's owner, not a booking.
"""

import argparse
import json
import re
import sys
import time
import urllib.request
from collections import defaultdict
from pathlib import Path

URL = "https://fireroad.mit.edu/courses/all?full=true"
CACHE = Path.home() / ".cache" / "mit-fireroad" / "all.json"
CACHE_TTL = 6 * 60 * 60

DAYS = ["M", "T", "W", "R", "F"]
DAY_NAMES = {"M": "Mon", "T": "Tue", "W": "Wed", "R": "Thu", "F": "Fri"}
SLOTS_PER_DAY = 34  # half-hours from 6:00am to 11:00pm

# Recording-capable rooms, from the Registrar's lecture-capture classroom list:
# registrar.mit.edu/classes-grades-evaluations/instructor-resources/classrooms-lecture-capture-technology
ROOM_SETS = {
    "openlearning": "2-131 2-142 2-190 6-120 10-250 26-100 32-123 34-101 35-225 "
    "45-102 45-230 46-3002 54-100 E25-111 E25-117",
    "ist-lwlc": "1-135 1-150 1-190 2-105 3-133 3-270 3-333 3-370 4-144 4-145 4-149 "
    "4-153 4-159 4-163 4-231 4-237 4-249 4-261 4-265 4-270 4-370 5-134 5-234 9-354 "
    "16-160 24-115 24-121 26-100 32-124 32-141 32-144 32-155 33-419 37-212 56-114 "
    "56-154 56-162 66-144 66-168 E51-057 E51-361",
    "mvp": "10-250 32-123 34-101 45-230 54-100",
}


def fetch(refresh=False):
    """Return the Fireroad course list, caching it for CACHE_TTL seconds."""
    fresh = CACHE.exists() and time.time() - CACHE.stat().st_mtime < CACHE_TTL
    if refresh or not fresh:
        CACHE.parent.mkdir(parents=True, exist_ok=True)
        with urllib.request.urlopen(URL, timeout=60) as response:
            CACHE.write_bytes(response.read())
    return json.loads(CACHE.read_text())


def to_slot(hhmm, is_pm):
    """Convert a Fireroad time like '2.30' plus an am/pm flag to a slot index."""
    hour, _, half = hhmm.partition(".")
    hour = int(hour)
    if is_pm and hour != 12:
        hour += 12
    elif not is_pm and hour < 6:  # bare '1' in an am field still means 1pm
        hour += 12
    return (hour * 60 + (30 if half else 0) - 6 * 60) // 30


def parse_section(section):
    """Parse 'room/days/pm/time[/days/pm/time...]' into (room, [(slot, length)])."""
    room, *rest = section.split("/")
    slots = []
    for i in range(0, len(rest) - 2, 3):
        weekdays, is_pm, span = rest[i], bool(int(rest[i + 1])), rest[i + 2]
        if span.upper().endswith(" PM"):  # evening slots carry a literal suffix
            span, is_pm = span[:-3].strip(), True
        start_str, _, end_str = span.partition("-")
        start = to_slot(start_str, is_pm)
        end = to_slot(end_str, is_pm) if end_str else start + 2
        if end <= start:  # start is am, end is pm
            end = to_slot(end_str, True)
        for day in weekdays:
            if day in DAYS:
                slots.append((DAYS.index(day) * SLOTS_PER_DAY + start, end - start))
    return room, slots


def meetings(courses, rooms=None):
    """Map room -> {(slot, length, kind): {subject ids}} for the given rooms."""
    found = defaultdict(lambda: defaultdict(set))
    for course in courses:
        schedule = course.get("schedule")
        if not schedule:
            continue
        for chunk in schedule.split(";"):
            kind, *sections = chunk.split(",")
            for section in sections:
                if "/" not in section:
                    continue
                try:
                    room, slots = parse_section(section)
                except (ValueError, IndexError):
                    continue
                if rooms and room not in rooms:
                    continue
                for start, length in slots:
                    found[room][(start, length, kind)].add(course["subject_id"])
    return found


def clock(slot):
    minutes = 6 * 60 + slot * 30
    hour, minute = divmod(minutes, 60)
    suffix = "am" if hour < 12 else "pm"
    return f"{(hour - 1) % 12 + 1}:{minute:02d}{suffix}"


def parse_window(text):
    """Parse a window like 'T 2:30pm-4pm' into (days, set of absolute slots)."""
    match = re.fullmatch(
        r"\s*([MTWRF]+)\s+(\d{1,2})(?::(\d{2}))?\s*([ap]m)?\s*-\s*"
        r"(\d{1,2})(?::(\d{2}))?\s*([ap]m)?\s*",
        text,
        re.IGNORECASE,
    )
    if not match:
        sys.exit(f"cannot parse window {text!r}; try 'T 2:30pm-4pm'")
    days, sh, sm, sap, eh, em, eap = match.groups()
    sap, eap = (sap or eap or "pm").lower(), (eap or sap or "pm").lower()

    def slot(hour, minute, ampm):
        hour = int(hour) % 12 + (12 if ampm == "pm" else 0)
        return (hour * 60 + int(minute or 0) - 6 * 60) // 30

    start, end = slot(sh, sm, sap), slot(eh, em, eap)
    span = set()
    for day in days.upper():
        base = DAYS.index(day) * SLOTS_PER_DAY
        span |= set(range(base + start, base + end))
    return days.upper(), span


def show_grid(room, schedule):
    print(f"\n=== {room} ===")
    if not schedule:
        print("  no scheduled class meetings")
        return
    rows = sorted(
        (start // SLOTS_PER_DAY, start % SLOTS_PER_DAY, length, kind, sorted(subjects))
        for (start, length, kind), subjects in schedule.items()
    )
    day = None
    for index, start, length, kind, subjects in rows:
        if index != day:
            day = index
            print(f"  {DAY_NAMES[DAYS[index]]}")
        window = f"{clock(start)}-{clock(start + length)}"
        print(f"    {window:<17} {kind:<11} {' / '.join(subjects)}")


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("rooms", nargs="*", help="room numbers, e.g. 45-102")
    parser.add_argument("--free", metavar="WINDOW", help="window like 'T 2:30pm-4pm'")
    parser.add_argument(
        "--rooms",
        dest="room_set",
        help="comma-separated rooms, or a named set: " + ", ".join(ROOM_SETS),
    )
    parser.add_argument("--refresh", action="store_true", help="bypass the cache")
    args = parser.parse_args()

    rooms = list(args.rooms)
    if args.room_set:
        rooms += ROOM_SETS.get(args.room_set, args.room_set).replace(",", " ").split()
    if not rooms:
        parser.error("name at least one room, or pass --rooms")

    schedules = meetings(fetch(args.refresh), set(rooms))

    if not args.free:
        for room in rooms:
            show_grid(room, schedules[room])
        return

    days, window = parse_window(args.free)
    free, busy = [], {}
    for room in rooms:
        clash = {
            subject
            for (start, length, _), subjects in schedules[room].items()
            if set(range(start, start + length)) & window
            for subject in subjects
        }
        (busy.setdefault(room, clash) if clash else free.append(room))

    print(f"{args.free.strip()}  ({len(free)}/{len(rooms)} free)\n")
    print("free: " + (", ".join(free) if free else "(none)"))
    for room, clash in busy.items():
        print(f"  busy {room:<9} {', '.join(sorted(clash))}")


if __name__ == "__main__":
    main()
