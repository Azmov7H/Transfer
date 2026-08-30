# Customer / Supplier Architecture (as-built)

## Current State: TWO SEPARATE ENTITIES

The system models customers and suppliers as **independent collections** with independent balances.
There is **no unified "Party/Entity" concept** today.

### Customer (`models/Customer.js`)
- `balance` (number; positive = customer owes / debit), `creditBalance`, `creditLimit`.
- Customer-specific: `priceType`, `collectionDay`, `paymentTerms`, `totalPurchases`, `customPricing[]`.
- `phone` is **required + unique**.
- Referenced by `Invoice.customer`, `Debt.debtorId` (when `debtorType:'Customer'`),
  `UnifiedCollection` (surrogate).

### Supplier (`models/Supplier.js`)
- `balance` (number; positive = **you owe** the supplier).
- Supplier-specific: `products[]`, `lastSupplyDate`, `paymentDay`, `supplyTerms`.
- `phone` is **optional + sparse unique**.
- Referenced by `PurchaseOrder.supplier`, `Debt.debtorId` (when `debtorType:'Supplier'`).

### Debt (`models/Debt.js`) — the polymorphism bridge
- `debtorType: enum['Customer','Supplier']` + `debtorId: refPath`.
- This already supports a single party acting as both debtor types — but via **two different documents**
  (one Customer doc, one Supplier doc), not one unified record.

### UnifiedCollection (`models/UnifiedCollection.js`) — TECH DEBT
```js
mongoose.model('UnifiedCollection', new Schema({}, {strict:false}), 'customers');
```
A surrogate model bound to the `customers` collection, used only as a `refPath` target for
`TreasuryTransaction.referenceType:'UnifiedCollection'`. It exists to let a unified customer collection
be referenced without a real schema. This is a **code smell** and should be reconsidered during
unification (e.g., point `UnifiedCollection` at a new `Party` collection, or remove it).

## Why Unification Is Hard Today

Every financial reference is typed:
- `Invoice.customer` (ObjectId → Customer)
- `PurchaseOrder.supplier` (ObjectId → Supplier)
- `Debt.debtorId` (refPath by `debtorType`)
- `TreasuryTransaction.partnerId` (generic ObjectId)

Introducing a single `Party` model would require migrating **all** these references, plus historical
`TreasuryTransaction`/`Debt`/`AccountingEntry` records — very high risk for a production system.

## Existing "Dual Role" Behavior (implicit)

A real-world entity (e.g., "Ahmed Company") that is both a customer and a supplier is currently stored
as **two unrelated records**: a `Customer` and a `Supplier`, possibly with the same name/phone. There is
**no linkage**; balances are siloed; the user cannot see "net position" across both roles.

## What the Requirement Asks

- A person/entity can be **both** Customer and Supplier.
- Becoming a supplier (or customer) must **not** create a duplicate record.
- Customer financial history and Supplier financial history must each remain intact.

## Design Decision (see `02-architecture/proposed-customer-supplier.md`)

Two candidate approaches:

**Option A — Full Unified `Party` model (cleanest, highest risk).**
Replace Customer/Supplier with a single `Party` having `roles:['customer','supplier']` and role-specific
subdocuments. Requires mass reference migration. Rejected as default due to risk.

**Option B — Keep collections, add cross-link + role flags (safest, recommended).**
- Add to `Customer`: `isSupplier` (bool), `linkedSupplier` (ObjectId → Supplier, sparse),
  `supplierBalanceView` (virtual/computed).
- Add to `Supplier`: `isCustomer` (bool), `linkedCustomer` (ObjectId → Customer, sparse).
- A new "Create as Supplier too" / "Link to existing Supplier" action in the UI populates the link.
- Balances stay on their native collections (no migration of historical debits). A combined "net position"
  view aggregates via the link.
- This preserves all historical `Invoice.customer`/`PurchaseOrder.supplier` references unchanged, satisfying
  backward compatibility.

The plan recommends **Option B** as the implementation-safe path, with Option A as a future, separate
migration project.

## Data Migration Analysis (existing data)

Potential duplicate cases to detect during linking:
- Same `phone` across a Customer and a Supplier (Supplier phone may be empty → match by name + other signals).
- Same `name` (fuzzy) across both.
- Shared tax ID / commercial registration (currently `Supplier.taxNumber` exists; `Customer` has none →
  add `taxNumber` to Customer for matching).
- Different identifiers / missing identifiers.

A **read-only detection script** (no writes) should first report candidate matches before any link is made;
linking is then done explicitly by a user action or a reviewed batch, never auto-merged destructively.

## API Surface (current)

- `customerRoutes`: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` (owner),
  `GET /:id/pricing`, `POST /:id/pricing`, `GET /:id/statement`, `POST /:id/pay` (unified collection).
- `supplierRoutes`: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` (owner).
- `Debt` read/manage via `financeRoutes` (`/debts`, `/debts/debtors`, `/debts/overview`, installments).
- No endpoint today returns a "combined party" view.
