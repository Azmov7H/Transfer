# FE-RWD-002 — Touch Targets & Runtime Responsive Checks

## Sprint
Sprint 06

## Branch
feat/frontend-sprint-06-responsive

## Priority
P2

## Severity
MEDIUM (RWD-003/RWD-004, A11Y-004 responsive portion)

## Objective
All interactive targets meet touch minimums; sticky/fixed elements and virtual-keyboard behavior verified at runtime.

## Problem
Row-action icon buttons appear below 44px (VERIFY from static analysis); keyboard overlap on mobile forms unverified; sticky header interplay unverified.

## Evidence
09-responsive-audit.md RWD-003/004.

## Root Cause
No mobile QA pass ever formalized.

## Scope
### In Scope
- Size audit + fix of row actions/header controls (size or padding, not visual redesign).
- Documented runtime checklist results: 360/768/1280 widths, iOS+Android keyboards on invoice/customer forms.
### Out of Scope
Table pattern (FE-RWD-001).

## Affected Files
- CustomerRow.jsx, ProductRow.jsx, InvoiceListItem.jsx, Header.jsx, ui/button size variants as needed

## Implementation Steps
1. Audit target sizes; fix with min-h/min-w utilities.
2. Execute runtime checklist; file any new findings.

## Dependencies
FE-RWD-001 merged (avoid re-testing moving surfaces).

## Risks
None.

## Testing Requirements
Real-device pass (or DevTools emulation minimum) recorded in PR.

## Acceptance Criteria
- [ ] Interactive targets ≥44px effective
- [ ] Checklist results documented

## Definition of Done
Standard DoD.

## Related Findings
RWD-003 · **Related Tasks:** FE-RWD-001
