# 13 — Accessibility Audit & Plan

Baseline: a previous program already added ~78 aria-labels across 45 files, semantic table scopes, ≥44px row-action targets, Radix focus traps, and `--ring` focus tokens. This audit lists the **remaining** gaps in priority order.

## Findings → Tasks

### A1 — Text legibility (P0)
- `text-[8px]`×15, `[9px]`×28, `[10px]`×147 — below readable size; fails WCAG 1.4.4 resize expectations practically for elderly/low-vision operators.
- Fix: typography task UX-030 (12px floor). Verify no layout breakage where truncation relied on tiny text.

### A2 — Color-only meaning (P1)
- Status conveyed by hue alone in badges (paid/pending/overdue), chart series, and alert accents.
- Fix: StatusBadge includes icon + Arabic text label (UX-071); charts get legend + pattern/shape differentiation where feasible (recharts line dash arrays); alert panel severity uses icon+text.

### A3 — Contrast risks (P1)
- Hardcoded palette classes include low-contrast pairs (e.g., amber-500 on white ≈ 2.1:1; emerald-400 text on light backgrounds).
- Fix: after color sweep (05), run automated contrast check on token pairs; token values adjusted once centrally rather than per-component.

### A4 — Heading structure (P2)
- Decorated pages skip levels (gradient H1 + styled div-as-heading). PageHeader rewrite (UX-032) enforces one H1 and real h2 for sections.

### A5 — Focus visibility on decorated components (P2)
- Glass/decorated buttons sometimes override focus ring (`focus:outline-none` without replacement) — sweep with de-decoration task UX-042 to keep `focus-visible:ring` everywhere.

### A6 — Live regions / announcements (P2)
- Mutation feedback is toast-based (sonner announces politely by default) — acceptable. Inline form errors must bind `aria-describedby` + `aria-invalid` (FormKit task UX-060 builds this in).
- Async table refreshes: add `aria-live="polite"` summary ("تم تحديث النتائج") optional.

### A7 — Keyboard completeness (P2)
- Custom filter tab chips (invoices) and dashboard quick tiles are clickable `<div>`/`<Link>` mixes — ensure links are anchors (they are), chips become buttons with `aria-pressed`.
- Row-click navigation must not be the only path: first-cell link present (tables standard).

### A8 — Motion sensitivity (P3)
- Pulse/rotate decorations removed globally (UX-042); remaining transitions ≤200ms; add `motion-reduce:transition-none` via shared button/card classes.

### A9 — RTL/LTR numerals (P3)
- Mixed-direction strings (invoice #, phones) wrapped with `dir="ltr"` isolation helper (UX-034) preventing screen-reader mis-ordering as well as visual punctuation bugs.

### A10 — Dialog focus return in chained flows (P2)
- Resolved structurally by removing nesting (doc 11); verify keyboard-only script on customers/debt flows after IA-2/IA-3 land.

## Verification plan
1. Automated: eslint jsx-a11y (already configured) kept error-level; contrast script over token pairs.
2. Manual scripts: keyboard-only pass of 5 golden flows (login, invoice create+print, payment collect, product create, report view); VoiceOver/NVDA spot-check on forms and tables; 200% zoom pass on dashboard + invoices.
3. Per-phase acceptance includes the relevant checks above.

## Business Logic Preservation
None affected.

## Priority Summary
A1 P0 · A2/A3 P1 · A4–A7, A10 P2 · A8/A9 P3

## Complexity
Distributed across other tasks; standalone work limited to contrast tooling (M).
