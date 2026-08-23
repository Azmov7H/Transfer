# FE-PAGES-003 — Decompose Accounting Page

## Sprint
Sprint 05

## Branch
feat/frontend-sprint-05-pages-ux

## Priority
P2

## Severity
HIGH (ARCH-001)

## Objective
Split the 680-line accounting page into section components with unified data hooks.

## Problem
`accounting/page.jsx` renders multiple accounting sections (summary, entries, exports) with inline fetching logic in one client file.

## Evidence
Line count; ARCH-001 table.

## Root Cause
Section accumulation without extraction.

## Scope
### In Scope
Extract sections to `src/components/accounting/`; centralize data via services/hooks; states via primitives.
### Out of Scope
Accounting calculations (backend-owned); export mechanics beyond FE-PERF-001 scope.

## Affected Files
- `(protected)/accounting/page.jsx`
- new `src/components/accounting/**`

## Implementation Steps
1. Map sections → components.
2. Extract sequentially, verifying each section's data parity.
3. Replace any inline api calls with services.

## Dependencies
Sprints 02–04; after FE-PAGES-002 pilot learnings.

## Risks
Low-medium; numeric display parity must be checked (formatCurrency duplication UX-002 may surface here — consolidate to utils while touching).

## Testing Requirements
Numeric spot-checks against pre-refactor build for each section.

## Acceptance Criteria
- [ ] Composition-only page; section files isolated

## Definition of Done
Standard DoD + numeric parity notes.

## Related Findings
ARCH-001, UX-002 · **Related Tasks:** FE-DATA-005
