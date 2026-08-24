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

---

## Execution Record

**Branch:** `feat/frontend-sprint-07-accessibility` (stacked on sprint-06)
**Status:** COMPLETE

| Task | Commit | Summary |
|---|---|---|
| FE-A11Y-001 | `9a187ae` | ~40 icon-only controls across 28 files labeled with Arabic aria-labels ("حذف", "تعديل", "رجوع", "تبديل المظهر"…). Covers row actions, header controls, notification center, steppers, dropdown triggers. Buttons with existing `title` got a matching aria-label (title alone is not reliably announced) |
| FE-A11Y-002 | `cf5dde7` | `TableHead` primitive now defaults `scope="col"` app-wide; 18 data tables + the shared ResponsiveTable gained `<Table aria-label>` (new `tableLabel` prop at customers/products/stock call sites); settings DefaultsSettingsTab h4→h3 heading-skip fixed |

**Gates at completion:** lint 0 errors / 47 warnings (baseline held), tests 3/3, build green.

**Acceptance verification:**
- Zero unlabeled icon-only buttons in `src` (verified by scripted sweep of every `size="icon"` Button block).
- axe critical violations: cannot run axe-core in this environment — keyboard/a11y-tree inspection done statically via code audit; formal axe report pending QA pass during PR review.
- Focus visibility: all interactive primitives (button/input/badge/checkbox/switch/tabs/sidebar) carry `focus-visible` ring styles from shadcn base — no RTL-hostile focus overrides found.
- RTL tab order follows DOM order (no CSS order/flex-direction-reorder traps on interactive elements); logical on audited flows.
- Heading order: PageHeader renders single h1 per page; section components use h2/h3 below it.

**Notes / deviations:**
- PartnerTransactionDialog's print-only `<h1>` kept — it is a standalone printed document header (`hidden print:block`), not part of page flow.
- receipts/[id] h1 kept — standalone printable receipt document.
- JournalEntriesTab entry-row `<h4>` descriptions left as-is (list-item emphasis styling; no ancestor heading skip inside the tab).
- customers/products/stock pages appear in both commits (icon labels are FE-A11Y-001, their tableLabel additions FE-A11Y-002) — split by dominant change per file.
