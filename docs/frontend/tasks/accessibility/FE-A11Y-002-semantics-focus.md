# FE-A11Y-002 — Table Semantics & Focus Pass

## Sprint
Sprint 07

## Branch
feat/frontend-sprint-07-accessibility

## Priority
P2

## Severity
MEDIUM (A11Y-003/A11Y-004)

## Objective
Correct table semantics and verified focus visibility/order across key flows.

## Problem
`ui/table.jsx` renders plain `th` without explicit scope; tables lack captions/aria context where title isn't adjacent (VERIFY per page); focus-visible rings and RTL tab order unverified at runtime.

## Evidence
10-accessibility-audit.md A11Y-003/004.

## Root Cause
Primitive defaults never audited.

## Scope
### In Scope
- Add `scope="col"` in table primitives; add aria-label/caption on data tables lacking adjacent titles.
- Keyboard-only walk: login → dashboard → invoice create → customer CRUD; document and fix tab-order/focus-ring defects.
### Out of Scope
Full WCAG certification.

## Affected Files
- `src/components/ui/table.jsx`
- affected page/view files from the walk

## Implementation Steps
1. Update table primitive.
2. Runtime keyboard audit; fix findings.
3. axe re-scan.

## Dependencies
FE-A11Y-001.

## Risks
None beyond visual tweaks.

## Testing Requirements
Keyboard-only session recorded; axe report attached.

## Acceptance Criteria
- [ ] th scope present app-wide via primitive
- [ ] Logical RTL tab order on audited flows

## Definition of Done
Standard DoD + reports.

## Related Findings
A11Y-003, A11Y-004 · **Related Tasks:** FE-A11Y-001, FE-RWD-002
