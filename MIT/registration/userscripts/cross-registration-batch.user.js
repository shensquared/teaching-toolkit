// ==UserScript==
// @name         MIT Batch Process Cross-Registration V2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Batch process cross-registration forms for MIT student forms page - Enhanced Version
// @author       You
// @match        https://studentformsandpetitions.mit.edu/sfp/approver/myForms.htm
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Version check - this should show in console to confirm new version is running
    console.log('MIT Batch Process Script v2.0 loaded - Enhanced logging enabled');
    
    // Force script refresh by adding timestamp
    const scriptTimestamp = Date.now();
    console.log(`Script loaded at: ${new Date(scriptTimestamp).toLocaleString()}`);

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

    // Add the batch process button
    function addBatchProcessButton() {
        console.log('Attempting to add batch process button...');
        
        // Check if button already exists
        if (document.getElementById('batchProcessBtn')) {
            console.log('Button already exists, skipping...');
            return;
        }

        // Find the search button to place our button near it
        const searchButton = document.getElementById('btnSearch');
        if (!searchButton) {
            console.log('Search button not found, retrying...');
            // Try again in a moment
            setTimeout(addBatchProcessButton, 1000);
            return;
        }

        console.log('Found search button, creating batch button...');

        // Create the batch process button
        const batchButton = document.createElement('input');
        batchButton.type = 'button';
        batchButton.id = 'batchProcessBtn';
        batchButton.className = 'btn btn-primary doublespaced';
        batchButton.value = 'Batch Process Cross-Registration V2';
        batchButton.style.marginLeft = '10px';
        batchButton.style.backgroundColor = '#337ab7';
        batchButton.style.borderColor = '#2e6da4';
        batchButton.style.color = 'white';

        // Add click event
        batchButton.addEventListener('click', processBatchForms);

        // Insert the button after the search button
        try {
            searchButton.parentNode.insertBefore(batchButton, searchButton.nextSibling);
            console.log('Batch process button added successfully!');
        } catch (error) {
            console.error('Error inserting button:', error);
            // Fallback: append to the parent container
            searchButton.parentNode.appendChild(batchButton);
            console.log('Button added using fallback method');
        }
    }

    // Process the batch forms
    function processBatchForms() {
        console.log('Starting batch process V2...');
        console.log('ENHANCED LOGGING TEST - This should appear if v2.0 is running');
        
        // Find all tables that might contain forms
        const tables = [
            document.getElementById('tblRequiresAction'),
            document.getElementById('tblSearchResults')
        ].filter(Boolean);

        let totalEligible = 0;
        let firstEligibleElement = null;
        let firstEligibleCourse = '';

        tables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 7) return; // Need at least 7 columns

                // Check Form Name (first column)
                const formNameCell = cells[0];
                const formNameLink = formNameCell.querySelector('a');
                if (!formNameLink || !formNameLink.textContent.trim().includes('Add Drop')) {
                    return;
                }

                // Check Course (6th column, index 5)
                const courseCell = cells[5];
                const courseText = courseCell.textContent.trim();
                if (!courseText.startsWith('NIH.')) {
                    return;
                }

                // Check Status (7th column, index 6)
                const statusCell = cells[6];
                const statusText = statusCell.textContent.trim();
                if (statusText !== 'In Progress') {
                    return;
                }

                totalEligible++;
                
                // Store the first eligible link element we find
                if (!firstEligibleElement) {
                    firstEligibleElement = formNameLink;
                    firstEligibleCourse = courseText;
                    console.log(`Found first eligible form: ${courseText} - ${statusText}`);
                    console.log(`Form element:`, firstEligibleElement);
                    console.log(`Form element href: ${firstEligibleElement.href}`);
                    console.log(`Form element onclick: ${firstEligibleElement.onclick}`);
                    console.log(`Form element attributes:`, firstEligibleElement.attributes);
                }
            });
        });

        if (totalEligible === 0) {
            alert('No eligible forms found. Make sure you have "Add Drop" forms with courses starting with "NIH." and status "In Progress".');
            return;
        }

        // Show summary of what was found
        console.log(`Found ${totalEligible} eligible forms total`);
        console.log(`Attempting to open first eligible form: ${firstEligibleCourse}`);

        // Try to open the first eligible form by clicking the link
        if (firstEligibleElement) {
            try {
                console.log(`Attempting to click form link for: ${firstEligibleCourse}`);
                
                // Method 1: Try to simulate a real click event
                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: firstEligibleElement.getBoundingClientRect().left + 5,
                    clientY: firstEligibleElement.getBoundingClientRect().top + 5
                });
                
                console.log('Dispatching click event...');
                firstEligibleElement.dispatchEvent(clickEvent);
                console.log('Click event dispatched successfully');
                
                // Method 2: If click event doesn't work, try direct click
                setTimeout(() => {
                    console.log('Trying direct click as fallback...');
                    firstEligibleElement.click();
                }, 100);
                
                alert(`Found ${totalEligible} eligible forms. Clicked the first one: ${firstEligibleCourse}\n\nCheck if the form opened in a new tab or window.`);
                
            } catch (error) {
                console.error(`Error clicking form link for ${firstEligibleCourse}:`, error);
                
                // Method 3: Last resort - try to navigate to the href if it exists
                if (firstEligibleElement.href && firstEligibleElement.href !== '#' && firstEligibleElement.href !== '') {
                    console.log('Trying to navigate to href as last resort...');
                    window.location.href = firstEligibleElement.href;
                } else {
                    alert(`Error: Could not open form for ${firstEligibleCourse}. The form link may be JavaScript-based and requires manual clicking.`);
                }
            }
        }

        console.log(`Processed ${totalEligible} eligible forms, attempted to open the first one`);
    }

    // Initialize when page is ready
    function init() {
        console.log('Initializing MIT Batch Process script V2...');
        
        // Wait for the search button to appear
        waitForElement('#btnSearch', () => {
            console.log('Search button found, adding batch button...');
            // Add a small delay to ensure the page is fully loaded
            setTimeout(addBatchProcessButton, 500);
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