# EECS exam-day flow: printing and proctoring

Operational notes for in-person exams in MIT EECS course rooms. General proctoring philosophy and accommodations live in [../exams.md](../exams.md); for the EECS HQ scanning pipeline, see [scanning-hq.md](scanning-hq.md). This doc covers the EECS-specific room / printer workflow.

## Printing exams (38-445)

For 100+ student exams, use the [batched printing workflow](exam-printing/); it stamps each copy with a unique batch + serial number that makes downstream scanning and reconciliation tractable. Manual one-at-a-time setup below is for small print jobs or one-off documents.

### macOS

1. Open the PDF in Preview (not Adobe; Adobe can mess up the stapling).
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
- **Display the [extended-time clock](https://shenshen.mit.edu/clock/)** on the projector; it has parallel 1×, 1.5×, 2× tracks.
- **Recurring questions** → post in the Slack exam channel so other rooms get the same clarification.
- **Collection**: at least one staff member guards the collection table at all times. Sort by batch (20 exams per batch, typical). Hand off to the scanning team; see [scanning-hq.md](scanning-hq.md).
