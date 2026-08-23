# FE-PAGES-004 — Decompose Detail Pages & Unsaved-Change Guards

## Sprint
Sprint 05

## Branch
feat/frontend-sprint-05-pages-ux

## Priority
P1

## Severity
HIGH (ARCH-001) + MEDIUM (FORM-002)

## Objective
Decompose the two large detail pages and protect users from losing unsaved work.

## Problem
`physical-inventory/[id]/page.jsx` (634) and `invoices/[id]/page.jsx` (622) mix fetch, editable line items, payments, delete, print. No unsaved-changes guard exists anywhere (notably `invoices/new`).

## Evidence
ARCH-001 table; FORM-002 finding.

## Root Cause
Detail flows grown in place; guards never specified.

## Scope
### In Scope
- Extract per-domain views: invoice header/items/payments/print sections; inventory items/reconciliation.
- Add unsaved-changes guard to `invoices/new` and any extracted editor with dirty state (router event or beforeunload).
### Out of Scope
invoices/new full decomposition beyond the guard (already componentized via InvoiceItemsManager).

## Affected Files
- both detail page.jsx files
- new view components under respective feature dirs
- `(protected)/invoices/new/page.jsx` (guard)

## Implementation Steps
1. Decompose physical-inventory detail (lower risk first).
2. Decompose invoice detail — preserve print + delete semantics (delete uses ConfirmDialog post FE-UX-001).
3. Implement dirty-state guard hook (`useUnsavedGuard`) + apply.

## Dependencies
FE-UX-001, FE-COMP-001 (selector inside items), Sprints 02–03.

## Risks
Invoice deletion/return logic touches stock — regression-test quantity restoration.

## Testing Requirements
Full payment add/delete, print, delete-with-stock-return walks; guard triggers on navigation with dirty form only.

## Acceptance Criteria
- [ ] Both pages composition-only
- [ ] Guards active on editors

## Definition of Done
Standard DoD + flow matrix notes.

## Related Findings
ARCH-001, FORM-002 · **Related Tasks:** FE-UX-001, FE-COMP-001
