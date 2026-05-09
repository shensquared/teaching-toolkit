// ==UserScript==
// @name         MIT Instructor Approval Auto-Fill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-fill instructor approval form for MIT cross-registration requests
// @author       You
// @match        https://studentformsandpetitions.mit.edu/adddrop/approver/xreg/instructorApproval.htm*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('MIT Instructor Approval Auto-Fill script loaded');
    
    // Wait for the page to fully load
    function waitForElement(selector, callback, maxWaitTime = 10000) {
        const startTime = Date.now();
        
        function check() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (Date.now() - startTime < maxWaitTime) {
                setTimeout(check, 100);
            } else {
                console.log(`Element ${selector} not found within ${maxWaitTime}ms`);
            }
        }
        
        check();
    }
    
    // Function to auto-fill the form
    function autoFillForm() {
        console.log('Starting auto-fill process...');
        
        // 1. Confirm table shows "Add" for 6.3900
        const courseRow = Array.from(document.querySelectorAll('tr')).find(row => 
            row.textContent.includes('6.3900') && row.textContent.includes('Add')
        );
        
        if (!courseRow) {
            console.log('Could not find 6.3900 Add row in table');
            return;
        }
        
        console.log('Found 6.3900 Add row:', courseRow.textContent.trim());
        console.log('Row HTML structure:', courseRow.innerHTML);
        
        // 2. Find the Decision dropdown - try multiple approaches
        let decisionSelect = courseRow.querySelector('select.decisiondropdown');
        
        if (!decisionSelect) {
            // Try alternative selectors
            decisionSelect = courseRow.querySelector('select[name*="decision"]');
        }
        
        if (!decisionSelect) {
            // Try finding any select element in the row
            decisionSelect = courseRow.querySelector('select');
        }
        
        if (!decisionSelect) {
            // Look for decision dropdown in the entire page
            decisionSelect = document.querySelector('select.decisiondropdown');
            if (decisionSelect) {
                console.log('Found decision dropdown outside the row');
            }
        }
        
        if (!decisionSelect) {
            console.log('Could not find decision dropdown');
            console.log('All select elements on page:', document.querySelectorAll('select'));
            return;
        }
        
        console.log('Found decision dropdown:', decisionSelect);
        console.log('Available options:', Array.from(decisionSelect.options).map(opt => `${opt.value}: ${opt.textContent}`));
        
        // 3. Set Decision to "Consult" (value "C")
        const consultOption = Array.from(decisionSelect.options).find(option => 
            option.textContent.includes('Consult') || option.value === 'C'
        );
        
        if (consultOption) {
            decisionSelect.value = consultOption.value;
            console.log('Set decision to Consult:', consultOption.textContent);
            
            // Trigger change event to ensure the form recognizes the change
            const changeEvent = new Event('change', { bubbles: true });
            decisionSelect.dispatchEvent(changeEvent);
        } else {
            console.log('Could not find Consult option in decision dropdown');
            console.log('Available options:', Array.from(decisionSelect.options).map(opt => `${opt.value}: ${opt.textContent}`));
        }
        
        // 4. Find the Comment textarea - try multiple approaches
        let commentTextarea = courseRow.querySelector('textarea[placeholder*="Comment to student"]');
        
        if (!commentTextarea) {
            // Try alternative selectors
            commentTextarea = courseRow.querySelector('textarea[name*="comment"]');
        }
        
        if (!commentTextarea) {
            // Try finding any textarea in the row
            commentTextarea = courseRow.querySelector('textarea');
        }
        
        if (!commentTextarea) {
            // Look for comment textarea in the entire page
            commentTextarea = document.querySelector('textarea[placeholder*="Comment to student"]');
            if (commentTextarea) {
                console.log('Found comment textarea outside the row');
            }
        }
        
        if (!commentTextarea) {
            console.log('Could not find comment textarea');
            console.log('All textarea elements on page:', document.querySelectorAll('textarea'));
            return;
        }
        
        console.log('Found comment textarea:', commentTextarea);
        
        // 5. Set the comment text
        const commentText = 'Please see `https://introml.mit.edu/fall25#_cross_registration` for details and updates';
        commentTextarea.value = commentText;
        console.log('Set comment:', commentText);
        
        // Trigger change event to ensure the form recognizes the change
        const changeEvent = new Event('change', { bubbles: true });
        commentTextarea.dispatchEvent(changeEvent);
        
        // 6. Show completion message
        console.log('Auto-fill completed successfully!');
        
        // Add a visual indicator
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            border-radius: 4px;
            padding: 15px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;
        successDiv.innerHTML = `
            <strong>✅ Auto-Fill Complete!</strong><br>
            • Decision set to: Consult<br>
            • Comment added with course link<br>
            • Ready to submit
        `;
        document.body.appendChild(successDiv);
        
        // Remove the indicator after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 5000);
    }
    
    // Initialize when page is ready
    function init() {
        console.log('Initializing MIT Instructor Approval Auto-Fill...');
        
        // Wait for the decision dropdown to appear
        waitForElement('select.decisiondropdown', () => {
            console.log('Decision dropdown found, starting auto-fill...');
            // Add a small delay to ensure the page is fully loaded
            setTimeout(autoFillForm, 1000);
        });
    }
    
    // Start the script
    if (document.readyState === 'loading') {
        console.log('Document still loading, waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', init);
    } else {
        console.log('Document already loaded, initializing immediately...');
        init();
    }
})();