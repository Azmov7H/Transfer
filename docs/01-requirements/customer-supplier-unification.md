# REQ-PARTY — Customer ↔ Supplier Unification

## Business Requirement

A person/entity MUST be able to be both a **Customer** and a **Supplier** without creating duplicate
records. A customer can become a supplier, and a supplier can become a customer, reusing the same
underlying entity/record.

Example: "Ahmed Company" buys from Jammaz AND sells to Jammaz — one entity, two roles.

## Current Gap

Today `Customer` and `Supplier` are **separate collections** with independent balances and no linkage.
An entity that is both is stored as two unlinked documents. There is no "net position" view.

## Requirement Statements

- **REQ-PARTY-001** — The system MUST allow an entity to hold both the Customer role and the Supplier role.
- **REQ-PARTY-002** — Promoting a Customer to also be a Supplier (or vice-versa) MUST NOT create a second
  unrelated record; it MUST link to (or reveal) the existing counterpart record.
- **REQ-PARTY-003** — Each role's financial history (invoices, purchase orders, debts, treasury transactions)
  MUST remain intact and independently queryable after linking.
- **REQ-PARTY-004** — A combined view MUST show the net position (customer balance − supplier balance, with
  sign semantics) for a unified entity.
- **REQ-PARTY-005** — Linking MUST be explicit/safe: no destructive auto-merge that loses either role's
  historical data. A read-only duplicate-detection report MUST run before any linking.
- **REQ-PARTY-006** — APIs MUST support: (a) list customers, (b) list suppliers, (c) list unified parties
  (both roles), (d) link an existing Customer↔Supplier, (e) create the counterpart role for an existing party.

## Recommended Approach — Option B (safest)

Keep `Customer` and `Supplier` collections; add a **cross-link + role flags**:

- `Customer`: add `isSupplier: Boolean`, `linkedSupplier: ObjectId→Supplier (sparse)`, `taxNumber: String`.
- `Supplier`: add `isCustomer: Boolean`, `linkedCustomer: ObjectId→Customer (sparse)`.
- UI action "أضف كمورد / اربط بمورد موجود" on a Customer; symmetric on Supplier.
- Balances remain on native collections; a computed "net" view aggregates via the link.
- This preserves every historical `Invoice.customer` / `PurchaseOrder.supplier` / `Debt.debtorId` reference
  with **zero migration of references** → lowest risk, fully backward compatible.

### Alternative — Option A (full unified `Party`)

A single `Party` collection with `roles:['customer','supplier']` and role subdocs. Cleaner long-term but
requires migrating all references + historical transactions. **Rejected as default** due to production risk;
deferred to a separate future project. Documented for completeness in `02-architecture/proposed-customer-supplier.md`.

## Migration / Duplication Strategy

- **Detection:** script scanning for Customer↔Supplier pairs sharing `phone` (normalize), `taxNumber`,
  and fuzzy `name`. Report candidates (read-only, no writes).
- **Matching:** rank by phone > taxNumber > name similarity; surface conflicts for human review.
- **Resolution:** explicit link action (user-confirmed) or reviewed batch; never auto-delete a record.
- **Preservation:** both records' balances/debts retained; link only adds a pointer.
- **Rollback:** removing a link is a single field unset → trivially reversible.
- **Verification:** assert no `Customer`/`Supplier` doc is destroyed; net view reconciles to sum of parts.

## API Surface Additions (proposed)

- `GET /api/parties?role=both|customer|supplier` (new or extended from existing list endpoints)
- `POST /api/customers/:id/link-supplier` `{ supplierId }` (or create)
- `POST /api/suppliers/:id/link-customer` `{ customerId }`
- `GET /api/parties/:id/net-position` (combined balances + recent activity)

(Exact route placement to be finalized in `04-backend/routes-changes.md`.)
