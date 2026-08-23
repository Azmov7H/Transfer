# Sprint 06 — Responsive Experience

## Objective
Give mobile operators a usable data experience: mobile strategy for wide tables and verified touch targets.

## Why This Sprint Exists
This is an operational warehouse/POS-adjacent tool; phone usage is a first-class scenario, currently served by horizontal-scrolling tables only.

## Scope
- Mobile card/list fallback for the highest-traffic tables (customers, products, invoices list, stock).
- Touch-target sizing pass on row actions.
- Runtime verification of sticky elements + virtual keyboard on invoice form.

## Out of Scope
Desktop layout changes; new breakpoints; tablet-specific design beyond verification.

## Branch
`feat/frontend-sprint-06-responsive`

## Findings Addressed
RWD-001, RWD-003, RWD-004, A11Y-004 (responsive portion)

## Tasks
- FE-RWD-001 — Mobile table pattern (`tasks/responsive/FE-RWD-001-mobile-tables.md`)
- FE-RWD-002 — Touch targets & runtime checks (`tasks/responsive/FE-RWD-002-touch-targets.md`)

## Dependencies
Sprint 05 (tables live in extracted views by then; avoids double work).

## Implementation Order
1. FE-RWD-001
2. FE-RWD-002

## Validation
```bash
pnpm run lint && pnpm test && pnpm run build
```
Manual: 360px viewport walk of all list pages (no horizontal page scroll; tables either stack or scroll within their container); all row actions ≥44px; invoice form usable with keyboard open.

## Acceptance Criteria
- No full-page horizontal scrolling at 360px on any protected route.
- Mobile fallback implemented via one shared component, not per-page copies.

## Definition of Done
Standard DoD + screenshots at 360/768/1280 widths in PR.

## Expected Result
Mobile parity for read + core write flows.
