# FE-COMP-002 — Standardized Loading / Empty / Error Primitives

## Sprint
Sprint 04

## Branch
feat/frontend-sprint-04-ui-system

## Priority
P1

## Severity
MEDIUM (COMP-002)

## Objective
One vocabulary for the four content states every surface needs: loading, empty, error(+retry), unauthorized.

## Problem
`common/LoadingState.jsx`, `common/ErrorState.jsx`, `ui/skeleton.jsx` exist but adoption is inconsistent; several tables render blank bodies with no empty state; unauthorized states don't exist pre-Sprint 03.

## Evidence
04-component-audit.md COMP-006; 08-ux-ui-audit.md state coverage section.

## Root Cause
No enforced primitives.

## Scope
### In Scope
- Finalize API of LoadingState/ErrorState (+ Arabic copy, retry action wiring).
- New `EmptyState` primitive (icon, title, hint, optional CTA).
- Apply to shared components touched by this sprint (tables inside dialogs, selector lists).
### Out of Scope
Page-by-page application matrix (FE-PAGES-005).

## Affected Files
- `src/components/common/*` (extend), new EmptyState
- shared components: LowStockTable, DebtorTable/DebtTable, selector lists

## Implementation Steps
1. Define props APIs and document in ADR.
2. Implement EmptyState.
3. Migrate in-scope consumers.

## Dependencies
FE-AUTH-002 (unauthorized state shape) — same sprint, order accordingly.

## Risks
None.

## Testing Requirements
Storybook-free manual matrix; Sprint 09 snapshot optional.

## Acceptance Criteria
- [ ] Four primitives exist with documented APIs
- [ ] In-scope components use them exclusively

## Definition of Done
Standard DoD.

## Related Findings
COMP-002 · **Related Tasks:** FE-PAGES-005, FE-AUTH-002
