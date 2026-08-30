# 04 — Backend Plan (`be-Jammaz`)

All tasks modify `be-Jammaz`. Each: ID, Affected files, Current, Required, Approach, Dependencies,
Acceptance, Tests. Implementation order follows `10-sprints` and `11-dependency-graph.md`.

## 04.1 — Models

- **FIN-MDL-001** — `models/TreasuryTransaction.js:44` — extend `method` enum to include `'instapay'`.
  Add `sourceNumber: { type: String, trim:true, maxlength:200, default:'' }`. Add index
  `{ method:1, date:-1 }`. **Acceptance:** existing docs valid; new docs accept instapay + sourceNumber.
- **FIN-MDL-002** — `models/CashboxDaily.js` — add `openingInstapayBalance`, `instapayIncome`,
  `instapayExpenses`, `closingInstapayBalance`; update `pre('save')` totals + closing. **Acceptance:** daily
  cashbox includes instapay line; closing computed.
- **FIN-MDL-003** — `models/Invoice.js:23,39` — `paymentType` enum add `'instapay'`; `payments[].method` enum
  add `'instapay'`; add `payments[].sourceNumber: String`. Update `recordPayment` pipeline to persist
  `sourceNumber`. **Acceptance:** invoice payments carry channel + source.
- **FIN-MDL-004** — `models/PurchaseOrder.js:22` — `paymentType` enum add `'instapay'`.
- **FIN-MDL-005** — `models/Customer.js` / `models/Supplier.js` — add `taxNumber`, `isSupplier`/`isCustomer`,
  `linkedSupplier`/`linkedCustomer` (ObjectId, sparse unique). **Acceptance:** link fields persist; no dup link.

## 04.2 — Validation (`validations/validators.js`)

- **FIN-VAL-001** — Centralize `paymentMethod = z.enum([... ,'instapay']).optional()` (include `'adjustment'`).
- **FIN-VAL-002** — Add `sourceNumber` conditional rule (superRefine) to `customerPaymentSchema`,
  `supplierPaymentSchema`, `debtPaymentSchema`, `counterpartyPaymentSchema`, `expenseSchema`,
  `treasuryTransactionSchema`: if `method ∈ {instapay, wallet}` and `!sourceNumber` → Zod issue
  "رقم حساب التحويل مطلوب". **Acceptance:** invalid payload → 400 with Arabic message.
- **FIN-VAL-003** — `invoiceSchema` / `purchaseOrderSchema`: allow `'instapay'` in `paymentType`; for each
  `payments[]` item (invoice), superRefine source requirement.
- **FIN-VAL-004** — `customerSchema`/`supplierSchema`: add `taxNumber`, `linkedSupplier`/`linkedCustomer` (id).
- **FIN-VAL-005** — New `linkSchema` for link endpoints (target id; prevent self-link).

## 04.3 — Services

- **FIN-SVC-001** — `services/treasuryService.js`: add `METHOD_CASHBOX` helper; replace inline ternaries in
  `recordSaleIncome`, `_recordCollection`, `recordDebtTransaction`, `recordPurchaseExpense`,
  `recordSupplierPayment`, `addManualIncome`, `addManualExpense`, `undoTransaction`, `deleteTransactionByRef`,
  `getSummary` (breakdown init + branch) with `fieldFor(method,type)` + instapay fields. **Acceptance:** instapay
  transactions update cashbox + balance + summary correctly.
- **FIN-SVC-002** — Forward `sourceNumber` through `recordPaymentCollection`, `recordUnifiedCollection`,
  `recordDebtTransaction`, `recordSupplierPayment`, `recordPurchaseExpense`, `recordReturnRefund`,
  `addManualIncome`, `addManualExpense`, `buildReceipt` (include masked source in receipt payload).
- **FIN-SVC-003** — `services/financial/paymentService.js`: pass `sourceNumber` from request into
  `TreasuryService.*` calls (customer/supplier/debt/unified). **Acceptance:** source stored on TreasuryTransaction.
- **FIN-SVC-004** — `services/financial/saleService.js` / `purchaseService.js`: pass `sourceNumber` from invoice/po
  payment into treasury writes.
- **FIN-SVC-005** — `services/accountingService.js`: confirm GL accounts for `instapay` (UNKNOWN — read file first);
  ensure posting consistency. Document account mapping in implementation.
- **FIN-SVC-006** — New `services/partyService.js`: `detectDuplicates()` (read-only) + `linkCustomerSupplier(...)`
  with idempotency + validation. `getNetPosition(id)`.

## 04.4 — Routes

- **FIN-RTE-001** — `routes/customerRoutes.js` / `supplierRoutes.js`: add
  `POST /:id/link-supplier` / `POST /:id/link-customer` (roleMiddleware owner/manager) + validation.
- **FIN-RTE-002** — `routes/financeRoutes.js`: ensure `sourceNumber` is read from body in payment routes and
  passed to services (currently only `method,note,amount` destructured — add `sourceNumber`).
- **FIN-RTE-003** — New `routes/exportRoutes.js` (mount `/api/export`) OR extend `reportRoutes` — implements
  server-side export (see `04-backend/export-endpoint` below / `07-security`).
- **FIN-RTE-004** — `routes/accountingRoutes.js`, `reportRoutes.js`: expose filters used by export (date, search,
  type) so export reuses the same query as the UI.

## 04.5 — Export Endpoint (REQ-EXP)

- **FIN-EXP-001** — Implement `POST /api/export` (or per-resource) that: authenticates (`authMiddleware`),
  authorizes (role check per `type`), accepts `{ type, format:'csv'|'xlsx'|'pdf', filters }`, runs the same
  query the UI uses (full set, not page), serializes via a per-type column map, streams file. **Acceptance:** no
  404; authorized users get correct file; unauthorized → 403.
- **FIN-EXP-002** — CSV/XLSX via `exceljs` (RTL + Arabic) OR server CSV with BOM. PDF via RTL-capable lib with
  embedded Arabic font. **Acceptance:** Arabic renders correctly; numbers/dates localized.
- **FIN-EXP-003** — Large datasets: stream / paginate server-side; reuse `heavyLimiter` for report surfaces.
  **Acceptance:** 100k rows export without OOM/timeout.
- **FIN-EXP-004** — Mask/exclude sensitive fields (e.g., `sourceNumber` PII) unless role permits (owner/manager).

## 04.6 — Backward Compatibility

- No required DB field; all new fields optional. Enum only adds values. Historical rows never rejected.
- `TreasuryBalance` remains single doc; no migration of running balance.

## Dependencies

- `FIN-MDL-*` before `FIN-VAL-*` before `FIN-SVC-*` before `FIN-RTE-*`.
- Export endpoint depends on reporting/resource services + security review (`07-security`).

## Tests (Vitest + mongodb-memory-server)

- Unit: `METHOD_CASHBOX` map covers all methods incl. instapay; validation superRefine rejects missing source for
  instapay/wallet, accepts for cash.
- Integration: record sale via instapay with source → treasury balance + cashbox instapay fields correct; missing
  source → 400. Supplier payment via wallet with/without source. Unified collection via instapay.
- Party: detectDuplicates returns candidates; link is idempotent; getNetPosition sums correctly; unlink reverts.
- Export: authorized export returns file; unauthorized → 403; large dataset exports within limits.
