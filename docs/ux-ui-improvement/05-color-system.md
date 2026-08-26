# 05 — Color System Audit & Proposal

## Problem
1. **~1,100 hardcoded palette utilities** (emerald/amber/rose/red/blue/slate/purple/green/indigo/orange/pink) bypass the semantic token layer → theming, dark mode and consistency are impossible to maintain; identical meanings wear different colors per feature.
2. **Dark mode brand discontinuity**: light primary = navy `hsl(221 68% 28%)`, dark primary = purple `hsl(263 70% 50%)`; secondary flips amber→blue. The app looks like two different products.
3. Decorative gradients ×142 compete with semantic color for attention.
4. Status colors not standardized: success contexts use emerald *and* green *and* blue; warnings amber *and* yellow *and* orange.

## Current Behavior
Tokens exist in `globals.css` (light+dark, incl. `--success/--warning/--info`) and are correctly mapped in `tailwind.config.js`. Components simply don't use them.

## Proposed Semantic Color System

Rationale: keep the existing navy as the brand anchor (it is professional, high-contrast on white, culturally neutral); make dark mode a tonal variant of the same hue, not a new brand. Status hues map to the already-defined tokens.

| Token | Light | Dark | Usage rules |
|---|---|---|---|
| `primary` | navy 221 68% 28% (keep) | same hue, raised lightness `221 60% 62%` | brand actions: primary buttons, active nav, links |
| `secondary` | warm gold 41 85% 55% (keep) | desaturated `41 50% 55%` | secondary emphasis only — never status |
| `background / card / muted` | keep | keep | surfaces |
| `foreground / muted-foreground` | keep | keep | text |
| `success` | green 142 76% 36% | keep | paid, completed, profit, in-stock-ok |
| `warning` | amber 38 92% 50% | keep | pending, low stock, due-soon |
| `destructive` | red 0 84% 55% | keep | destructive action, overdue, unpaid, loss |
| `info` | sky 199 89% 48% | keep | informational badges, neutral charts series |
| `border / input / ring` | keep | keep | |

### Meaning contract (enforced via Badge/StatusBadge component)
| Business state | Token |
|---|---|
| مدفوع / مكتمل / ربح / متوفر | success |
| جزئي / قيد الانتظار / منخفض | warning |
| غير مدفوع / متأخر / خسارة / حذف | destructive |
| معلومات / محايد | info or muted |
| أفعال العلامة (حفظ، إنشاء) | primary |

### Migration rules
1. Replace `emerald-*`/`green-*` → `success` (+`-foreground` where needed).
2. Replace `amber-*`/`yellow-*`/`orange-*` → `warning`.
3. Replace `rose-*`/`red-*` (status sense) → `destructive`; rose used decoratively → primary/muted.
4. Replace `blue-*`, `indigo-*`, `purple-*`, `sky-*` → `info` or `primary` by meaning.
5. Replace `slate-*`/`gray-*` text/borders → `foreground`/`muted-foreground`/`border`.
6. Gradients: delete decorative page-header gradient text (`text-gradient-primary`) and background blur orbs; retain at most one brand gradient for login hero and KPI accent strip (optional), implemented via the existing CSS vars.

## Design rationale
- One hue family + 4 status hues ≈ the cognitive maximum for an operational tool; every additional simultaneous hue measurably slows scanning of dense tables.
- Tonal dark mode preserves muscle memory and print/screenshot brand consistency.
- Tokens already exist — this is an adoption + governance plan, not new infrastructure. Enforcement happens through a codemod-style sweep plus lint rule (no raw palette classes in `src/**` except `globals.css` and chart palettes).

## Business Logic Preservation
Pure presentation; zero logic impact. Chart series colors may reuse multiple hues but must come from a defined chart palette constant (documented in design-system doc).

## Components Affected
All feature components (~120 files); `KPICard`, `StatCard`, `Badge`, tables, dialogs, dashboard cards, `PageHeader`.

## Files Likely Affected
Sweep across `src/components/**` and `src/app/**`; token edits in `src/app/globals.css`.

## Dependencies
None (tokens exist). Should precede all visual tasks.

## Risks
- Mechanical replacement can produce contrast regressions in dark mode → mitigation: contrast check pass (doc 13) after each phase batch.
- Charts need ≥3 distinguishable series colors → dedicated `chartPalette` constant.

## Acceptance Criteria
1. Grep for raw palette classes outside allow-list returns ≤ small documented set.
2. Light/dark screenshots of 10 key pages reviewed for brand continuity.
3. All status badges render from the single StatusBadge mapping.
4. Contrast AA verified for text/background pairs changed.

## Priority: P1 · Complexity: L (many files, mechanical)

---

## Tasks
| ID | Task | Pri |
|---|---|---|
| UX-020 | Fix dark-mode tokens to tonal-navy scheme | P2 |
| UX-021 | Define chartPalette + apply to recharts surfaces | P2 |
| UX-022 | Color sweep: emerald/green → success | P1 |
| UX-023 | Color sweep: amber/yellow/orange → warning | P1 |
| UX-024 | Color sweep: rose/red → destructive; blue/indigo/purple → info/primary | P1 |
| UX-025 | Color sweep: slate/gray → foreground/muted/border | P1 |
| UX-026 | Remove decorative gradients/orbs; keep allow-listed two | P2 |
| UX-027 | Add ESLint restriction (no unreferenced palette classes) with allow-list | P3 |
