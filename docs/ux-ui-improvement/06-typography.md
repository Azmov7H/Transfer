# 06 — Typography Audit & Proposal

## Problem
1. **Weight inflation**: `font-black` ×582 + `font-bold` ×495 vs `font-semibold` ×30. When everything is heavy, nothing is emphasized; Arabic glyphs at black weight lose legibility at small sizes (diacritics collide).
2. **Arbitrary micro sizes**: 210 usages of `text-[Npx]` — `[10px]`×147, `[9px]`×28, `[8px]`×15, `[11px]`×14. Sub-11px Arabic body text is an accessibility failure and prints poorly.
3. **Title chaos**: ad-hoc page titles use text-2xl/3xl/4xl mixed plain/gradient; `PageHeader` component (text-4xl→5xl + gradient + pulsing icon) used by only ~11 pages.
4. Numbers inside RTL text (invoice #, phone, amounts) occasionally render with wrong punctuation order.

## Current Behavior
Font stack: Cairo via next/font (`--font-cairo`, fallback Tajawal) — appropriate for Arabic UI, keep.

## Proposed Type Scale

| Role | Token/class | Size/line | Weight | Usage |
|---|---|---|---|---|
| Display | — | removed | — | gradient display headers deleted |
| H1 Page title | `text-2xl` | 24/32 | bold (700) | one per page via PageHeader |
| H2 Section | `text-lg` | 18/28 | semibold (600) | card/section titles |
| H3 Sub-section | `text-base` | 16/24 | semibold | group labels inside sections |
| Body | `text-sm` | 14/22 | normal (400) | default content |
| Body strong | `text-sm font-medium` | 14/22 | 500 | row primary text |
| Label | `text-sm font-medium` | 14/20 | 500 | form labels |
| Caption / meta | `text-xs` | 12/18 | normal | timestamps, secondary meta |
| Numeric emphasis | `text-sm/tabular-nums font-semibold` | — | 600 | amounts (see below) |

Rules:
1. **Weights limited to {400, 500, 600, 700}.** `font-black/extrabold` banned from app surfaces (login marketing hero excepted).
2. **No arbitrary px sizes.** The smallest allowed size is `text-xs` (12px). All `[8–11px]` map up: 8/9px→text-xs muted; 10/11px→text-xs or text-sm by role.
3. Amounts always: Latin digits with `tabular-nums`, `dir="ltr"` wrapper for mixed strings like `#INV-1023`, suffix "ج.م" as separate muted span.
4. Buttons: `text-sm font-medium`; no bold buttons.
5. Sidebar group captions: `text-xs font-medium text-muted-foreground tracking-wide`.

## Rationale
- Cairo is designed to carry hierarchy through size + weight steps of 100; 900 flattens contrast between levels and renders heavier diacritic collisions at small optical sizes.
- A 6-role scale covers every observed usage in the audit; fewer decisions per screen.
- 12px floor aligns with WCAG readability practice and the existing touch-target work.

## Business Logic Preservation
None affected — presentation only. Arabic copy strings unchanged (except none proposed).

## Components Affected
Global: every component using font-black/bold or arbitrary sizes (~150 files). Key hotspots: `PageHeader.jsx`, `Sidebar.jsx`, dashboard cards, KPICard/StatCard, table cells, invoice print view (**print view keeps its own print-specific scale — exempt but documented**).

## Dependencies
Should land early (with color tokens) so subsequent tasks build on the scale. Tailwind config unchanged (scale uses defaults).

## Risks
- Mass weight reduction can feel "flatter" initially — mitigated by introducing spacing/hierarchy improvements in the same phase.
- Print views must be regression-checked visually after sweep.

## Acceptance Criteria
1. Grep: zero `font-black` outside allow-list; arbitrary `text-[..px]` count → 0 (allow-list: print styles if retained).
2. Every page has exactly one H1 rendered through PageHeader.
3. Visual QA pass on 10 key pages light+dark.
4. No copy string changed.

## Priority: P0 (the [8–10px] portion) / P1 (weights & scale) · Complexity: L mechanical

---

## Tasks
| ID | Task | Pri |
|---|---|---|
| UX-030 | Eliminate sub-12px arbitrary sizes (map to xs/sm) | P0 |
| UX-031 | Weight normalization sweep black/bold→500/600 per mapping | P1 |
| UX-032 | Rewrite PageHeader: single H1 style, no gradient/pulse, actions slot, breadcrumb slot | P1 |
| UX-033 | Migrate all ad-hoc page headers to PageHeader (~19 pages) | P1 |
| UX-034 | Numeric rendering helper (AmountText/IdText with tabular-nums + ltr isolation) | P2 |
| UX-035 | ESLint rules banning banned utilities w/ allow-list | P3 |
