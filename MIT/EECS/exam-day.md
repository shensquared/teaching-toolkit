# EECS exam-day flow: printing, proctoring, scanning

Operational notes for in-person exams in MIT EECS course rooms. General proctoring philosophy and accommodations live in [../exams.md](../exams.md); this doc covers the EECS-specific room / printer / scanner workflow.

## Printing exams (38-445)

### macOS

1. Open the PDF in Preview (not Adobe — Adobe can mess up the stapling).
2. Cmd-P to print.
3. **Printer → Add Printer**. Choose **IP**.
4. IP: `18.25.15.38` or `18.25.15.39` (also printed on the printer itself).
5. Protocol: **AirPrint**.
6. Back in the print box: **Finishing options → Apply finishing → Printer options → Staple = 1 staple top-left**.

### Windows

1. Join the `18-62` Wi-Fi.
2. Browse to the printer's IP (`18.25.15.38` / `18.25.15.39`); the printer's web UI lets you Direct Print.
3. Upload the PDF; set:
   - **Printed Side**: 2-sided.
   - **Finish → Staples**: 1 Position (Left).

## Exam-day proctoring (operational steps)

- **Pick up exams**: 34-501, 30 minutes before exam start (sharp).
- **Distribute by batch**: lay exams out at the table by batch number. Students pick up themselves; proctors don't hand out individually.
- **Cover-page reminder**: announce "please read the cover-page preamble" at the start.
- **Display the [extended-time clock](https://shenshen.mit.edu/clock/)** on the projector — has parallel 1×, 1.5×, 2× tracks.
- **Recurring questions** → post in the Slack exam channel so other rooms get the same clarification.
- **Collection**: at least one staff member guards the collection table at all times. Sort by batch (20 exams per batch, typical). Bring everything to the Jackson room (38-466) for scanning.

## Scanning (Jackson room, 38-466)

Each exam has a unique exam ID (batch # + serial #). Keep batches together end-to-end: same scanners, same upload, same Gradescope group. **Don't upload incomplete batches** — easy way to lose exams.

### Roles, in pairs of 2

- **Cutter**: cuts the stapled corner off so pages feed cleanly. Vary the cut angle so pages separate easily. Keep "scanned" and "unscanned" piles physically separated (or use bins).
- **Scanner**: feeds the scanner, names PDFs, uploads to Gradescope.

### Scanners

- **ScanSnap iX1600** (older, 2× of these for midterms):
  - USB-A, bring an adapter if your laptop is USB-C.
  - 50 pages max — for batches of 20 exams, do 7-7-6.
  - Place pages with the top upside-down and front facing down.
  - Naming: `batch_<batch#>_<scan_index>.pdf`. Gradescope can split a multi-exam PDF.
  - Driver download: <https://www.pfu.ricoh.com/global/scanners/scansnap/dl/>.
- **Xerox D50** (newer, 1× duo, 120-page tray):
  - Setup info: <https://www.xeroxscanners.com/en/product/xerox-d50-scanner/>.
  - In Setup, check both front and back (double-sided).
  - Output mode: **MPDF** for multi-page PDFs.

### Reconciliation

Track on the whiteboard:

| Batch | Initial count | Final count | Equal? |
|-------|---------------|-------------|--------|
| B1    | 20            | 20          | ✓      |
| B2    | 20            |             |        |
| ...   | ...           | ...         | ...    |

After uploading, sanity-check Gradescope submission counts against the "Final" column.

## Safety

The cutter station has a **very old first aid kit**. Don't cut yourself — injuries have happened. Vary cut angles slowly, don't rush.
