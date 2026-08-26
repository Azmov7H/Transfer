# 15 — Component Refactor Plan

Concrete consolidation work, ordered by user impact. Each task is independently shippable. "Delete" steps only after parity sign-off (doc 11 rules).

## R1 — Payment dialogs → UnifiedPaymentDialog v2 (P0)
- **From:** PaymentDialog, InvoicePaymentDialog, InstallmentDialog(pay-mode), UnifiedPaymentDialog v1, AddTransactionDialog(overlap part).
- **To:** one `UnifiedPaymentDialog` with target-context prop; AddTransactionDialog remains for pure treasury entries but reuses FormKit visuals.
- Parity matrix first: fields × validation × endpoint × success behavior per current variant.
- Files: `components/financial/*`, entry points in customers page/detail, debt-center ×2, financial page.

## R2 — Customer surfaces consolidation (P0)
- Customers list page sheds details/history/payment-kind dialogs; detail page (`CustomerClient`) becomes tabbed container (IA-2). Removes ~11 boolean states; state machine replaced by route/tab + single dialog state.

## R3 — Notification components cleanup (P3)
- Keep: NotificationBell, LazyNotificationCenter (drawer content), NotificationItem/List internals. Delete: NotificationPopover, NotificationSidebar, SmartNotificationCenter (merge any used logic into Lazy variant). Verify Header trigger wiring unchanged.

## R4 — StatCard/KPICard merge (P2)
- One `KPIStat` component (title, value via AmountText, icon, optional delta/hint). Update dashboard + financial TreasuryStatsCards + any reports stat rows.

## R5 — Table kit adoption wave (P1) — per doc 10 tasks UX-070..078
- Canonical order: invoices → customers → financial trio → products/suppliers/PO → admin → inventory ops.

## R6 — PageHeader migration (P1) — UX-033
- All `(protected)` pages adopt rewritten PageHeader; delete ad-hoc header JSX blocks.

## R7 — FormKit rollout (P1/P2) — per doc 09 tasks UX-060..065

## R8 — Content-state completeness sweep (P2)
- Replace bespoke skeletons/spinners on reports + settings + audit pages with LoadingState/ErrorState/EmptyState primitives (already exist).

## Deletion ledger (post-parity)
| Component | Removed when |
|---|---|
| PaymentDialog, InvoicePaymentDialog, UnifiedPaymentDialog v1 | R1 parity sign-off |
| Customer details dialog + history dialog | R2 live |
| NotificationPopover/Sidebar/SmartNotificationCenter | R3 |
| LowStockTable (dashboard) | UX-051 attention panel absorbs |
| Quick-action grid markup | UX-050 |

Each deletion requires: grep zero-importers, tests updated, manual flow script passed.

## Business Logic Preservation
Refactors move presentation code only; hooks/services/mutations untouched. Every task's PR includes a "logic diff = none" checklist statement.

## Risks
R1/R2 are the highest-risk refactors (money flows) — each gets its own branch, parity matrix review, and role-matrix manual pass before merge.
