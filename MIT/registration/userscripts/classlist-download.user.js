// ==UserScript==
// @name         MIT Auto ClassList Download - 2026FA + 6.3900 (Confirmed)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Auto-select term radio (2026FA), subject 6.3900, then click ClassList Download
// @match        https://student.mit.edu/cgi-bin/sfprwlst_sel.sh
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const waitFor = (predicate, timeout = 5000) =>
    new Promise((resolve, reject) => {
      const start = Date.now();
      const timer = setInterval(() => {
        const result = predicate();
        if (result) {
          clearInterval(timer);
          resolve(result);
        } else if (Date.now() - start > timeout) {
          clearInterval(timer);
          reject("Timeout waiting for condition");
        }
      }, 200);
    });

  const clickDownload = () => {
    const downloadBtn = Array.from(document.querySelectorAll('input[type="button"]'))
      .find(btn => btn.value === "ClassList Download" && btn.getAttribute("onClick") === "validate(2)");
    if (downloadBtn) {
      console.log("✅ Clicking ClassList Download");
      downloadBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => downloadBtn.click(), 300);
    } else {
      console.warn("❌ Download button not found");
    }
  };

  window.addEventListener('load', () => {
    const desiredTerm = "2026FA";
    const desiredSubject = "6.3900";

    // 1. Click the term radio
    const termRadio = Array.from(document.querySelectorAll('input[type="radio"][name="termcode"]'))
      .find(r => r.value === desiredTerm);
    if (!termRadio) {
      console.warn(`❌ Term radio with value ${desiredTerm} not found`);
      return;
    }
    termRadio.checked = true;
    termRadio.click();
    console.log(`✅ Selected term radio: ${desiredTerm}`);

    // 2. Wait for subject dropdown to appear
    waitFor(() => document.querySelector('select[name="SUBJECT01"]'))
      .then(subjectSelect => {
        const option = Array.from(subjectSelect.options).find(opt => opt.value.trim() === desiredSubject);
        if (!option) throw new Error(`❌ Subject ${desiredSubject} not found`);
        subjectSelect.value = option.value;
        subjectSelect.dispatchEvent(new Event("change", { bubbles: true }));
        subjectSelect.dispatchEvent(new Event("blur"));
        console.log(`✅ Selected subject: ${desiredSubject}`);

        // 3. Trigger ClassList Download
        setTimeout(clickDownload, 600);
      })
      .catch(err => console.warn("❌ Subject dropdown wait failed:", err));
  });
})();