# Registration and student body management

MIT registration workflows and student-body data tools for your course.

## Visualizing enrollment

**[Pie](https://shenshen.mit.edu/pie/)**: enrollment dashboard. Source: [github.com/shensquared/pie](https://github.com/shensquared/pie). Pie ingests registrar class-list exports and renders interactive pie charts. The userscripts below *fetch* the data; Pie *visualizes* it.

## Userscripts

Tampermonkey scripts that automate friction in the MIT registration portals:

| Script | Page | What it does |
|--------|------|--------------|
| [`classlist-download.user.js`](userscripts/classlist-download.user.js) | `student.mit.edu` | Auto-selects term + subject and triggers ClassList Download. |
| [`cross-registration-batch-consult.user.js`](userscripts/cross-registration-batch-consult.user.js) | `studentformsandpetitions.mit.edu` | Auto-fills the instructor consult form for cross-registration requests. |

**Hardcoded values**: the class-list script ships with `2026FA` and `6.3900`; edit those constants for your course before installing.

**Installing**: install [Tampermonkey](https://www.tampermonkey.net/), open the `.user.js`, accept; the automation fires on page load.

## See also

- [`../EECS/eecseduportal/`](../EECS/eecseduportal/): userscripts for faculty / TA roster management.
