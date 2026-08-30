# Proposed Data Model

Concrete field/schema changes. All additive → backward compatible. DB-level fields are optional; business
rules are enforced in validation/services (so historical rows without `sourceNumber` stay valid).

## TreasuryTransaction (`models/TreasuryTransaction.js`)

```js
method: { type: String, enum: ['cash','bank','wallet','check','adjustment','instapay'], default: 'cash' }
sourceNumber: { type: String, trim: true, maxlength: 200, default: '' } // NEW (optional at DB)
// optional: sourceMeta: { type: Map, of: String } for extra transfer metadata
```
- Index: add `{ method: 1, date: -1 }` (supports channel-filtered reporting efficiently).

## CashboxDaily (`models/CashboxDaily.js`)

Add fields (mirror existing wallet/check pattern):
```js
openingInstapayBalance: { type: Number, default: 0 },
instapayIncome:        { type: Number, default: 0, min: 0 },
instapayExpenses:      { type: Number, default: 0, min: 0 },
closingInstapayBalance:{ type: Number, default: 0 },
```
- Extend `pre('save')` totals: `totalIncome` includes `instapayIncome`; `closingInstapayBalance =
  openingInstapayBalance + instapayIncome - instapayExpenses`.

## TreasuryBalance (`models/TreasuryBalance.js`)

- (Optional, post-MVP) add `balancesByMethod: { type: Map, of: Number, default: {} }`. Not required for
  correctness; only for O(1) per-channel reads. MVP relies on `getSummary` aggregation.

## Invoice (`models/Invoice.js`)

```js
paymentType: { ..., enum: ['cash','credit','bank','wallet','check','instapay'], ... }
payments: [{ amount, date, method: enum['cash','bank','wallet','check','credit_balance','instapay'],
             note, sourceNumber: String, recordedBy }]
```
- `recordPayment` pipeline: copy `sourceNumber` from input into the pushed payment object.

## PurchaseOrder (`models/PurchaseOrder.js`)

```js
paymentType: { ..., enum: ['cash','credit','bank','wallet','check','instapay'], ... }
```

## Customer (`models/Customer.js`) — unification (Option B)

```js
taxNumber:    { type: String, maxlength: 50, default: '' },          // for duplicate detection
isSupplier:   { type: Boolean, default: false },
linkedSupplier:{ type: ObjectId, ref: 'Supplier', default: null },   // sparse unique recommended
```
- Index: `linkedSupplier` (sparse unique) to prevent double-linking.

## Supplier (`models/Supplier.js`) — unification (Option B)

```js
isCustomer:   { type: Boolean, default: false },
linkedCustomer:{ type: ObjectId, ref: 'Customer', default: null },   // sparse unique recommended
```
- Index: `linkedCustomer` (sparse unique).

## UnifiedCollection (`models/UnifiedCollection.js`)

- Re-evaluate: if `Party` link approach (Option B) keeps `UnifiedCollection` referencing `customers`, it can
  stay. If a unified `Party` is introduced later (Option A), repoint or remove. For Option B, **leave as-is**
  but note the tech-debt in `12-risk-register.md`.

## Validation Schema Changes (`validations/validators.js`)

Centralize method enum:
```js
const paymentMethod = z.enum(['cash','bank','wallet','check','adjustment','instapay']).optional();
```

Add `sourceNumber` with conditional requirement. Recommended helper:
```js
const requiresSource = (method) => method === 'instapay' || method === 'wallet';
const sourceNumberField = z.string().max(200).trim().optional()
  .refine((v, ctx) => {
     // note: refine cannot see sibling `method` directly; apply at object level instead
  });
```
Apply the rule at the **object** level for each schema:
```js
.c SuperRefine((data, ctx) => {
  if (requiresSource(data.method) && !data.sourceNumber) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sourceNumber'],
      message: 'رقم حساب التحويل مطلوب لطريقة الدفع هذه' });
  }
})
```
Apply to: `customerPaymentSchema`, `supplierPaymentSchema`, `debtPaymentSchema`, `counterpartyPaymentSchema`,
`expenseSchema`, `treasuryTransactionSchema`, `invoiceSchema` (per payment item), `purchaseOrderSchema` (if
source captured at PO level), `saleReturnSchema` (destination number, optional).

## No Breaking Changes

- All new fields optional at the schema level.
- Enum extension only **adds** values.
- Historical documents remain readable; no data rewrite required.
- Required-for-new behavior is enforced in validation, not in the DB, so old rows with empty `sourceNumber`
  are never rejected.

## Unknowns to Resolve at Implementation

- Exact GL account strings in `AccountingService` for posting `instapay` (UNKNOWN — read
  `services/accountingService.js` before coding; see traceability REQ-ACC-*).
- Whether `sourceNumber` should also be captured for `bank` (business said no; keep optional).
