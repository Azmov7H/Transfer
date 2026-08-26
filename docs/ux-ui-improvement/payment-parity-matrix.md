# Payment Dialog Parity Matrix (Phase 0 input to UX-080/081)

Verified against source on `main` (post sprint-11). This is the contract the UnifiedPaymentDialog v2 must reproduce **exactly** per target type. Payload key differences are highlighted — they are NOT bugs to fix silently.

## Variant inventory

| Variant | Target | Data hook / transport | Endpoint | Success behavior |
|---|---|---|---|---|
| `PaymentDialog` | Debt (optionally specific installment) | `useAddPayment()` → financeService `addPayment` | `POST /api/payments` (per service impl) | close; if `res.data.transaction._id` → redirect `/financial/receipts/{id}` |
| `UnifiedPaymentDialog` | Customer total balance | `useCustomerTotalPayment()` → `payCustomerTotal` | `POST /api/customers/{customerId}/pay` | close; same receipt redirect |
| `InvoicePaymentDialog` | Single invoice | raw `fetch('/api/payments')` inside component | `POST /api/payments` | toast 'تم تسجيل الدفعة بنجاح'; close; invalidates queries |
| `InstallmentDialog` | NOT a payment — creates an installment **schedule** | `useCreateInstallments()` | installments create endpoint | close after schedule creation; shows per-installment amount preview (`remainingAmount / count`) |
| `AddTransactionDialog` | Treasury manual entry (income/expense) | separate transaction mutation | transactions endpoint | toast + close |

## Field & payload parity

| Aspect | PaymentDialog (debt) | UnifiedPaymentDialog (customer) | InvoicePaymentDialog (invoice) |
|---|---|---|---|
| Amount default | `debt.remainingAmount`; if scheduled debt → pending installment amount, else remaining | `totalBalance` | invoice remaining (check open effect) |
| Method field | ✅ select, default `cash` | ✅ select, default `cash` | ✅ default `cash` |
| Note field label/key | textarea, payload key **`notes`** | textarea, payload key **`note`**, auto-filled `تحصيل دفعة من الرصيد الإجمالي للعميل: {name}` | payload key **`note`** |
| Extra payload keys | `debtId`, `amount` (parseFloat) | `customerId` in URL path; `{amount, method, note}` body | `invoiceId`, `amount`, `method`, `note` |
| Auto note (scheduled) | `سداد القسط المستحق بتاريخ {ar-EG date}` | — | — |
| Validation | amount required > 0 (button disabled) | same | same + pending guard |

## Entry points today
- `PaymentDialog`: customers page, debt-center page, debt-center/[id]
- `UnifiedPaymentDialog`: customers page, customer detail (CustomerClient), debt-center page
- `InvoicePaymentDialog`: customers page only
- `InstallmentDialog`: customers page (+detail)
- `AddTransactionDialog`: financial page only

## v2 design contract (UX-080)
One component `UnifiedPaymentDialog` with prop `target`:
```js
{ kind: 'debt', debt, targetInstallmentId }
{ kind: 'customer-total', customerId, customerName, totalBalance }
{ kind: 'invoice', invoice }
```
Rules:
1. Preserve each column's exact payload keys (`notes` vs `note`) and endpoints.
2. Keep receipt-redirect behavior for debt/customer targets; keep toast+invalidation behavior for invoice target (or unify to receipt redirect ONLY if both already redirect — invoice does not; therefore keep per-kind success behavior).
3. InstallmentDialog is out of scope of payment unification (different action) — becomes a Drawer in UX-082 but keeps its own task.
4. AddTransactionDialog stays separate (treasury entry ≠ collection).
5. Deletion of legacy variants only after this matrix is re-verified by manual script per entry point × role.

## Manual test script (per entry point)
1. Open dialog from each listed entry point.
2. Verify pre-filled amount matches variant rules above.
3. Submit cash payment → verify network payload byte-parity with baseline (devtools).
4. Verify success behavior (receipt redirect vs toast).
5. Repeat as warehouse-role where permitted (payment views are financial:view gated).
