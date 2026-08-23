# FE-SEC-002 — Print Without innerHTML

## Sprint
Sprint 03

## Branch
feat/frontend-sprint-03-auth-security

## Priority
P2

## Severity
MEDIUM (SEC-002)

## Objective
Partner transaction printing uses print CSS, not DOM destruction.

## Problem
`PartnerTransactionDialog.jsx:39-43`: saves `document.body.innerHTML`, replaces body with `#print-area` HTML, prints, restores, then `window.location.reload()` to recover React. Destroys the tree, all client state, and renders unsanitized markup.

## Evidence
Code cited; other pages already use bare `window.print()` + (presumably) print styles.

## Root Cause
Print implemented without knowledge of `@media print` technique.

## Scope
### In Scope
- Add a print stylesheet region hiding `body > *:not(#print-area)` and showing `#print-area`, matching the pattern used by receipts/purchase-orders/invoices print flows.
- Remove innerHTML swap + reload entirely.
### Out of Scope
Unified print-layout redesign across pages.

## Affected Files
- `src/components/financial/PartnerTransactionDialog.jsx`
- possibly `globals.css`

## Implementation Steps
1. Implement media-print rules scoped to the dialog's print area.
2. Trigger plain `window.print()`.
3. Verify state survives printing (dialog still open, no reload).

## Dependencies
None beyond Sprint 02 merge.

## Risks
Low.

## Testing Requirements
Manual: print preview correct; page state intact after cancel/print.

## Acceptance Criteria
- [ ] No document.body.innerHTML writes anywhere in src

## Definition of Done
Standard DoD.

## Related Findings
SEC-002 · **Related Tasks:** none
