# Sprint 04 — Core Components & UI Consistency

## Objective
Establish the shared UI toolkit later sprints compose from: one product selector, one form pattern, Radix confirmations, and standardized loading/empty/error primitives.

## Why This Sprint Exists
God-page decomposition (Sprint 05) would otherwise replicate today's inconsistencies into new files. Build the standard first.

## Scope
- Merge three product selectors into one parameterized component.
- Define + pilot RHF+zod adapter pattern on CustomerFormDialog and ProductFormDialog.
- Replace all native `alert`/`confirm` with AlertDialog-based `ConfirmDialog`.
- Apply LoadingState/ErrorState/EmptyState across shared components; define EmptyState primitive.
- Design-token pass: hardcoded colors/inline styles → tokens (worst offenders only).

## Out of Scope
Page-level decomposition (Sprint 05); remaining dialogs' migration (follows in 05); responsive behavior.

## Branch
`feat/frontend-sprint-04-ui-system`

## Findings Addressed
COMP-001, UX-001, COMP-002, FORM-001 (pilot), CLEAN-D7 resolution

## Tasks
- FE-COMP-001 — Consolidate product selector (`tasks/ux-ui/FE-COMP-001-product-selector.md`)
- FE-FORM-001 — Form pattern pilot (`tasks/ux-ui/FE-FORM-001-form-pattern.md`)
- FE-UX-001 — Confirm dialog rollout (`tasks/ux-ui/FE-UX-001-confirm-dialog.md`)
- FE-COMP-002 — State primitives (`tasks/ux-ui/FE-COMP-002-state-primitives.md`)
- FE-UX-002 — Token audit (`tasks/ux-ui/FE-UX-002-token-audit.md`)

## Dependencies
Sprint 02 (mutation/toast policy), Sprint 03 (RoleGate exists for unauthorized states).

## Implementation Order
1. FE-COMP-002 (primitives others consume)
2. FE-UX-001
3. FE-COMP-001
4. FE-FORM-001
5. FE-UX-002

## Validation
```bash
pnpm run lint && pnpm test && pnpm run build
```
Manual: stock movement, purchase order, invoice item flows still pick products correctly; every destructive action shows themed RTL dialog; customer/product forms show inline field errors and cannot double-submit.

## Acceptance Criteria
- Exactly one product selector import remains.
- Zero native alert()/confirm() calls in src.
- Pilot dialogs use the documented form adapter; pattern doc committed.

## Definition of Done
Standard DoD.

## Expected Result
A reusable, consistent component vocabulary ready for page decomposition.
