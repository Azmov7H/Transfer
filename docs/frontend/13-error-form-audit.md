# 13 — Error Handling & Forms Audit

## Error Handling

### ERR-001 — No Global Recovery Surfaces (CRITICAL)
Covered in 03-next-react-audit.md. Root `error.jsx`, `global-error.jsx`, `not-found.jsx` absent; `ErrorBoundary.jsx` unmounted.

### ERR-002 — Three Competing Error Channels (MEDIUM)
1. Sonner toasts (hook-level, e.g. `useCustomers.js:24-26`)
2. Native `alert()` (`financial/page.jsx:104`)
3. Silent `console.error` only (invoice detail page ×5, audit page ×3 — user sees nothing)
Policy needed: API errors → toast with Arabic message from `JammazApiError.message`; unexpected render errors → error boundary; validation → inline field errors. Remediation FE-DATA-003.

### ERR-003 — Fetcher JSON Guard Is Good (INFO)
`api-utils.js:110-115` catches non-JSON responses and normalizes to a failure object; `JammazApiError.isValidationError/isUnauthorized` helpers exist but are barely consumed — wire them into the FE-AUTH-001/FE-DATA-003 work.

## Forms

### FORM-001 — react-hook-form + zod Installed, Zero Adoption (HIGH)
- `grep react-hook-form src` → **0 files** despite being in dependencies.
- zod schemas exist (`validations/product.schema.js`, `validators.js`) but are imported **only by the broken test file** — no form consumes them.
- Every dialog hand-rolls: `useState` per field + bespoke submit handlers + ad-hoc required checks. Examples: `CustomerFormDialog.jsx` (254 ln), `ProductFormDialog.jsx` (246 ln), `SupplierFormDialog.jsx` (214 ln), `UserFormDialog.jsx`, all financial dialogs.
Consequences:
- Inconsistent validation timing/messages; no field-level error wiring standard.
- Double-submit protection is accidental (DATA-001 dedup quirk) rather than designed.
- Server-side field errors (`JammazApiError.data`) have no standard mapping path.
Remediation: FE-FORM-001 establishes an RHF+zod adapter pattern and pilots it on two dialogs; rollout continues through Sprint 05 page decompositions; leftovers removed in Sprint 10 (decision recorded there).

### FORM-002 — Unsaved-Changes Guards Absent (MEDIUM)
No `beforeunload` / route-leave confirmation on invoice creation or any multi-field dialog. VERIFY each flow during Sprint 05; add guard to invoice/new at minimum.
