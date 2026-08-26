# 02 — User Journeys & Confusion Points

Workflows documented as: Workflow → Entry → Goal → Steps → Decisions → Forms → Actions → Feedback → Completion, plus confusion analysis. Roles referenced: Owner (admin), Manager, Warehouse (from `ROLES` in `src/lib/permissions.js`).

---

## J1 — Create & collect an invoice (highest-frequency flow)

- **Entry:** Sidebar "فاتورة جديدة" or dashboard quick action.
- **Goal:** Sell items to a customer and record payment.
- **Steps:** choose customer (or walk-in) → price type auto-set from customer → add items (search/scan via ProductSelector) → adjust qty/price → choose payment type (cash/credit) → if credit: due date + shipping → save → optional print.
- **Decision points:** customer has priceType (retail/wholesale/special); item out of shop stock but in warehouse stock; shortage reporting.
- **Forms:** implicit form spread across page sections; no visible required-field marking; validation is toast-based at submit.
- **Feedback:** toasts on customer select ("تم اختيار العميل…"), price-type change info toast per change, success redirect.
- **Completion:** navigate to invoice detail/print.

**Confusion points**
1. Price silently rewrites all line prices when customer changes — an info toast fires even for zero-effect changes; users don't see *what* changed. (Presentation fix: inline diff/badge on affected rows.)
2. Payment section vocabulary differs from debt-center dialogs (سداد/تحصيل/دفعة used interchangeably across flows).
3. Stock source (shop vs warehouse) is implied by numbers only.
4. Submit button disabled-state reasons invisible (empty cart vs pending mutation show toasts only after click).

## J2 — Collect a debt (payment against customer/invoice/debt)

- **Entry:** Customers page row action, Customer detail page, Debt Center, Financial page — 4 different entries.
- **Goal:** Record money received.
- **Steps:** open entity → pick one of **PaymentDialog / UnifiedPaymentDialog / InvoicePaymentDialog / InstallmentDialog** depending on entry point and entity type → enter amount/method/note → confirm.
- **Confusion points**
  1. Same conceptual action (take money) has 5 dialog variants with different fields/layouts depending on where the user entered — the single largest usability defect in the system (F1/P0). Users trained on one screen cannot operate another.
  2. Customers page exposes multiple parallel payment buttons whose scope (customer-level vs invoice-level vs installment plan) is not visually distinguished.
  3. Installment scheduling vs one-off payment distinction is buried in dialog internals.

## J3 — Manage customers

- **Entry:** Sidebar العملاء.
- **Goal:** Add/edit customers, view balance/history, collect payments, create installments, partner transactions.
- **Steps:** list → search → row actions open up to 6 dialogs (add, edit, details, history, payment ×3 kinds) → each dialog internally may chain another.
- **Confusion points**
  1. Page mixes three domains (customer CRUD, financial payments, invoicing history) in one surface with 11 boolean dialog states — users can't predict what any button opens (F2/P0).
  2. Duplicate paths: same payment reachable 3 ways with slightly different UIs.
  3. Details exist both as dialog (`isDetailsOpen`) AND dedicated page `/customers/[id]` — two competing "detail" concepts.

## J4 — Inventory operations

- **Entry:** Sidebar المخزون والمشتريات group.
- **Flows:** products CRUD; stock movements log; physical inventory count sessions (new → count items table → finalize); purchase orders (create → receive); suppliers + supplier debts.
- **Confusion points**
  1. `/stock` vs `/stock-movements` vs `/analytics/stock`: three similarly-named destinations without clear differentiation in labels (حركة المخزون vs analytics page unreachable from nav at all).
  2. Physical inventory is a multi-step session workflow presented as flat pages; progress/state of session unclear mid-flow.

## J5 — Treasury & accounting

- **Entry:** الخزينة والمالية sidebar item → `/financial`.
- **Flows:** treasury stats cards; transactions table; manual transaction add; receivables `(finance)/receivables` (unreachable from nav); `/accounting` (unreachable from nav); daily-sales (unreachable).
- **Confusion points:** overlapping money views (financial, debt-center, receivables, accounting, reports/financial) with no stated relationship; users cannot form a mental model of "where is which money".

## J6 — Reports

- **Entry:** none in sidebar — reached via embedded links/dashboard quick action (سجل المبيعات → /reports/sales).
- **Flows:** sales report (chart + filters), financial report, profit-by-customer, price-history, shortage report.
- **Confusion points:** discovery failure (P0 F3); inconsistent filter UIs (some auto-query, some require تحديث button click); export actions differ per page.

## J7 — Administration

- **Entry:** النظام group → users/settings; audit/logs direct URL (in `(admin)` layout-gated but absent from sidebar config — verify visibility rules during implementation).
- **Confusion points:** settings page scope unclear (single page holding heterogeneous settings).

## Cross-cutting confusions
| Pattern | Where |
|---|---|
| Terminology drift | سداد/تحصيل/دفعة; خزينة/مالية/محاسبة; حركة مخزون/جرد |
| Hidden features | 8+ routes outside navigation |
| Overchoice | customers page row-action cluster |
| Inconsistent feedback | some mutations toast-only, some inline, some silent |
| Status meaning | badge colors vary per feature (emerald=paid here, amber=pending there, rose elsewhere) |

These journeys feed directly into IA (doc 03), navigation (04), forms (09), tables (10) and modals (11).
