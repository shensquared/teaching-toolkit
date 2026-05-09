// ==UserScript==
// @name         MIT LA/Grader – Download Names & Kerbs (with count)
// @namespace    https://github.com/shensquared/eduportal-scripts
// @version      1.3
// @description  Adds two buttons (Download Names / Download Kerbs) and shows how many "Student accepted" rows exist. Includes debug output.
// @author       Your Name
// @match        https://eecseduportal.mit.edu/eduportal/lects/*
// @match        https://eecseduportal.mit.edu/eduportal/*   // fallback
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
    'use strict';

    /* -------------------------------------------------
       Helper – trigger a download of a plain‑text file
       ------------------------------------------------- */
    function downloadTextFile(filename, text) {
        console.log(`[LA‑Downloader] Preparing download → ${filename}`);
        const blob = new Blob([text], {type: 'text/plain'});
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('[LA‑Downloader] Download triggered');
    }

    /* -------------------------------------------------
       Core – collect rows whose Hiring Status = "Student accepted"
       ------------------------------------------------- */
    function getAcceptedRows() {
        const table = document.getElementById('ta_select');
        if (!table) {
            console.warn('[LA‑Downloader] Table #ta_select not found');
            return [];
        }

        const rows = table.querySelectorAll('tbody > tr');
        const accepted = [];

        rows.forEach((row, idx) => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 5) {
                console.debug(`[LA‑Downloader] Row ${idx} skipped – not enough cells`);
                return;
            }

            const statusText = cells[4].textContent.trim().toLowerCase();
            if (!statusText.includes('student accepted')) {
                console.debug(`[LA‑Downloader] Row ${idx} ignored – status "${statusText}"`);
                return;
            }

            accepted.push({
                idx,
                nameCell: cells[1]   // column with "Display Name (kerb)"
            });
        });

        console.log(`[LA‑Downloader] Found ${accepted.length} "Student accepted" rows`);
        return accepted;
    }

    /* -------------------------------------------------
       UI – update the counter text
       ------------------------------------------------- */
    function updateCounter() {
        const count = getAcceptedRows().length;
        const span = document.getElementById('la-downloader-count');
        if (span) {
            span.textContent = `✅ ${count} accepted`;
        }
    }

    /* -------------------------------------------------
       Action – Download Names
       ------------------------------------------------- */
    function downloadNames() {
        console.log('[LA‑Downloader] downloadNames() called');
        const rows = getAcceptedRows();
        if (rows.length === 0) {
            alert('⚠️ No "Student accepted" rows were found. See console for details.');
            updateCounter();               // keep the counter accurate
            return;
        }

        const names = rows.map(r => {
            const full = r.nameCell.textContent.trim();
            const display = full.replace(/\s*\([^)]*\)\s*$/, '').trim();
            console.debug(`[LA‑Downloader] Row ${r.idx} → name "${display}"`);
            return display;
        });

        const csv = names.join(', ');
        console.log(`[LA‑Downloader] ${names.length} names collected → ${csv}`);
        downloadTextFile('la-names.txt', csv);
        updateCounter();
    }

    /* -------------------------------------------------
       Action – Download Kerbs
       ------------------------------------------------- */
    function downloadKerbs() {
        console.log('[LA‑Downloader] downloadKerbs() called');
        const rows = getAcceptedRows();
        if (rows.length === 0) {
            alert('⚠️ No "Student accepted" rows were found. See console for details.');
            updateCounter();
            return;
        }

        const kerbs = rows.map(r => {
            const full = r.nameCell.textContent.trim();
            const match = full.match(/\(([^)]+)\)\s*$/);
            const kerb = match ? match[1].trim() : '';
            console.debug(`[LA‑Downloader] Row ${r.idx} → kerb "${kerb}"`);
            return kerb;
        }).filter(k => k !== '');

        const csv = kerbs.join(', ');
        console.log(`[LA‑Downloader] ${kerbs.length} kerbs collected → ${csv}`);
        downloadTextFile('la-kerbs.txt', csv);
        updateCounter();
    }

    /* -------------------------------------------------
       UI – insert the two buttons + counter
       ------------------------------------------------- */
    function insertButtons() {
        const table = document.getElementById('ta_select');
        if (!table) {
            console.warn('[LA‑Downloader] insertButtons(): Table not present yet');
            return;
        }

        // Avoid inserting twice
        if (document.getElementById('la-downloader-btns-wrapper')) {
            console.log('[LA‑Downloader] Buttons already inserted – abort');
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.id = 'la-downloader-btns-wrapper';
        wrapper.style.margin = '10px 0';
        wrapper.style.textAlign = 'right';
        wrapper.style.display = 'inline-flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '8px';

        // ----- Download Names button -----
        const btnNames = document.createElement('button');
        btnNames.textContent = 'Download Names';
        btnNames.style.padding = '6px 12px';
        btnNames.style.fontSize = '14px';
        btnNames.style.cursor = 'pointer';
        btnNames.addEventListener('click', downloadNames);
        wrapper.appendChild(btnNames);

        // ----- Download Kerbs button -----
        const btnKerbs = document.createElement('button');
        btnKerbs.textContent = 'Download Kerbs';
        btnKerbs.style.padding = '6px 12px';
        btnKerbs.style.fontSize = '14px';
        btnKerbs.style.cursor = 'pointer';
        btnKerbs.addEventListener('click', downloadKerbs);
        wrapper.appendChild(btnKerbs);

        // ----- Counter span -----
        const counterSpan = document.createElement('span');
        counterSpan.id = 'la-downloader-count';
        counterSpan.style.fontWeight = 'bold';
        counterSpan.style.marginLeft = '6px';
        counterSpan.textContent = '✅ 0 accepted';   // placeholder – will be updated shortly
        wrapper.appendChild(counterSpan);

        // Insert wrapper right before the table
        table.parentNode.insertBefore(wrapper, table);
        console.log('[LA‑Downloader] Buttons + counter inserted');

        // Populate the counter for the first time
        updateCounter();
    }

    /* -------------------------------------------------
       Watch for the table to appear (it may be added after AJAX)
       ------------------------------------------------- */
    function waitForTable() {
        const target = document.body;
        const observer = new MutationObserver((mutations, obs) => {
            if (document.getElementById('ta_select')) {
                console.log('[LA‑Downloader] Table detected – inserting UI');
                insertButtons();
                obs.disconnect();               // stop watching once we have the table
            }
        });

        observer.observe(target, { childList: true, subtree: true });

        // If the table is already there when the script runs:
        if (document.getElementById('ta_select')) {
            console.log('[LA‑Downloader] Table already present on script start');
            insertButtons();
            observer.disconnect();
        }
    }

    /* -------------------------------------------------
       Kick‑off
       ------------------------------------------------- */
    console.log('[LA‑Downloader] Script loaded – waiting for page to be ready');
    waitForTable();

})();