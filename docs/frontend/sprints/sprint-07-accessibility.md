# Sprint 07 — Accessibility

## Objective
Close the practical WCAG gaps: labels, table semantics, heading order, focus visibility.

## Why This Sprint Exists
Radix provides a strong base, but hand-rolled surfaces (row actions, custom tables, print areas) exclude keyboard and screen-reader users. Landing after Sprints 05/06 avoids auditing soon-to-move markup.

## Scope
- aria-labels on every icon-only control (audit + fix).
- Table semantics: th scope, caption/aria-label where missing.
- Heading hierarchy corrections in decomposed pages.
- Focus-visible ring verification in RTL across interactive primitives.

## Out of Scope
Color-contrast redesign (tokens audit from Sprint 04 covers worst offenders); full screen-reader certification.

## Branch
`feat/frontend-sprint-07-accessibility`

## Findings Addressed
A11Y-001, A11Y-002 (residual), A11Y-003, A11Y-004

## Tasks
- FE-A11Y-001 — Icon button labeling (`tasks/accessibility/FE-A11Y-001-icon-labels.md`)
- FE-A11Y-002 — Semantics & focus pass (`tasks/accessibility/FE-A11Y-002-semantics-focus.md`)

## Dependencies
Sprints 04–06.

## Implementation Order
1. FE-A11Y-001
2. FE-A11Y-002

## Validation
```bash
pnpm run lint && pnpm test && pnpm run build
```
Manual: keyboard-only walk of invoice creation + customer CRUD; axe-core browser scan of 5 key routes with zero critical findings; tab order logical in RTL.

## Acceptance Criteria
- Zero unlabeled icon-only buttons.
- axe critical violations = 0 on audited routes.

## Definition of Done
Standard DoD + axe report attached to PR.

## Expected Result
Keyboard/screen-reader operability for all core flows.
