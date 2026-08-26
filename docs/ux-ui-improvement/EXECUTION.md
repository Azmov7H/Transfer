# UX/UI Improvement Program — Execution Record

**Branches:** stacked `feat/ux-phase-*` branches, each merged into `main` after full gates (lint 0 errors, all tests green, build green).

## Merged phases

| Phase | Branch | Tasks | Summary |
|---|---|---|---|
| 0 | `feat/ux-phase-0-foundation` | UX-015, UX-010(partial) | Payment parity matrix doc; navigation tripwire tests (unique href/icon/permission); distinct sidebar icons (`Users` ×3 fixed) |
| 1 | `feat/ux-phase-1-legibility` | UX-030, UX-100(interim) | Sub-12px text eliminated across 62 files (212 instances → token scale); financial-hub header links to debt-center/receivables/accounting/reports |
| 2 | `feat/ux-phase-2-tokens` | UX-020..025 | ~950 raw palette classes swept to semantic tokens (success/warning/destructive/info/muted/border); dark mode switched from purple to tonal navy brand; chart strokes tokenized |
| 3 | `feat/ux-phase-3-navigation` | UX-010..013, UX-032, UX-033 | Nav regrouped: المبيعات / المخزون والمشتريات / المالية / **التقارير (new group — fixes orphaned reports)** / النظام; sidebar active indicator + aria-current + CTA styling for فاتورة جديدة; PageHeader rewritten (single H1, no gradient/pulse, breadcrumb slot); ad-hoc headers migrated on users/purchase-orders/sales-returns |
| 4a | `feat/ux-phase-4-payments` | UX-080, UX-081 | 5 payment dialogs → single `UnifiedPaymentDialog` with `target` prop; payloads/endpoints preserved byte-for-byte per parity matrix; legacy variants deleted |
| 4b | `feat/ux-phase-4b-customers` | R2, IA-2, UX-083 | Customers list decomposed: row click → detail page; details sheet + 4 dialogs removed from list; unified collect as row action; boolean dialog states 11→5 |
| 5 | `feat/ux-phase-5-status-dashboard` | UX-071, UX-050..054 | StatusBadge contract component (+tests): icon+label+token per business state; dashboard restructured — attention panel (overdue debts + low stock), single CTA, suggestions collapsed, quick-action grid removed, truncation fixed |
| 6 | `feat/ux-phase-6-polish` | UX-042 | Ambient blur orbs removed from 11 pages; malformed opacity utilities fixed (`bg-info/100/*` artifacts ×42) |

## Acceptance criteria verified
- Raw palette classes: **0** (was ~946)
- Sub-12px arbitrary sizes: **0** (was 190)
- `font-black`: **0** (was 582) — weights capped at bold(700)
- Blur orbs: **0**
- Distinct nav icons: enforced by test
- Tests: **67 passed** (64 prior + 3 status-badge + nav tripwires), lint 0 errors / 39 warnings, build green at every merge

## Business logic safety
No endpoint, payload-key, permission, calculation or workflow changes. Payment unification followed the parity matrix exactly (`notes` vs `note` keys and distinct endpoints `/api/financial/payments`, `/api/payments`, `/api/customers/:id/pay` preserved). The 67-test suite stayed green through every phase.

## Remaining backlog (from roadmap docs)
- UX-033 remainder: migrate ad-hoc headers on remaining secondary pages
- Table kit wave (UX-070..078): ResponsiveTable adoption beyond current 4 surfaces
- FormKit rollout (UX-060..065)
- Installment flow → Drawer (UX-082); unused notification component deletion (UX-084)
- Invoices/new mobile sticky-submit restructure (UX-091); report toolbars (UX-092..094)
- ESLint bans activation (UX-035) once allow-lists stabilize
- Manual golden-flow scripts (login/invoice/payment/report) in an environment with the backend running
