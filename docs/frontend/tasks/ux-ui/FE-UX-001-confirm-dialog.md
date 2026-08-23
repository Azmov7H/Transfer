# FE-UX-001 — Confirm Dialog Rollout

## Sprint
Sprint 04

## Branch
feat/frontend-sprint-04-ui-system

## Priority
P1

## Severity
MEDIUM (UX-001, A11Y-002)

## Objective
All destructive/irreversible confirmations use a themed RTL AlertDialog; zero native alert()/confirm() remain.

## Problem
10 native dialog sites (financial ×3, users, suppliers, purchase-orders, products, customers, invoices/[id], InvoiceListItem) — unstyled in Arabic UI, main-thread blocking, no focus management — while `@radix-ui/react-alert-dialog` is installed and unused.

## Evidence
08-ux-ui-audit.md UX-001 table with file:line list.

## Root Cause
AlertDialog never wired; confirm() was the fastest path.

## Scope
### In Scope
- `ConfirmDialog` wrapper: trigger + title + Arabic body + destructive action styling.
- Migrate all 10 sites; fold `alert()` error cases into toasts per FE-DATA-003.
### Out of Scope
Non-destructive informational modals redesign.

## Affected Files
- new `src/components/ui/confirm-dialog.jsx`
- the 10 files listed above

## Implementation Steps
1. Build ConfirmDialog on Radix AlertDialog (focus trap free).
2. Migrate sites one page per commit.
3. Grep-verify `\balert\(|\bconfirm\(` = 0.

## Dependencies
FE-DATA-003 (toast policy for the alert() cases).

## Risks
Low.

## Testing Requirements
Keyboard-only: Tab/Enter/Esc behave; screen reader announces dialog role (manual).

## Acceptance Criteria
- [ ] Zero native dialogs
- [ ] Destructive actions visually distinct

## Definition of Done
Standard DoD.

## Related Findings
UX-001 · **Related Tasks:** FE-DATA-003, FE-COMP-002
