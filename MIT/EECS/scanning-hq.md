# Scanning at EECS HQ

For exams sent through the **big copy-room scanners** in the EECS HQ suite, with scans landing on a self-hosted WebDAV cloud. For the small portable ScanSnap / Xerox D50 setup, see [exam-day.md](exam-day.md#scanning-jackson-room-38-466).

## Location

- **Jackson room** (scanning station): 38-466, 4th floor of Building 38, in the EECS HQ suite (between Grier and the UG/Grad office).
- **Portable scanner storage**: 34-501, right side, on a black cart, farther from the elevators. Backup portable on the 7th floor of Building 45.
- **WebDAV destination**: `https://cloud.shenshen.mit.edu/remote.php/dav/files/EECSHQ`. The scanner address book entry is `Shen Shen (WebDav)`.
- [Demo video](https://youtube.com/shorts/69NIUE1nArk).

## Supplies

- Scissors for cutting stapled corners (and a cardboard box of them in the Jackson room).
- 6 portable scanners on the Jackson-room table (backup while the big copy-room scanners are in use).
- USB adapters: check availability before exam day.

## Workflow

1. **Prep**: stack exams in batches of ~10. Cut the stapled corners off. Label each batch.
2. **Load the scanner**: face up, corners pointing out (away from the feeder; see the demo). Select two-sided scanning.
3. **Send to cloud**: in the scanner address book, go to the **S** tab and select `Shen Shen (WebDav)` (not the email option). Press **Start**.
4. **Verify**: open [cloud.shenshen.mit.edu](https://cloud.shenshen.mit.edu/s/xsxjnHCSCqL6E2D). A file like `SKM_*.PDF` should appear. Expected page count is `(pages per exam) × (exams in batch)`, e.g. 18 × 10 = 180. Even number is good; odd or slightly short means a page was missed, rescan the batch.
5. **Rename**: `SKM_*.pdf` → `batch1.pdf`, `batch2.pdf`, etc.
6. **Upload to Gradescope**: cross-reference the upload count with your batch tallies.

## Coordination

- If multiple classes are scanning simultaneously, share the Jackson-room table space.
- The big copy-room scanners may be reserved by other classes; check availability ahead of time.
- Jackson room key must be checked out **before 5pm** on exam day.
