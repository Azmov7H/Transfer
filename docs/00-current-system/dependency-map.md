# Dependency Map

Module dependency graph (discovered). Arrows = "depends on / calls".

## Frontend → Backend

```
(app pages)
  └─> hooks/* ─> services/* ─> lib/api-utils ─> /api/* (proxy) ─> be-Jammaz routes
```

## Backend Internal

```
routes/*
  └─> services/*  (financeService facade → financial/*Service, treasuryService, accountingService, reportingService)
        ├─> repositories/*   (data access)
        ├─> models/*         (Mongoose)
        ├─> lib/*            (db, auth, validate, route-handler, permissions, paginate, errors)
        └─> middlewares/authMiddleware (JWT + role)

TreasuryService  ── single choke point ──> TreasuryTransaction + TreasuryBalance + CashboxDaily
PaymentService   ──> TreasuryService + DebtService + Customer/Supplier models + Invoice/PurchaseOrder
SaleService      ──> TreasuryService + StockService + DebtService + DailySalesService + LogService
PurchaseService  ──> TreasuryService + StockService + DebtService
AccountingService─> AccountingEntry
```

## Feature Dependency Order (for this enhancement)

```
1. Payment-method enum extension (model + Zod + UI selectors)
        │
2. sourceNumber field + conditional validation (model + Zod + services + UI)
        │
3. TreasuryService method-map extension (cashbox instapay fields + balance breakdown)
        │
4. Finance/payment/sale/purchase services forward sourceNumber
        │
5. Customer/Supplier cross-link (Option B) + UI
        │
6. Export repair (backend endpoint + Arabic PDF + frontend wiring)
        │
7. UX polish + Security hardening + Tests
```

## Cross-Cutting Dependencies

- **Payment method list** is duplicated in: `validators.js` (Zod), `TreasuryTransaction.method` (model),
  `PaymentDialog.jsx`, `AddTransactionDialog.jsx`, `invoices/new/page.jsx`, `purchase-orders/[id]/page.jsx`,
  `SupplierDebtManager.jsx`. → needs centralization (constant/module) before adding `instapay`.
- **Cashbox method map** duplicated across `TreasuryService` methods (`recordSaleIncome`,
  `_recordCollection`, `recordDebtTransaction`, `recordPurchaseExpense`, `recordSupplierPayment`,
  `addManualIncome`, `addManualExpense`, `undoTransaction`, `deleteTransactionByRef`, `getSummary`).
  → centralize into one helper.
- **Authorization** depends on `roleMiddleware` + `lib/permissions` (frontend mirror). Any new endpoint
  must register both.
- **Export** currently depends on nothing server-side (broken) → must depend on `authMiddleware`,
  `reportingService`/per-resource services, and a new serializer.
