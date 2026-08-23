# FE-DATA-003 — Unified Mutation Toast/Error Policy

## Sprint
Sprint 02

## Branch
feat/frontend-sprint-02-data-state

## Priority
P1

## Severity
MEDIUM (DATA-003/ERR-002)

## Objective
One documented policy + helper for surfacing mutation success/error so feedback stops varying by page.

## Problem
Toasts live in hooks (useCustomers), native alert() (financial page), or console-only (invoices detail ×5, audit ×3). No shared helper; messages drift.

## Evidence
findings/medium.md DATA-003; 13-error-form-audit.md ERR-002 table.

## Root Cause
No policy decision; organic growth.

## Scope
### In Scope
- `src/lib/mutation-feedback.js` (or hook `useApiFeedback`): wraps mutateAsync → success toast (customizable Arabic msg) / error toast extracting `JammazApiError.message` with fallback.
- Migrate existing hooks to the helper (mechanical).
### Out of Scope
Replacing native alerts (FE-UX-001, needs dialog UI); form field errors (FE-FORM-001).

## Affected Files
- new lib file
- ~15 hooks with mutations (useCustomers, useFinancial, useProducts, useInvoices, …)

## Implementation Steps
1. Design helper API: `{ onSuccessMessage, onErrorMessage }` defaults consistent with current Arabic copy.
2. Migrate hooks one domain at a time (customers first as template).
3. Remove per-hook duplicated try/catch-toast blocks.

## Dependencies
FE-DATA-001/002 stable fetcher errors.

## Risks
Copy changes visible to users — keep existing message strings verbatim during migration.

## Testing Requirements
Manual: trigger success + failure on customers/products; identical toast anatomy both places.

## Acceptance Criteria
- [ ] Helper exists, documented in ADR
- [ ] Hooks no longer hand-roll toasts

## Definition of Done
Standard DoD.

## Related Findings
DATA-003 · **Related Tasks:** FE-DATA-005, FE-UX-001
