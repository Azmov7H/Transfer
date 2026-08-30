# REQ-FIN — Treasury / Payment Channels

## Business Requirement

The system must correctly support and identify these financial channels on every transaction:

| Channel | Proposed `method` value | Current status |
|---------|------------------------|----------------|
| Private Treasury / Main Cash Treasury | `cash` | ✅ exists (primary physical cashbox) |
| InstaPay | `instapay` | ❌ missing — must add |
| Cash Wallet | `wallet` | ✅ exists ("محفظة" / "محفظة كاش" / "محفظة إلكترونية") |

## Requirement Statements

- **REQ-FIN-001** — The data model MUST support a payment channel identifier that distinguishes
  Private Treasury, InstaPay, and Cash Wallet (and existing bank/check) on every financial transaction.
- **REQ-FIN-002** — Add `instapay` as a first-class payment method across: `TreasuryTransaction.method`
  enum, Zod `paymentMethod`, `Invoice.paymentType`/`payments[].method`, `PurchaseOrder.paymentType`,
  all payment schemas, and every UI selector.
- **REQ-FIN-003** — Treasury balance & `CashboxDaily` breakdowns MUST compute and display an `instapay`
  component (income/expense + running net) in addition to cash/bank/wallet/check.
- **REQ-FIN-004** — The financial summary UI (`TreasuryStatsCards`, `financial/page.jsx`) MUST show the
  InstaPay channel balance/activity.
- **REQ-FIN-005** — Each transaction record MUST persist *which* channel was used so transaction history,
  receipts, and reports can filter/group by channel.
- **REQ-FIN-006** — "Private Treasury" remains the default channel for over-the-counter cash; no behavioral
  regression for `cash` transactions.

## Design Recommendation (details in `02-architecture/proposed-treasury-architecture.md`)

- Keep the **single aggregated `TreasuryBalance`** (do not fragment the running total). Represent channels
  as the existing `method` dimension, extended with `instapay`.
- Extend `CashboxDaily` with `instapayIncome`/`instapayExpenses` (+ opening/closing) so the daily
  reconciliation view includes the new channel.
- Centralize the `method`→cashbox-field map in `TreasuryService` (today duplicated in 9 methods).
- Optionally (post-MVP) store per-channel running balances as a `Map` on `TreasuryBalance` for O(1)
  reads; the summary aggregation already computes `breakdown` so this is an optimization, not a requirement.

## Acceptance Mapping

Covered by `13-acceptance-criteria.md` → "Financial" section. Tested in `08-testing/test-matrix.md`.
