# 12 — Responsive UX Plan

## Problem
1. Transformation quality depends on whether a surface happens to use `ResponsiveTable` (4 surfaces) — everywhere else, mobile gets either horizontal scroll or cramped columns.
2. Dashboard grid works but KPI text sizes shrink via arbitrary classes rather than a defined pattern.
3. Reports pages: charts + filter rows overflow on small screens; fixed-width containers in places.
4. Dialogs on mobile: some large forms (supplier debt manager) exceed viewport height with internal scroll traps.
5. Invoice creation (POS-critical) is desktop-shaped; item rows compress poorly.

## Strategy per breakpoint
Breakpoints (Tailwind defaults): `sm 640 / md 768 / lg 1024 / xl 1280`.

| Surface | Desktop | Tablet (md) | Mobile (<md) |
|---|---|---|---|
| List tables | full table | priority columns only | ResponsiveTable card mode |
| Detail page tabs | tab bar inline | same | horizontal scrollable tabs; content stacks |
| Dashboard | 3-col grid | 2-col | single column; KPI strip horizontal-scroll |
| Invoices/new | two-pane (items left, summary right) | stacked w/ sticky summary bar | stacked; sticky bottom submit bar; item rows collapse to card w/ qty stepper |
| Forms in modal | modal | modal | **Sheet (bottom)** for forms >4 fields or >60vh |
| Filters toolbar | inline row | wrap | search full-width; filters behind "تصفية" toggle revealing sheet |
| Sidebar | collapsible rail | drawer overlay | drawer overlay (exists) |
| Print views | print CSS | — | not targeted (print from desktop/tablet) |

### Rules
1. Never "just scale down": each of the above declares its transformation once, implemented via the shared components so it applies everywhere.
2. Touch targets ≥44px already enforced on row actions — extend to all interactive elements audit-wide.
3. Sticky context bars allowed only for: invoice summary/submit, table header (desktop), detail-page tab bar.
4. Mobile dialogs → bottom sheets: implement via `DialogContent` responsive variant (Radix supports positioning classes) inside shared FormKit/overlay wrappers so no call-site changes later.

## Business Logic Preservation
None — layout/classes and container components only.

## Components Affected
`ResponsiveTable` (already card-capable), `dialog.jsx` (responsive variant), invoices/new page structure, reports toolbars, dashboard grid, FormKit (09).

## Dependencies
Tables standard (10) delivers mobile cards; FormKit (09) delivers sheet-mode forms. This doc defines the rules those tasks implement.

## Risks
Medium for invoices/new (business-critical flow) — mitigation: dedicated task with manual test script on real device sizes; keep desktop layout byte-identical where possible.

## Acceptance Criteria
1. All list surfaces render card mode at 375px without horizontal page scroll.
2. Invoice creation completable end-to-end at 375×667.
3. No dialog taller than viewport without internal scroll + visible actions.
4. Touch-target audit passes on migrated surfaces.

## Priority: P1 · Complexity: M-L

---

## Tasks
| ID | Task | Pri |
|---|---|---|
| UX-090 | Dialog→bottom-sheet responsive variant in overlay kit | P1 |
| UX-091 | Invoices/new responsive restructure + sticky submit bar | P1 |
| UX-092 | Reports toolbar + chart containers responsive pass | P2 |
| UX-093 | Dashboard responsive polish per layout spec | P2 |
| UX-094 | Filter-toolbar pattern component (wrap/toggle behavior) | P2 |
