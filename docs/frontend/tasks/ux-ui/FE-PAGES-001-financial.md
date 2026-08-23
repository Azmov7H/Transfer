# FE-PAGES-001 — Decompose Financial Page

## Sprint
Sprint 05

## Branch
feat/frontend-sprint-05-pages-ux

## Priority
P1

## Severity
HIGH (ARCH-001)

## Objective
Split the 864-line treasury page into single-responsibility feature views + hooks with zero behavior change.

## Problem
`financial/page.jsx` mixes: period/type filter state, treasury query, transaction form, supplier payment flow, custom date range, tables, summary cards, print, and direct `api` usage (line 15).

## Evidence
File read in audit; responsibilities table in 02-architecture-audit.md ARCH-001.

## Root Cause
Organic growth.

## Scope
### In Scope
Extract to `src/components/financial/treasury/`: `TreasuryFilters`, `TransactionTable`, `AddTransactionDialog`, `SupplierPaymentDialog`, `TreasurySummaryCards`. Move data logic into `useTreasuryPage` hook consuming Sprint 02 services.
### Out of Scope
New features; visual redesign; backend changes.

## Affected Files
- `src/app/(protected)/financial/page.jsx` (slims to composition)
- new files under `src/components/financial/treasury/`
- possibly `hooks/useFinancial.js` additions

## Implementation Steps
1. Snapshot current behavior (manual notes).
2. Extract dialogs first, then tables, then filters.
3. Replace direct api call with service function.
4. Apply FE-FORM-001 pattern to extracted forms; FE-COMP-002 states.

## Dependencies
Sprints 02–04 complete. Do after FE-PAGES-002/003 pilots.

## Risks
Money flows — highest-care regression testing of add/reverse transactions.

## Testing Requirements
Full manual flow matrix: filter combos, add income/expense, supplier payment, reverse, print.

## Acceptance Criteria
- [ ] page.jsx < 150 lines, composition only
- [ ] No direct api imports
- [ ] Behavior parity documented

## Definition of Done
Standard DoD + parity notes.

## Related Findings
ARCH-001 · **Related Tasks:** FE-DATA-005, FE-FORM-001, FE-PAGES-002
