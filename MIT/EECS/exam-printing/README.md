# Batched exam printing

A two-script workflow that generates personalized exam PDFs from a LaTeX template (each stamped with a unique batch + serial number) and prints them to two EECS network printers in parallel. The batch / serial stamping is what makes [scanning](../scanning-hq.md) and Gradescope upload tractable later.

## Why batches

Printed exams have a unique ID consisting of `batch # + serial #`, stamped in the header and on the cover. With 20 exams per batch, proctors group physical copies by batch number at handout, scanners scan one batch at a time, and Gradescope uploads stay one-batch-per-upload. Lose a single exam and you can identify *which* batch, *which* serial, and find it.

Without batching, you have 400 anonymous identical-looking PDFs and no way to reconcile counts.

## Workflow

```bash
cd MIT/EECS/exam-printing/scripts

# 1. Generate PDFs from your LaTeX template (default: 20 batches × 20 serials = 400 exams)
python3 add-batch.py -b 20 -s 20 -f /path/to/your/exam/main.tex

# 2. Dry-run to preview without printing
python3 print-batch.py -b 20 --dry-run

# 3. Print for real
python3 print-batch.py -b 20
```

## What the scripts do

### `add-batch.py`

Reads your `main.tex`, replaces:

```tex
\newcommand{\batchnum}{0}
\newcommand{\serialnum}{0}
```

with each `(batch, serial)` combination, then runs `pdflatex` twice (two passes resolve cross-references). PDFs land under `Batch_1/`, `Batch_2/`, etc.; intermediate `.tex` backups go to `Generated_Tex/`.

### `print-batch.py`

Sends PDFs to two AirPrint printers in parallel:

| Printer | macOS name | Handles |
|---------|------------|---------|
| Printer 38 | `_18_25_15_38` | Even batches |
| Printer 39 | `_18_25_15_39` | Odd batches |

Print settings: 1 staple top-left, double-sided, no tumble. 20-second pause between docs to avoid queue saturation.

## Template requirements

Your `main.tex` must define `\batchnum` and `\serialnum` commands and use them somewhere visible (header, cover page, footer). The script literally string-replaces:

```tex
\newcommand{\batchnum}{0}    →    \newcommand{\batchnum}{N}
\newcommand{\serialnum}{0}   →    \newcommand{\serialnum}{M}
```

So the source has to have those exact lines.

## Checking printer state

```bash
lpstat -p -d                        # list configured printers
lpoptions -p _18_25_15_39 -l        # check capabilities
lpq -P _18_25_15_39                 # view print queue
```

## Requirements

- Python 3.
- `pdflatex` (MacTeX).
- macOS (uses `lpr`).
- Both EECS printers configured (38-445 IPs `18.25.15.38` and `18.25.15.39`; see [exam-day.md](../exam-day.md#printing-exams-38-445) for one-time AirPrint setup).
