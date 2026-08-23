# FE-PAGES-005 — UI-State Completeness & URL Filters

## Sprint
Sprint 05

## Branch
feat/frontend-sprint-05-pages-ux

## Priority
P1

## Severity
MEDIUM (COMP-002 completion, STATE-003)

## Objective
Every list page renders all defined states and preserves filters across refresh.

## Problem
State coverage is inconsistent (some tables blank on empty; error handling varies); `useFilters` keeps filter state in memory only while six other pages use useSearchParams — split-brain behavior.

## Evidence
08-ux-ui-audit.md state section; STATE-003 in 05-state-management-audit.md.

## Root Cause
Two filter strategies coexisting without a decision.

## Scope
### In Scope
- Extend `useFilters` to sync search/filter/page to URL params (shareable/refresh-safe).
- Apply FE-COMP-002 primitives across ALL list pages: customers, products, invoices, stock, stock-movements, suppliers, purchase-orders, sales-returns, physical-inventory, audit, logs, receivables, reports lists.
- Produce the completed per-page state matrix as acceptance evidence.
### Out of Scope
Mobile rendering of these states (Sprint 06).

## Affected Files
- `src/hooks/useFilters.js`
- ~13 page files + their extracted views

## Implementation Steps
1. Upgrade useFilters with URL sync (replace history, not push, for typing).
2. Migrate list pages one domain per commit.
3. Fill the state matrix doc; fix gaps with primitives.

## Dependencies
FE-COMP-002 primitives; Sprint 03 RoleGate for unauthorized states.

## Risks
URL param changes could break bookmarked links using old param names — keep names compatible.

## Testing Requirements
Refresh/back/forward with active filters per page; empty-result searches show EmptyState.

## Acceptance Criteria
- [ ] Matrix complete: no blank-body or dead-end states anywhere
- [ ] Filters survive refresh on migrated pages

## Definition of Done
Standard DoD + matrix attached.

## Related Findings
COMP-002, STATE-003 · **Related Tasks:** FE-COMP-002, FE-AUTH-002
