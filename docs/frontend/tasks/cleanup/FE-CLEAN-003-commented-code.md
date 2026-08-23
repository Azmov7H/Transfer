# FE-CLEAN-003 — Commented-Out Code Removal

## Sprint
Sprint 10

## Branch
feat/frontend-sprint-10-cleanup

## Priority
P3

## Severity
LOW (CLEAN-002)

## Objective
Remove dead commented code; keep legitimate documentation comments.

## Problem
Three real disabled-code sites:
- `context/NotificationContext.jsx:56` — disabled action API call
- `lib/api-utils.js:103-108` — superseded by FE-AUTH-001 implementation
- `components/invoices/InvoiceCustomerSelect.jsx:36`

## Evidence
17-code-quality-audit.md; security scan item 8.

## Root Cause
Feature-flag-by-comment habits.

## Scope
### In Scope
Delete the three blocks (api-utils one is replaced by Sprint 03 work).
### Out of Scope
Header/section comments; JSDoc.

## Affected Files
The three files above (verify api-utils state post-Sprint 03).

## Implementation Steps
1. Confirm each block still dead after earlier sprints.
2. Delete.

## Dependencies
FE-AUTH-001 merged.

## Risks
None.

## Testing Requirements
Gates green.

## Acceptance Criteria
- [ ] No disabled-code comments remain in src

## Definition of Done
Standard DoD.

## Related Findings
CLEAN-002 · **Related Tasks:** FE-AUTH-001
