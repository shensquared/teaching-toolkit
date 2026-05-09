#!/usr/bin/env bash
# Mechanical helpers for porting a CAT-SOOP course to a new semester.
#
# Usage: ./port-semester.sh <old-term> <new-term>
#   e.g. ./port-semester.sh fall25 spring26
#
# TODO: fill in the actual steps. Sketch:
#   1. Validate args.
#   2. Rename top-level term folder (if your repo layout uses one).
#   3. Update YEAR / term string in preload.py (or equivalent).
#   4. Update STAGE to pre_semester.
#   5. Print a checklist of remaining manual steps (link to checklist.md).

set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "usage: $0 <old-term> <new-term>"
  exit 1
fi

OLD_TERM="$1"
NEW_TERM="$2"

echo "TODO: implement port from $OLD_TERM to $NEW_TERM"
exit 1
