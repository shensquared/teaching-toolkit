"""Print batched exam PDFs to two EECS network printers in parallel.
See ../README.md for the full workflow.

Author: shensquared
"""

import os
import subprocess
import time  # Import for sleep function
import argparse
import threading
from concurrent.futures import ThreadPoolExecutor

# ====================== Printer Setup ======================

# STEP 1: Check your printer name on macOS
# Run this command in Terminal to list available printers:
#   lpstat -p -d
# Example output:
#   printer My_AirPrint_Printer is idle. enabled since ...
#   system default destination: My_AirPrint_Printer

# STEP 2: Check available printing options supported by your printer
# Run this command in Terminal (replace "My_AirPrint_Printer" with your actual printer name):
#   lpoptions -p My_AirPrint_Printer -l
# Look for options like "StapleLocation" or "sides" to confirm support for stapling and duplex printing.

# ===========================================================

# Parse command line arguments
parser = argparse.ArgumentParser(description='Print exam PDFs from batch folders')
parser.add_argument('-b', '--max-b', type=int, default=21, help='Maximum batch number (default: 21)')
parser.add_argument('--batch', type=int, help='Print a specific batch number (overrides -b)')
parser.add_argument('--batch-start', type=int, help='Starting batch number (default: 1)')
parser.add_argument('-s', '--max-s', type=int, default=21, help='Maximum serial number (default: 21)')
parser.add_argument('--serial-start', type=int, help='Starting serial number (default: 1)')
parser.add_argument('--serial-end', type=int, help='Ending serial number (default: max-s)')
parser.add_argument('-p', '--printer', type=str, choices=['38', '39'], help='Force printer: "38" or "39" (overrides automatic selection)')
parser.add_argument('--dry-run', action='store_true', help='Dry run mode: show what would be printed without actually printing')
args = parser.parse_args()

# Printer names

PRINTER_38 = '_18_25_15_38'  # Even batches (2, 4, 6, ...)
PRINTER_39 = '_18_25_15_39'  # Odd batches (1, 3, 5, ...)

# Determine batch range
if args.batch:
    batch_range = range(args.batch, args.batch + 1)
else:
    batch_start = args.batch_start if args.batch_start else 1
    batch_range = range(batch_start, args.max_b + 1)

# Determine serial range
serial_start = args.serial_start if args.serial_start else 1
serial_end = args.serial_end if args.serial_end else args.max_s
serial_range = range(serial_start, serial_end + 1)

# Current directory (script location)
base_dir = '~/Downloads/printing/'

# Lock for thread-safe printing
print_lock = threading.Lock()

def print_batches_to_printer(batch_numbers, printer_name, printer_num, dry_run=False):
    """Print batches to a specific printer, processing batches and serials in order."""
    # Ensure batches are sorted to maintain order
    sorted_batches = sorted(batch_numbers)
    
    for batch_num in sorted_batches:
        with print_lock:
            mode_prefix = "🔍 [DRY RUN] " if dry_run else ""
            print(f"{mode_prefix}🖨️ Printing: Batch {batch_num} on printer {printer_num}")
        batch_dir = os.path.join(base_dir, f'Batch_{batch_num}')

        for serial_num in serial_range:
            pdf_filename = f'Exam_Batch{batch_num}_Serial{serial_num}.pdf'
            pdf_path = os.path.join(batch_dir, pdf_filename)

            if os.path.exists(pdf_path):
                with print_lock:
                    mode_prefix = "🔍 [DRY RUN] " if dry_run else ""
                    print(f"{mode_prefix}🖨️ Printing: Batch {batch_num}, Serial {serial_num} on printer {printer_num}")
                
                print_command = [
                    'lpr',
                    '-P', printer_name,
                    '-o', 'StapleLocation=SinglePortrait',
                    '-o', 'Duplex=DuplexNoTumble',
                    pdf_path
                ]

                if dry_run:
                    with print_lock:
                        print(f"🔍 [DRY RUN] Would execute: {' '.join(print_command)}")
                else:
                    subprocess.run(print_command)
                
                with print_lock:
                    mode_prefix = "🔍 [DRY RUN] " if dry_run else ""
                    status = "Would print" if dry_run else "Printed"
                    print(f"{mode_prefix}🖨️ {status}: Batch {batch_num}, Serial {serial_num} on printer {printer_num}")

                # Wait 20 seconds before processing the next document (or 0.1s in dry-run mode)
                if dry_run:
                    time.sleep(0.1)  # Short delay for dry-run to show progress
                else:
                    time.sleep(20)

# If forced printer is specified, use single-threaded mode
if args.printer:
    if args.printer == '38':
        PRINTER_NAME = PRINTER_38
        printer_num = '38'
    else:
        PRINTER_NAME = PRINTER_39
        printer_num = '39'
    
    mode_msg = "🔍 [DRY RUN MODE] " if args.dry_run else ""
    print(f"{mode_msg}🖨️ Using forced printer {printer_num}")
    print_batches_to_printer(list(batch_range), PRINTER_NAME, printer_num, dry_run=args.dry_run)
else:
    # Split batches into odd and even, ensuring they're sorted
    odd_batches = sorted([b for b in batch_range if b % 2 == 1])
    even_batches = sorted([b for b in batch_range if b % 2 == 0])
    
    mode_msg = "🔍 [DRY RUN MODE] " if args.dry_run else ""
    print(f"{mode_msg}🔧 Using 2 threads:")
    print(f"   Thread 1: Odd batches {odd_batches} → Printer 39")
    print(f"   Thread 2: Even batches {even_batches} → Printer 38")
    
    # Process batches in parallel with 2 threads
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = []
        # Submit odd batches to printer 39
        if odd_batches:
            futures.append(executor.submit(print_batches_to_printer, odd_batches, PRINTER_39, '39', args.dry_run))
        
        # Submit even batches to printer 38
        if even_batches:
            futures.append(executor.submit(print_batches_to_printer, even_batches, PRINTER_38, '38', args.dry_run))
        
        # Wait for all threads to complete
        for future in futures:
            future.result()

mode_msg = "🔍 [DRY RUN] " if args.dry_run else ""
print(f"{mode_msg}✅ All documents sent to the printer.")