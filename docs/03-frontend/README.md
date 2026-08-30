# 03 — Frontend Plan

All tasks modify `Jammaz-System` only. Backend contract changes are in `04-backend`. Tasks reference the
actual repo files discovered. Each task: ID, File/module, Current, Required, Approach, Dependencies,
Acceptance, Tests.

> Note: the frontend proxy targets `be-Jammaz`; new fields/methods only work after backend lands. Tasks are
> ordered so UI can be built against the new contract once `04-backend` is merged.

## 03.1 — Centralize Payment-Method Definitions

- **FIN-UI-000** — Create `src/constants/paymentMethods.js` exporting the canonical list
  `[{value:'cash',label:'نقدي (خزينة)'},{value:'bank',label:'بنك'},{value:'wallet',label:'محفظة كاش'},
  {value:'check',label:'شيك'},{value:'instapay',label:'انستاباي'},{value:'adjustment',label:'تسوية'}]`
  plus helpers `requiresSourceNumber(method)` (true for `instapay`,`wallet`). **Acceptance:** single source
  of truth; no literal method strings scattered. **Tests:** unit test the list + helper.

## 03.2 — Payment-Method Selectors (add InstaPay)

- **FIN-UI-001** — `components/financial/PaymentDialog.jsx` (lines 181,212,279): replace hardcoded
  `methodOptions.push('wallet')` etc. with map from `paymentMethods`; add `instapay` option + conditional
  `sourceNumber` input. **Acceptance:** InstaPay selectable; source field shows for instapay/wallet.
- **FIN-UI-002** — `components/financial/AddTransactionDialog.jsx` (line 67 `value="wallet"`): build options
  from constant; add `instapay`; add conditional `sourceNumber`. **Acceptance:** manual tx can be InstaPay with
  required source.
- **FIN-UI-003** — `app/(protected)/invoices/new/page.jsx` (lines 281–331): add `instapay` payment-type toggle;
  when selected, show `sourceNumber`. **Acceptance:** sale can be paid via InstaPay; validation blocks empty source.
- **FIN-UI-004** — `app/(protected)/purchase-orders/[id]/page.jsx` (lines 89,212–223): add `instapay` payment
  type; conditional source field. **Acceptance:** supplier payment via InstaPay requires source.
- **FIN-UI-005** — `components/suppliers/SupplierDebtManager.jsx` (line 376 `value="wallet"`): add `instapay`;
  conditional source. **Acceptance:** supplier debt payment via InstaPay requires source.
- **FIN-UI-006** — `components/financial/DebtEditDialog.jsx` (if it captures method): add `instapay` + source.
  Verify during implementation (UNKNOWN exact lines).

## 03.3 — Conditional Source-Number Field (reusable)

- **FIN-UI-007** — Create `components/financial/SourceNumberField.jsx`: an input shown only when
  `requiresSourceNumber(method)`; required validation (RHF + Zod) mirroring backend. Reused by FIN-UI-001..006.
  **Acceptance:** consistent UX; red border + Arabic error "رقم حساب التحويل مطلوب" when empty for instapay/wallet.
- **FIN-UI-008** — `components/financial/TransactionsTable.jsx` (line 127 method badge): ensure `instapay` label
  renders ("انستاباي"); display masked `sourceNumber` column/tooltip where available.

## 03.4 — Treasury Summary UI (InstaPay channel)

- **FIN-UI-009** — `components/financial/TreasuryStatsCards.jsx` (lines 24–32): render
  `treasuryData?.breakdown?.instapay` in addition to cash/bank/wallet. **Acceptance:** InstaPay net shown.
- **FIN-UI-010** — `app/(protected)/financial/page.jsx` (lines 160–166 period stats): include instapay in any
  channel breakdown display. **Acceptance:** page reflects new channel.
- **FIN-UI-011** — `components/financial/TransactionDetailsDialog.jsx` (line 76 method label): add instapay label
  and show (masked) source number.

## 03.5 — Customer/Supplier Unification UI (Option B)

- **FIN-UI-012** — `components/customers/CustomerFormDialog.jsx`: add "إضافة كمورد / ربط بمورد" section
  (calls new link endpoint). **Acceptance:** from a customer, create/link a supplier.
- **FIN-UI-013** — `components/suppliers/SupplierFormDialog.jsx`: symmetric "إضافة كعميل / ربط بعميل".
- **FIN-UI-014** — `app/(protected)/customers/[id]/CustomerClient.jsx`: show " net position" card (combined
  customer+supplier balance) when linked. **Acceptance:** net view reconciles.
- **FIN-UI-015** — New `app/(protected)/parties/page.jsx` + `components/parties/DuplicateCandidates.jsx`:
  surface detection report; allow confirm-link. **Acceptance:** reviewer can link candidates.

## 03.6 — Export UI Repair

- **FIN-UI-016** — Rewrite `components/common/ExportButton.jsx`: Excel → call real `/api/export` (or per-resource
  endpoint) with same filters as the current view (pass `filters` prop). PDF → use Arabic-capable generator
  (decided in `04-backend`/`07-security`); if PDF deferred, disable with a tooltip. **Acceptance:** no 404;
  exports honor filters.
- **FIN-UI-017** — `app/(protected)/accounting/page.jsx` `exportToCSV`: extract shared CSV serializer to
  `lib/exportCsv.js` (reused by ExportButton server response handling). **Acceptance:** DRY; consistent columns.
- **FIN-UI-018** — Add Export buttons to: Customers, Suppliers, Products, Invoices, Purchase Orders, Treasury
  Transactions, Reports (sales/financial/customer-profit), Inventory, Shortage — each passing its filters to the
  export endpoint. **Acceptance:** every tabular module exports.

## 03.7 — RTL / Accessibility / Responsive (see `06-ux-ui`)

- **FIN-UI-019** — Ensure all new fields are RTL-correct, labeled in Arabic, keyboard-accessible, and responsive
  (mobile stacks). Covered by UX tasks.

## Dependencies

- All FIN-UI-* depend on backend contract (`04-backend`: method enum + `sourceNumber` + link endpoints + export
  endpoint). Build UI behind feature flags / merge after backend.
- FIN-UI-000 must land first (single source of truth).

## Testing (frontend)

- Unit: `requiresSourceNumber`, payment-method list, CSV serializer.
- Component: render PaymentDialog with `instapay` → source field visible & blocks empty submit (React Testing
  Library + `jest`).
- E2E (if harness exists): complete sale via InstaPay flow (see `08-testing`).
