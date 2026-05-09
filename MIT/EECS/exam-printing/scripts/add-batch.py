"""Generate per-copy exam PDFs from a LaTeX template, stamping each with a
unique batch + serial number. See ../README.md for the full workflow.

Author: shensquared
"""

import os
import subprocess
import shutil
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

# Parse command line arguments
parser = argparse.ArgumentParser(description='Generate exam PDFs from LaTeX template')
parser.add_argument('-t', '--test', action='store_true', help='Run in test mode (batch 1-3, serial 1-3)')
parser.add_argument('-b', '--max-b', type=int, default=20, help='Maximum batch number (default: 20)')
parser.add_argument('--batch', type=int, help='Generate a specific batch number (overrides -b)')
parser.add_argument('-s', '--max-s', type=int, default=20, help='Maximum serial number (default: 20)')
parser.add_argument('-f', '--template-file', type=str, default=None, help='Path to LaTeX template file (required)')
args = parser.parse_args()

if args.template_file is None:
    parser.error("--template-file is required (path to your exam main.tex)")

# Set ranges based on test mode or arguments
if args.test:
    batch_range = range(1, 4)  # 1-3
    serial_range = range(1, 4)  # 1-3
elif args.batch:
    batch_range = range(args.batch, args.batch + 1)  # Single batch
    serial_range = range(1, args.max_s + 1)
else:
    batch_range = range(1, args.max_b + 1)
    serial_range = range(1, args.max_s + 1)

# Use the specific file path provided
TEMPLATE_FILE = args.template_file
template_dir = os.path.dirname(TEMPLATE_FILE)

# Current working directory (where you run the script)
script_dir = '/Users/shenshen/code/course-admin-scripts/exam-print-scanning/printing'

# Read template content once
with open(TEMPLATE_FILE, 'r') as file:
    template_content = file.read()

# Determine number of threads based on hardware
max_workers = os.cpu_count() or 4  # Default to 4 if cpu_count() returns None
print(f"🔧 Using {max_workers} threads for parallel processing")

# Lock for thread-safe printing
print_lock = threading.Lock()

def process_batch(batch_num):
    """Process a single batch: generate, compile, clean, and move files."""
    batch_tex_files = []
    errors = []
    
    # Step 1: Generate .tex files for this batch
    for serial_num in serial_range:
        exam_content = template_content \
            .replace(r'\newcommand{\batchnum}{0}', rf'\newcommand{{\batchnum}}{{{batch_num}}}') \
            .replace(r'\newcommand{\serialnum}{0}', rf'\newcommand{{\serialnum}}{{{serial_num}}}')

        output_tex_filename = f'Exam_Batch{batch_num}_Serial{serial_num}.tex'
        output_tex_path = os.path.join(template_dir, output_tex_filename)

        with open(output_tex_path, 'w') as tex_file:
            tex_file.write(exam_content)

        batch_tex_files.append(output_tex_filename)
    
    # Step 2: Compile all .tex files for this batch
    for tex_file in batch_tex_files:
        try:
            for _ in range(2):
                subprocess.run(
                    ['pdflatex', '-interaction=nonstopmode', tex_file],
                    cwd=template_dir,
                    check=True,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL
                )
            with print_lock:
                print(f"✅ Compiled: {tex_file}")
        except subprocess.CalledProcessError:
            error_msg = f"❌ Error compiling {tex_file}"
            errors.append(error_msg)
            with print_lock:
                print(error_msg)
    
    # Step 3: Clean auxiliary files for this batch
    for tex_file in batch_tex_files:
        for ext in ['aux', 'log', 'out']:
            aux_file = tex_file.replace('.tex', f'.{ext}')
            aux_file_path = os.path.join(template_dir, aux_file)
            if os.path.exists(aux_file_path):
                os.remove(aux_file_path)
    
    # Step 4: Move PDFs to batch folder
    batch_dir = os.path.join(script_dir, f'Batch_{batch_num}')
    os.makedirs(batch_dir, exist_ok=True)
    
    for serial_num in serial_range:
        pdf_filename = f'Exam_Batch{batch_num}_Serial{serial_num}.pdf'
        src_pdf_path = os.path.join(template_dir, pdf_filename)
        dst_pdf_path = os.path.join(batch_dir, pdf_filename)
        
        if os.path.exists(src_pdf_path):
            shutil.move(src_pdf_path, dst_pdf_path)
    
    # Step 5: Move .tex files to backup folder
    tex_backup_dir = os.path.join(script_dir, 'Generated_Tex')
    os.makedirs(tex_backup_dir, exist_ok=True)
    
    for tex_file in batch_tex_files:
        src_tex_path = os.path.join(template_dir, tex_file)
        dst_tex_path = os.path.join(tex_backup_dir, tex_file)
        if os.path.exists(src_tex_path):
            shutil.move(src_tex_path, dst_tex_path)
    
    return batch_num, errors

# Process all batches in parallel
all_errors = []
with ThreadPoolExecutor(max_workers=max_workers) as executor:
    # Submit all batch processing tasks
    future_to_batch = {executor.submit(process_batch, batch_num): batch_num 
                       for batch_num in batch_range}
    
    # Collect results as they complete
    for future in as_completed(future_to_batch):
        batch_num, errors = future.result()
        all_errors.extend(errors)

# Check if there were any errors
if all_errors:
    print(f"\n❌ Encountered {len(all_errors)} error(s) during compilation")
    exit(1)

print("🎉 All PDFs successfully compiled and organized into Batch folders.")