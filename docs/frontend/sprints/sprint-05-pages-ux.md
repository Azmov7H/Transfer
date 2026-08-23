# Sprint 05 — Pages & Feature UX

## Objective
Decompose the five god pages into feature views + hooks, complete UI-state coverage per page, and standardize filter state.

## Why This Sprint Exists
The largest maintainability and UX-correctness wins live here; with Sprints 02–04 tooling ready, extraction is mechanical rather than risky.

## Scope
- financial, settings, accounting, physical-inventory/[id], invoices/[id] decompositions.
- Per-page state matrix (initial/loading/success/empty/error/unauthorized) completed for all list pages.
- URL-backed filters for list pages via extended useFilters.
- Unsaved-changes guard on invoice creation.

## Out of Scope
New features; visual redesign; backend changes.

## Branch
`feat/frontend-sprint-05-pages-ux`

## Findings Addressed
ARCH-001, COMP-003, FORM-001 (rollout), FORM-002, STATE-003, UX-002, COMP-002 completion

## Tasks
- FE-PAGES-001 — Decompose financial page (`tasks/ux-ui/FE-PAGES-001-financial.md`)
- FE-PAGES-002 — Decompose settings page (`tasks/ux-ui/FE-PAGES-002-settings.md`)
- FE-PAGES-003 — Decompose accounting page (`tasks/ux-ui/FE-PAGES-003-accounting.md`)
- FE-PAGES-004 — Decompose detail pages + guards (`tasks/ux-ui/FE-PAGES-004-detail-pages.md`)
- FE-PAGES-005 — UI-state completeness + URL filters (`tasks/ux-ui/FE-PAGES-005-ui-states.md`)

## Dependencies
Sprints 02, 03, 04 — strictly. Do not start extraction before primitives exist.

## Implementation Order
1. FE-PAGES-002 (lowest traffic — safest pilot)
2. FE-PAGES-003
3. FE-PAGES-001
4. FE-PAGES-004
5. FE-PAGES-005

## Validation
```bash
pnpm run lint && pnpm test && pnpm run build
```
Manual: full regression walk of each decomposed flow (create/edit/delete/print per entity); refresh-with-filter preserves state on migrated list pages; leaving half-filled new-invoice prompts confirmation.

## Acceptance Criteria
- No page file >300 lines; each extracted view/hook has a single responsibility.
- Every list page renders defined empty/error/unauthorized states.
- Behavior parity confirmed against pre-refactor build for all five pages.

## Definition of Done
Standard DoD + side-by-side manual regression notes in PR.

## Expected Result
Feature code is reviewable in isolation; state coverage gaps closed.
