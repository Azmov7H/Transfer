# Database Architecture

MongoDB via Mongoose. All schemas are in `be-Jammaz/models/`. Connection via `lib/db.js`.

## Collections (26)

| Collection | Model File | Role in this plan |
|------------|-----------|------------------|
| `customers` | `Customer.js` | Customer party; separate from Supplier |
| `suppliers` | `Supplier.js` | Supplier party; separate from Customer |
| `invoices` | `Invoice.js` | Sales; `paymentType`, `payments[]` |
| `purchaseorders` | `PurchaseOrder.js` | Purchases; `paymentType`, `paidAmount` |
| `treasurytransactions` | `TreasuryTransaction.js` | **Core financial ledger (method, amount, reference)** |
| `treasurybalances` | `TreasuryBalance.js` | **Single aggregated balance doc** |
| `cashboxdailies` | `CashboxDaily.js` | Per-day method breakdown + reconciliation |
| `debts` | `Debt.js` | Polymorphic debtor (Customer/Supplier) |
| `unifiedcollections` | `UnifiedCollection.js` | **SURROGATE over `customers` — tech debt** |
| `accountingentries` | `AccountingEntry.js` | GL double-entry |
| `paymentschedules` | `PaymentSchedule.js` | Installments |
| `salesreturns` | `SalesReturn.js` | Returns (`refundMethod`) |
| `products`,`stockmovements`,`physicalinventories`,`shortagereports`,`pricehistories`,`dailySales`,`collectionPeriods`,`counters`,`invoicesettings`,`logs`,`notifications`,`refreshTokens`,`users`,`systemMeta` | supporting |

## Key Schemas (as-built)

### TreasuryTransaction (`models/TreasuryTransaction.js`)
```
type:        enum['INCOME','EXPENSE'] required
receiptNumber: String, sparse unique index   (T-DB-03: null conflicts avoided by omitting key)
amount:      Number min 0 required
description: String required
referenceType: enum['Invoice','PurchaseOrder','Manual','SalesReturn','Debt','UnifiedCollection'] default 'Manual'
referenceId: ObjectId refPath 'referenceType'
partnerId:   ObjectId (indexed)
date:        Date default now
method:      enum['cash','bank','wallet','check','adjustment'] default 'cash'   ← NO 'instapay'
createdBy:   ObjectId ref 'User'
indexes: (type,date:-1), (type,referenceType,date:-1), (date:-1)
```
**No `sourceNumber` / transfer-reference field exists.**

### TreasuryBalance (`models/TreasuryBalance.js`)
```
_id: 'treasury' (fixed single doc)
balance: Number
updatedAt: Date
```
Single aggregated running balance. **No per-channel balances.**

### CashboxDaily (`models/CashboxDaily.js`)
Per-day doc with **method-segregated income/expense** fields:
```
salesIncome, purchaseExpenses,
bankIncome, bankExpenses, openingBankBalance, closingBankBalance,
walletIncome, walletExpenses, openingWalletBalance, closingWalletBalance,
checkIncome, checkExpenses, openingCheckBalance, closingCheckBalance,
manualIncome[], manualExpenses[], reconciliation fields
```
`pre('save')` computes totals + per-method closing balances. **No `instapay*` fields.**

### Invoice (`models/Invoice.js`)
```
paymentType: enum['cash','credit','bank','wallet','check'] default 'cash'
paymentStatus: enum['paid','partial','pending']
paidAmount: Number
payments: [{ amount, date, method enum['cash','bank','wallet','check','credit_balance'], note, recordedBy }]
```
Recorded via `InvoiceSchema.methods.recordPayment` (atomic pipeline). **`payments[].method` has no `instapay`.**

### PurchaseOrder (`models/PurchaseOrder.js`)
```
supplier: ObjectId ref 'Supplier' required
paymentType: enum['cash','credit','bank','wallet','check'] default 'cash'
paidAmount, paymentStatus
```

### Debt (`models/Debt.js`)
```
debtorType: enum['Customer','Supplier'] required
debtorId: ObjectId refPath 'debtorType' required
originalAmount, remainingAmount, currency
status: enum['active','overdue','settled','written-off']
dueDate, referenceType, referenceId, meta: Map, createdBy
unique partial index on (referenceType,referenceId,debtorType,debtorId) where status != CANCELLED
```

### Customer (`models/Customer.js`)
```
name (req), phone (req, unique), address, notes, shippingCompany,
priceType enum['retail','wholesale','special'],
balance Number default 0, creditBalance Number, creditLimit,
isActive, financialTrackingEnabled, collectionDay, paymentTerms,
totalPurchases, lastPurchaseDate, customPricing[]
indexes: balance, name, text(name,phone), (isActive,balance,createdAt), totalPurchases, lastPurchaseDate
```
**No supplier link / role flags.**

### Supplier (`models/Supplier.js`)
```
name (req), phone (optional, sparse unique), address, products[],
balance Number (positive = you owe), isActive,
lastSupplyDate, financialTrackingEnabled, paymentDay, supplyTerms
indexes: name, (phone sparse unique), isActive
```
**No customer link / role flags.**

### AccountingEntry (`models/AccountingEntry.js`)
```
date, entryNumber (unique), type enum[SALE,PURCHASE,PAYMENT,ADJUSTMENT,COGS,EXPENSE,INCOME,TRANSFER,RETURN,RETURN_COGS],
debitAccount, creditAccount, amount, description,
refType enum[Invoice,PurchaseOrder,Payment,Adjustment,PhysicalInventory,Manual,SalesReturn], refId,
isSystemGenerated, createdBy
```
GL is produced by `AccountingService` (`services/accountingService.js`) — **verify account naming during
implementation (UNKNOWN exact account strings without full read).**

## Relationships

- `Invoice.customer` → `Customer`; `Invoice.payments[].method` records channel.
- `PurchaseOrder.supplier` → `Supplier`.
- `Debt.debtorId` → `Customer` OR `Supplier` (polymorphic).
- `TreasuryTransaction.referenceId` → Invoice/PurchaseOrder/Debt/UnifiedCollection/Manual/SalesReturn.
- `TreasuryTransaction.partnerId` → generic ObjectId (customer or supplier).
- `UnifiedCollection` === `customers` collection (surrogate).

## Indexes / Constraints

- `Customer.phone` unique (required). `Supplier.phone` sparse unique.
- `TreasuryTransaction.receiptNumber` sparse unique.
- `Debt` partial unique on (referenceType,referenceId,debtorType,debtorId).
- `TreasuryBalance` single doc by fixed `_id`.

## Migration Risk Highlights

- Adding `instapay` to `method` enum is **non-breaking** (enum add, existing docs unaffected).
- Adding `sourceNumber` field is **non-breaking** (new optional field; only required for new
  `instapay`/`wallet` writes via validation, not at DB level).
- Customer/Supplier unification requires a **linking strategy** (see `customer-supplier-architecture.md`
  and `02-architecture/proposed-customer-supplier.md`) — highest migration risk.
