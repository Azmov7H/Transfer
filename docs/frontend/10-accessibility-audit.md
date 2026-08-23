# 10 — Accessibility Audit

Baseline: Radix primitives (dialog, select, dropdown, tabs…) provide strong intrinsic a11y **where used**. The gaps are in hand-rolled surfaces.

## Findings

### A11Y-001 — Icon-Only Buttons Lack Labels (MEDIUM)
Only 5 files in all of `src/components` + `src/app` contain `aria-label` (spinner, sidebar, pagination ×3, NotificationBell, themes/Toggle). Meanwhile icon-only actions are pervasive: row delete/edit (`Trash2`, `Pencil` in CustomerRow/ProductRow/InvoiceListItem), header buttons, notification controls. Screen readers announce unlabeled buttons. Remediation FE-A11Y-001.

### A11Y-002 — Native Dialogs Break Screen-Reader Flow (MEDIUM)
`alert()`/`confirm()` (10 sites, see UX-001) steal focus without ARIA dialog semantics and are announced inconsistently across screen readers. Replaced as part of FE-UX-001 with Radix AlertDialog (correct role/focus trap for free).

### A11Y-003 — Table Semantics Incomplete (MEDIUM, VERIFY)
`ui/table.jsx` provides proper `<Table>` semantics; VERIFY per-page usage includes `TableHeader` scope behavior (Radix/shadcn tables render plain `th` without explicit `scope`) and that no table skips caption/aria-describedby where title context isn't adjacent. FE-A11Y-002.

### A11Y-004 — RTL + Focus Visibility (LOW, VERIFY)
`dir="rtl"` is set globally; verify focus-visible rings (`focus-visible:` utilities) survive Tailwind config and that logical-property utilities weren't hardcoded to LTR margins anywhere (spot-check found none; runtime pass needed). FE-RWD-002 / FE-A11Y-002.

### Cleared
- Form inputs use shadcn `Input`+`Label` pairs (htmlFor wiring via Radix Label) on inspected forms.
- Heading hierarchy spot-check on dashboard/customers shows h1→h2 ordering ✅.
- `lang="ar"` correct; date-fns `ar` locale consistent with content language.
