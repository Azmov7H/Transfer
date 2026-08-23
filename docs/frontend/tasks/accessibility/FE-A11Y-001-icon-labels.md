# FE-A11Y-001 — Icon Button Labeling

## Sprint
Sprint 07

## Branch
feat/frontend-sprint-07-accessibility

## Priority
P2

## Severity
MEDIUM (A11Y-001)

## Objective
Every icon-only control has an accessible name.

## Problem
Only 5 files across src contain `aria-label` while icon-only buttons are pervasive (row delete/edit via Trash2/Pencil, header controls, notification controls, print buttons).

## Evidence
10-accessibility-audit.md A11Y-001 counts.

## Root Cause
No labeling convention.

## Scope
### In Scope
- Sweep: `grep -rn "size=\"icon\"\|variant=\"ghost\"" src` + manual scan; add Arabic aria-labels (or `sr-only` text) everywhere.
### Out of Scope
Contrast redesign; dialog internals handled by Radix.

## Affected Files
- Expect ~15–25 files (CustomerRow, ProductRow, InvoiceListItem, Header, notifications, financial tables…).

## Implementation Steps
1. Generate inventory.
2. Add labels with consistent Arabic verb nouns ("حذف", "تعديل", "طباعة"…).
3. Verify via screen-reader or accessibility tree inspection.

## Dependencies
Sprints 04–06 merged (targets stable).

## Risks
None.

## Testing Requirements
axe scan of 5 key routes — zero "button name" violations.

## Acceptance Criteria
- [ ] Zero unlabeled icon-only buttons

## Definition of Done
Standard DoD + axe report.

## Related Findings
A11Y-001 · **Related Tasks:** FE-A11Y-002
