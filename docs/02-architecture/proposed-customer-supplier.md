# Proposed Customer ↔ Supplier Architecture

## Recommendation: Option B (cross-link + role flags) — SAFEST

Full unified `Party` (Option A) is the "clean" model but carries the highest production risk because
every historical reference (`Invoice.customer`, `PurchaseOrder.supplier`, `Debt.debtorId`, treasury
`partnerId`, `AccountingEntry.refId`) is typed to a specific collection. Option B delivers the business
requirement (one entity, two roles, no duplicate) **without migrating references**.

### Model Changes (Option B)

- `Customer.isSupplier: Boolean`, `Customer.linkedSupplier: ObjectId→Supplier (sparse unique)`,
  `Customer.taxNumber: String` (for matching).
- `Supplier.isCustomer: Boolean`, `Supplier.linkedCustomer: ObjectId→Customer (sparse unique)`.

### Behavior

- Creating a Customer does not create a Supplier. A UI action "إضافة كمورد" either:
  - links to an **existing** Supplier (by id/phone/name match from the detection report), or
  - creates a **new** Supplier pre-filled from the Customer's name/phone/taxNumber and sets the mutual link.
- The same, symmetrically, from a Supplier.
- Balances remain native: `Customer.balance` (receivables from Jammaz's view) and `Supplier.balance`
  (payables from Jammaz's view). Net position = `Supplier.balance - Customer.balance` with documented sign
  semantics (positive = entity owes Jammaz net, etc.). Exact sign convention to be confirmed in
  `04-backend/services-changes.md`.

### Net-Position View (new, additive)

A `PartyService.getNetPosition(customerId | supplierId)` that, following the link, returns both balances
and recent activity. No new collection required.

### Duplicate-Detection Report (read-only, prerequisite)

`PartyService.detectDuplicates()` scans Customer↔Supplier for shared `phone` (normalized), `taxNumber`,
and fuzzy `name`; returns candidate pairs with a confidence score. **No writes.** Surfaced in a UI screen
("الكيانات المكررة المحتملة") before any linking.

### Linking API (proposed)

- `POST /api/customers/:id/link-supplier` `{ supplierId? , createIfMissing?:bool, ... }`
- `POST /api/suppliers/:id/link-customer` `{ customerId? , createIfMissing?:bool, ... }`
- Both idempotent (if already linked, return existing). Validated: cannot link to self; cannot double-link.

### Rollback

Unlinking = unset the two link fields (one update each). Fully reversible; no data loss. This is why Option B
is preferred over destructive merge.

## Option A (documented, deferred)

A single `Party` collection with `roles:['customer','supplier']` and embedded/linked role profiles.
Requires:
- New `Party` model + migration of `Customer`/`Supplier` docs into `Party`.
- Rewrite of all `ref:'Customer'`/`ref:'Supplier'` to `ref:'Party'` (Invoice, PurchaseOrder, Debt refPath,
  TreasuryTransaction.partnerId, AccountingEntry.refId, UnifiedCollection repoint).
- Backfill of historical `TreasuryTransaction`/`Debt`/`AccountingEntry` referenceIds.
- Extensive regression testing.

**Deferred** to a separate future initiative; not part of this plan's sprints. Mentioned for completeness and
to show the "preferred conceptual architecture" the prompt asked about, with the explicit safety rationale
for not forcing it now.

## Data Migration Analysis

| Case | Detection | Resolution |
|------|-----------|------------|
| Same phone (Customer↔Supplier) | normalize + exact match | high-confidence candidate |
| Same taxNumber | exact match | high-confidence candidate |
| Same/ similar name, no phone/tax | fuzzy (Levenshtein/contains) | low-confidence, human review |
| One side missing identifier | partial signal | review |
| Already linked | link fields set | skip |

- **No auto-merge.** Linking is explicit (user action or reviewed batch).
- **Preservation:** both records retained; only pointers added.
- **Verification:** post-link, net-position sum equals pre-link sum of the two balances (no double count).
- **Rollback:** unset links.

## API/Authorization

- Link endpoints: `owner`/`manager` (same as other counterparty writes).
- Detection report: `owner`/`manager`/`viewer` (read-only).
- Net-position: same permission as viewing the underlying party.
