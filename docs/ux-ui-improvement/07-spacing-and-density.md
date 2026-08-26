# 07 — Spacing & Visual Density

## Problem
1. No shared spacing rhythm: page paddings vary (`p-4`…`p-8`, `space-y-4/6/8` chosen ad hoc per file); card internals mix `gap-2..6`.
2. **Density extremes**: dashboard/reports are airy with large decorative blocks, while tables/dialogs cram 8–12px text with tight rows — the two ends both hurt scanning.
3. Decoration adds visual noise: blur orbs, layered shadows (`shadow-2xl`), ring-on-ring avatars, hover rotate/pulse animations ×142 decorative utilities.
4. Dialog footers/forms spacing inconsistent (some `gap-2`, some stacked full-width buttons).

## Current Behavior
Tailwind default scale available; no custom spacing tokens; radius token `--radius: 0.75rem` exists but components also use rounded-xl/2xl/3xl freely.

## Proposed Spacing Scale

Layout container and section rhythm:
| Context | Rule |
|---|---|
| Page horizontal padding | `px-4 md:px-6 lg:px-8` (single pattern) |
| Vertical page rhythm | `space-y-6` between major sections |
| Card padding | `p-4 md:p-5` |
| Card grid gaps | `gap-4 md:gap-6` |
| Table cell padding | `px-3 py-2.5` standard; `py-1.5` only in "compact" table mode |
| Form vertical gap | `space-y-4`; section groups separated by `Separator` + `space-y-6` |
| Dialog body | `space-y-4 p-5`; footer `gap-2 pt-0` |
| Sidebar item height | keep 44px (touch target) |

Radius governance: `rounded-lg` default for controls/cards (via `--radius`); `rounded-full` only pills/avatars/icon buttons; ban `rounded-3xl` in app surfaces.

Density tiers:
| Tier | Where | Cell padding | Text |
|---|---|---|---|
| Comfortable | dashboards, detail pages | py-2.5 | sm |
| Standard (default) | most tables/lists | py-2.5→2 | sm |
| Compact | audit/logs, long ledgers | py-1.5 | xs |

## De-decoration rules
- Remove background blur orbs and layered glass on app surfaces (allow-list: login hero).
- Shadows limited to: overlays (dialog/sheet/popover) and sticky headers. Cards use border only.
- Motion: remove hover-rotate/pulse decorations; keep functional transitions ≤200ms; respect `prefers-reduced-motion`.

## Business Logic Preservation
None affected.

## Components Affected
Global sweep; heaviest: dashboard cards, financial tables, dialogs in `financial/`, `PageHeader` (mb-8 → rhythm class).

## Dependencies
Lands together with typography/color phase (one visual-consistency batch per feature to avoid double-touching files).

## Risks
Low. Pure className changes; visual regression risk mitigated by per-feature batches + screenshots.

## Acceptance Criteria
1. Page paddings conform to the container rule across all `(protected)` pages.
2. Decorative utility count (blur/orb/rotate/pulse) reduced to allow-list.
3. Radius audit: no rounded-3xl outside allow-list.
4. Visual QA light+dark on 10 key pages.

## Priority: P2 · Complexity: M

---

## Tasks
| ID | Task | Pri |
|---|---|---|
| UX-040 | Define layout primitives (PageShell w/ container+section classes) and adopt on top-level pages | P2 |
| UX-041 | Card/table density normalization per tier mapping | P2 |
| UX-042 | De-decoration sweep (orbs/glass/shadows/motion) with allow-list | P2 |
| UX-045 | Radius governance sweep | P3 |
