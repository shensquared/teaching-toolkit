// ==UserScript==
// @name         Extract Faculty & TA Emails, Kerbs & Names, Copy to Clipboard
// @namespace    https://github.com/shensquared/eduportal-scripts
// @version      3.3
// @description  Adds buttons next to Faculty and TA Staff headers to extract emails, kerbs, and linked names; shows in modal and copies to clipboard.
// @match        https://eecseduportal.mit.edu/eduportal/lects/*
// @grant        GM_setClipboard
// @inject-into  content
// ==/UserScript==

(function() {
    'use strict';

    // --- Helpers ---

    function createButton(label, onClick) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.cssText = `
            margin-left: 10px;
            font-size: 12px;
            padding: 3px 6px;
            border: 1px solid #666;
            border-radius: 4px;
            background: #f0f0f0;
            cursor: pointer;
        `;
        btn.addEventListener('click', onClick);
        return btn;
    }

    function copyToClipboard(text) {
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(text);
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.append(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
    }

    function showModal(title, content, type = 'data') {
        const old = document.getElementById('extract-modal');
        if (old) old.remove();

        const overlay = document.createElement('div');
        overlay.id = 'extract-modal';
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex; justify-content: center; align-items: center;
            z-index: 10000;
        `;

        const box = document.createElement('div');
        box.style.cssText = `
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            max-width: 600px;
            max-height: 80vh;
            display: flex; flex-direction: column;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex; justify-content: space-between;
            align-items: center; margin-bottom: 10px;
            border-bottom: 1px solid #eee;
        `;
        const h3 = document.createElement('h3');
        h3.textContent = title;
        h3.style.margin = '0';
        const closeX = document.createElement('button');
        closeX.textContent = '×';
        closeX.style.cssText = 'background:none;border:none;font-size:24px;cursor:pointer';
        closeX.onclick = () => overlay.remove();
        header.append(h3, closeX);

        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.readOnly = true;
        textarea.style.cssText = `
            flex: 1; width: 100%; min-height: 200px;
            border: 1px solid #ddd; border-radius: 4px;
            padding: 10px; font-family: monospace; resize: vertical;
        `;

        const btnBar = document.createElement('div');
        btnBar.style.cssText = 'margin-top: 10px; display: flex; justify-content: flex-end; gap: 8px';
        const copyBtn = document.createElement('button');
        copyBtn.textContent = `📋 Copy ${type}`;
        copyBtn.style.cssText = `
            background: #007cba; color: #fff; border: none;
            padding: 6px 12px; border-radius: 4px; cursor: pointer;
        `;
        copyBtn.onclick = () => {
            copyToClipboard(content);
            copyBtn.textContent = '✅ Copied!';
            setTimeout(() => copyBtn.textContent = `📋 Copy ${type}`, 2000);
        };
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            background: #6c757d; color: #fff; border: none;
            padding: 6px 12px; border-radius: 4px; cursor: pointer;
        `;
        closeBtn.onclick = () => overlay.remove();

        btnBar.append(copyBtn, closeBtn);
        box.append(header, textarea, btnBar);
        overlay.append(box);
        document.body.append(overlay);

        textarea.focus();
        textarea.select();
    }

    async function fetchEmail(relurl) {
        try {
            const res = await fetch(relurl, { credentials: 'include' });
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            let found = null;
            doc.querySelectorAll('*').forEach(el => {
                const t = el.textContent.trim();
                if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(t)) found = t;
            });
            return found;
        } catch (err) {
            console.error('fetchEmail error', err);
            return null;
        }
    }

    function parseTerm() {
        // Extract term from page header like "6.3900[6.036] Introduction to Machine Learning in Spring 2026"
        const h2 = document.querySelector('h2');
        if (!h2) return null;

        const text = h2.textContent;
        const match = text.match(/(Spring|Fall|Summer|IAP)\s+(\d{4})/i);
        if (!match) return null;

        const season = match[1].toLowerCase();
        const year = match[2].slice(-2); // Last 2 digits
        return `${season}${year}`;
    }

    function downloadJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- Extraction functions ---

    async function extractEmailsFromSection(h3) {
        let nodes = [];
        const label = h3.textContent.trim();
        if (label.includes('TA Staff')) {
            let cur = h3.nextElementSibling;
            while (cur && cur.id !== 'course_term_info') {
                nodes.push(cur);
                cur = cur.nextElementSibling;
            }
        } else {
            const tbl = h3.nextElementSibling;
            if (tbl && tbl.tagName.toLowerCase() === 'table') nodes = [tbl];
            else return alert('⚠️ No table found after header.');
        }

        const links = nodes.flatMap(n => Array.from(n.querySelectorAll('a.balloon-link[relurl]')));
        if (!links.length) return alert('⚠️ No relurl links found.');
        const emailSet = new Set();
        const emails = await Promise.all(links.map(a => fetchEmail(a.getAttribute('relurl'))));
        emails.forEach(e => e && emailSet.add(e.trim()));
        if (!emailSet.size) return alert('⚠️ No emails found.');
        const result = Array.from(emailSet).join('\n');
        showModal(`📧 ${emailSet.size} Email(s)`, result, 'emails');
    }

    async function extractKerbsFromSection(h3) {
        let nodes = [];
        const label = h3.textContent.trim();
        if (label.includes('TA Staff')) {
            let cur = h3.nextElementSibling;
            while (cur && cur.id !== 'course_term_info') {
                nodes.push(cur);
                cur = cur.nextElementSibling;
            }
        } else {
            const tbl = h3.nextElementSibling;
            if (tbl && tbl.tagName.toLowerCase() === 'table') nodes = [tbl];
            else return alert('⚠️ No table found after header.');
        }

        const links = nodes.flatMap(n => Array.from(n.querySelectorAll('a.balloon-link[relurl]')));
        if (!links.length) return alert('⚠️ No relurl links found.');
        const kerbSet = new Set();
        const emails = await Promise.all(links.map(a => fetchEmail(a.getAttribute('relurl'))));
        emails.forEach(e => {
            if (e) {
                const [user, rawDomain] = e.trim().split('@');
                const domain = rawDomain.toLowerCase();           // <-- lowercase here
                let entry = user;
                if (domain !== 'mit.edu') {
                    entry += ` // ⚠️ Non-MIT domain: @${rawDomain}`;
                }
                kerbSet.add(entry);
            }
        });
        if (!kerbSet.size) return alert('⚠️ No kerbs found.');
        const result = Array.from(kerbSet).join('\n');
        showModal(`🔑 ${kerbSet.size} Kerb(s)`, result, 'kerbs');
    }

    function extractAndCopyNames(h3, event) {
        let nodes = [];
        if (h3.textContent.includes('TA Staff')) {
            let cur = h3.nextElementSibling;
            while (cur && cur.id !== 'course_term_info') {
                nodes.push(cur);
                cur = cur.nextElementSibling;
            }
        } else {
            const tbl = h3.nextElementSibling;
            if (tbl && tbl.tagName.toLowerCase() === 'table') nodes = [tbl];
            else return alert('⚠️ No table found after header.');
        }

        const links = nodes.flatMap(n => Array.from(n.querySelectorAll('a.balloon-link')));
        if (!links.length) return alert('⚠️ No linked names found.');
        const names = Array.from(new Set(links.map(a => a.textContent.trim()).filter(t => t)));
        const text = names.join('\n');
        copyToClipboard(text);
        const btn = event.currentTarget;
        const orig = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => btn.textContent = orig, 1500);
    }

    async function downloadStaffJSON(h3, event) {
        const term = parseTerm();
        if (!term) {
            return alert('⚠️ Could not parse term from page header.');
        }

        let nodes = [];
        if (h3.textContent.includes('TA Staff')) {
            let cur = h3.nextElementSibling;
            while (cur && cur.id !== 'course_term_info') {
                nodes.push(cur);
                cur = cur.nextElementSibling;
            }
        } else {
            const tbl = h3.nextElementSibling;
            if (tbl && tbl.tagName.toLowerCase() === 'table') nodes = [tbl];
            else return alert('⚠️ No table found after header.');
        }

        const links = nodes.flatMap(n => Array.from(n.querySelectorAll('a.balloon-link[relurl]')));
        if (!links.length) return alert('⚠️ No relurl links found.');

        const btn = event.currentTarget;
        const orig = btn.textContent;
        btn.textContent = '⏳ Fetching...';

        const nameKerbMap = {};
        const emails = await Promise.all(links.map(a => ({
            name: a.textContent.trim(),
            relurl: a.getAttribute('relurl')
        })).map(async ({ name, relurl }) => {
            const email = await fetchEmail(relurl);
            return { name, email };
        }));

        emails.forEach(({ name, email }) => {
            if (email) {
                const kerb = email.split('@')[0];
                nameKerbMap[name] = kerb;
            }
        });

        if (!Object.keys(nameKerbMap).length) {
            btn.textContent = orig;
            return alert('⚠️ No staff data found.');
        }

        const isTA = h3.textContent.includes('TA Staff');
        const section = isTA ? 'tas' : 'instructors';
        const roleKey = isTA ? 'TAs' : 'Instructors';

        const staffData = {
            [roleKey]: nameKerbMap
        };

        const filename = `${section}.json`;

        downloadJSON(staffData, filename);

        // Copy the target path to clipboard
        const targetPath = `~/code/390/${term}/web/info/staff/`;
        copyToClipboard(targetPath);

        btn.textContent = '✅ Downloaded!';
        setTimeout(() => btn.textContent = orig, 2000);
    }

    // --- Injection ---

    function injectButtons() {
        const container = document.querySelector('#class-select-content-div');
        if (!container) return;

        container.querySelectorAll('h3').forEach(h3 => {
            if (h3.dataset.extInjected) return;
            const txt = h3.textContent.trim();
            if (!/Faculty|TA Staff/.test(txt)) return;

            h3.appendChild(createButton('📧 Extract Emails', () => extractEmailsFromSection(h3)));
            h3.appendChild(createButton('🔑 Extract Kerbs',   () => extractKerbsFromSection(h3)));
            h3.appendChild(createButton('📋 Copy Names',      event => extractAndCopyNames(h3, event)));
            h3.appendChild(createButton('💾 Download JSON',   event => downloadStaffJSON(h3, event)));

            h3.dataset.extInjected = '1';
        });
    }

    const timer = setInterval(() => {
        const div = document.querySelector('#class-select-content-div');
        if (div) {
            clearInterval(timer);
            injectButtons();
            new MutationObserver(injectButtons)
                .observe(div, { childList: true, subtree: true });
        }
    }, 300);

})();