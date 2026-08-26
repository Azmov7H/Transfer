# 00 — Overview: Jammaz-System UX/UI Improvement Program

## Status
**PLANNING ONLY.** No source code has been modified in this phase. Every document in this folder is a plan. Implementation starts only after explicit authorization.

## Program Goal
Transform the frontend from a decorated, high-density, inconsistent interface into a simple, understandable, consistent, predictable, professional, accessible, RTL-first business system — **without changing any business logic**.

## Scope of Inspection (completed)
- 35 route pages across `(public)`, `(protected)`, `(admin)`, `(finance)`, `(operations)` groups; 17 layouts.
- Navigation config (`src/config/navigation.js`), Sidebar, Header, notification surfaces.
- UI kit (`src/components/ui/`, 36 files) + feature components (~120 files across 15 feature dirs).
- Design tokens (`globals.css`, `tailwind.config.js`), typography, spacing patterns.
- Forms, tables, dialogs/drawers, dashboards, reports, responsive & accessibility state.

## Headline Findings (evidence-based)
| # | Finding | Evidence | Severity |
|---|---|---|---|
| F1 | Payment flows fragmented across 5 overlapping dialogs | `PaymentDialog`, `UnifiedPaymentDialog`, `InvoicePaymentDialog`, `InstallmentDialog`, `AddTransactionDialog` — customers page imports 4 of them | P0 |
| F2 | Customers page is a dialog hub: 11 boolean open-states, 6 dialogs, 3 entity domains on one screen | `src/app/(protected)/customers/page.jsx:60-71` | P0 |
| F3 | Orphaned / hard-to-reach pages not present in sidebar nav | `/accounting`, `/daily-sales`, `/analytics/stock`, `/reports/*` (5 pages), `(finance)/receivables` absent from `navigation.js` | P0 |
| F4 | Illegible micro-typography | `text-[8px]` ×15, `text-[9px]` ×28, `text-[10px]` ×147 | P0 |
| F5 | Semantic color tokens massively bypassed by hardcoded palette classes | ~1,100 occurrences (emerald ×260+, amber ×220+, rose/red/blue/slate…) | P1 |
| F6 | No typographic hierarchy — everything is bold/heavy | `font-black` ×582 + `font-bold` ×495 vs `font-semibold` ×30 | P1 |
| F7 | Page header chaos | `PageHeader.jsx` exists but used by only ~11 pages; ad-hoc headers use text-2xl/3xl/4xl with mixed gradient/plain styles | P1 |
| F8 | Table implementations divergent | `ResponsiveTable` used on only 4 surfaces; 15+ hand-rolled `<table>` variants with different action/filter/pagination patterns | P1 |
| F9 | Forms hand-rolled; no shared form layout | Only 2 usages of `useForm`+zodResolver; every other form is ad-hoc useState + manual error JSX | P1 |
| F10 | Decoration over information | gradients/glass/backdrop-blur ×142; rotating icons, pulse effects, "Enterprise Suite" chrome | P2 |
| F11 | Dark mode breaks brand continuity | Light primary = navy `221 68% 28%`; dark primary = purple `263 70% 50%` | P2 |
| F12 | Duplicate/dead notification components | 7 components; `NotificationPopover`, `NotificationSidebar` have 0 importers | P2 |
| F13 | Icon reuse destroys wayfinding | `Users` icon for العملاء، الموردين، المستخدمين | P3 |

## Document Map
```
01-current-state-audit.md    Full inventory + per-area audit
02-user-journeys.md          Workflow maps + confusion points
03-information-architecture.md  Proposed grouping/tabs/drawers
04-navigation.md             Sidebar/header redesign plan
05-color-system.md           Semantic token system proposal
06-typography.md             Type scale for Arabic RTL
07-spacing-and-density.md    Spacing scale + density tiers
08-dashboard-ux.md           Dashboard hierarchy plan
09-forms-ux.md               Form pattern standard
10-tables-ux.md              Table pattern standard
11-modals-and-drawers.md     Overlay usage decision matrix
12-responsive-ux.md          Breakpoint transformation rules
13-accessibility.md          WCAG gap list + fixes
14-design-system.md          Component taxonomy
15-component-refactor-plan.md  Consolidation targets (task-level)
16-page-by-page-plan.md      Per-page plans
17-priority-matrix.md        All tasks ranked
18-business-logic-safety.md  Safety matrix + REQUIRES BUSINESS DECISION log
19-implementation-roadmap.md Phased execution plan
```

## Task ID Convention
`UX-NNN` — sequential, globally unique across all documents. Each task carries Problem / Current Behavior / User Impact / Proposed UX/UI / Business Logic Preservation / Files Affected / Dependencies / Risks / Acceptance Criteria / Priority / Complexity.

## Hard Rules (restated)
1. No API contract, permission, calculation, validation-semantics or workflow change without a documented `REQUIRES BUSINESS DECISION`.
2. Arabic copy is preserved verbatim unless a task explicitly proposes terminology changes (which then require review).
3. Every implementation phase must keep lint/tests/build green and preserve existing behavior parity.
