# REQ-VAL — Transfer-Source Number Validation

## Business Rule

When a payment uses **InstaPay** or **Cash Wallet**, the system MUST capture the sender's
account/transfer identifier (the number/account from which the transfer was made), and MUST reject the
transaction if it is missing.

For **Private Treasury (cash)**, the source number is **optional** (not required).

## Field Definition

Proposed field: `sourceNumber` (String) on the canonical transaction record. Alternative accepted names
(documented for implementers): `transferReference`, `sourceAccount`, `senderNumber`. The plan uses
**`sourceNumber`** consistently. Stored on:

- `TreasuryTransaction.sourceNumber` (canonical ledger field)
- `Invoice.payments[].sourceNumber` (per-payment capture on sales)
- Forwarded through service calls and validation schemas.

## Requirement Statements

- **REQ-VAL-001** — Add `sourceNumber` field to `TreasuryTransaction` (optional at DB level).
- **REQ-VAL-002** — Add `sourceNumber` to `Invoice.payments[]` entries.
- **REQ-VAL-003** — Backend validation MUST reject any new transaction where
  `method ∈ {instapay, wallet}` AND `sourceNumber` is empty/blank.
- **REQ-VAL-004** — Backend validation MUST accept `method === 'cash'` (and `bank`, `check`,
  `adjustment`, `credit`) with an empty `sourceNumber`.
- **REQ-VAL-005** — Rule applies uniformly to: Sales, Customer Collections, Supplier Payments, Manual
  Debt Payments, Expenses, and Manual Treasury entries (any path that writes a `TreasuryTransaction`
  with method `instapay`/`wallet`).
- **REQ-VAL-006** — Frontend MUST show a conditional "رقم حساب المحول / رقم التحويل" field when the
  selected method is InstaPay or Cash Wallet, and block submit when empty (client-side mirror of backend).
- **REQ-VAL-007** — Historical records lacking `sourceNumber` (created before this change) MUST remain
  valid and MUST NOT be rejected by any read or migration. Required-for-new-transactions-only.
- **REQ-VAL-008** — `sourceNumber` value MUST be stored verbatim (no masking in DB) but MUST be treated as
  sensitive PII in export/logs (see `07-security`).

## Validation Scenarios (must all pass — see `08-testing/test-matrix.md`)

| Scenario | Payment Method | sourceNumber | Expected |
|----------|----------------|--------------|----------|
| Sale | Private Treasury (cash) | empty | ✅ Success |
| Sale | InstaPay | present | ✅ Success |
| Sale | InstaPay | empty | ❌ Reject (400) |
| Sale | Cash Wallet | present | ✅ Success |
| Sale | Cash Wallet | empty | ❌ Reject (400) |
| Collection | Private Treasury | empty | ✅ Success |
| Collection | InstaPay | present | ✅ Success |
| Collection | InstaPay | empty | ❌ Reject |
| Collection | Cash Wallet | present | ✅ Success |
| Collection | Cash Wallet | empty | ❌ Reject |
| Supplier Payment | Private Treasury | empty | ✅ Success |
| Supplier Payment | InstaPay | present | ✅ Success |
| Supplier Payment | InstaPay | empty | ❌ Reject |
| Supplier Payment | Cash Wallet | present | ✅ Success |
| Supplier Payment | Cash Wallet | empty | ❌ Reject |

## Implementation Hooks (discovered)

- Zod: `validators.js` `paymentMethod` + `customerPaymentSchema`/`supplierPaymentSchema`/`debtPaymentSchema`/
  `counterpartyPaymentSchema`/`expenseSchema`/`treasuryTransactionSchema`/`invoiceSchema`/`purchaseOrderSchema`.
- Services that write TreasuryTransactions: `treasuryService.*`, `paymentService.*`, `saleService.*`,
  `purchaseService.*`, `expenseService.*`, `returnService.*`.
- UI selectors: `PaymentDialog.jsx`, `AddTransactionDialog.jsx`, `invoices/new/page.jsx`,
  `purchase-orders/[id]/page.jsx`, `SupplierDebtManager.jsx`, `DebtEditDialog.jsx`.

## Edge Cases / Ambiguities

- **Bank transfers:** business did not list bank as requiring source number. Keep optional (consistent
  with today). Document if later required.
- **Refunds (SalesReturn):** if `refundMethod` is `instapay`/`wallet`, should the *destination* account be
  captured? Requirement focuses on outbound source; flag as ambiguity → capture `destinationNumber`
  optionally. Document, do not silently decide.
- **Partial payments:** each `Invoice.payments[]` entry carries its own `method`+`sourceNumber`, so a mix
  (e.g., part cash, part InstaPay) is supported per-entry.
