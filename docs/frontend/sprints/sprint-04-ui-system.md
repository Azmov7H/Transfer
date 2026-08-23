# Sprint 04 — Core Components & UI Consistency

## Objective
Establish the shared UI toolkit later sprints compose from: one product selector, one form pattern, Radix confirmations, and standardized loading/empty/error primitives.

## Why This Sprint Exists
God-page decomposition (Sprint 05) would otherwise replicate today's inconsistencies into new files. Build the standard first.

## Scope
- Merge three product selectors into one parameterized component.
- Define + pilot RHF+zod adapter pattern on CustomerFormDialog and ProductFormDialog.
- Replace all native `alert`/`confirm` with AlertDialog-based `ConfirmDialog`.
- Apply LoadingState/ErrorState/EmptyState across shared components; define EmptyState primitive.
- Design-token pass: hardcoded colors/inline styles → tokens (worst offenders only).

## Out of Scope
Page-level decomposition (Sprint 05); remaining dialogs' migration (follows in 05); responsive behavior.

## Branch
`feat/frontend-sprint-04-ui-system`

## Findings Addressed
COMP-001, UX-001, COMP-002, FORM-001 (pilot), CLEAN-D7 resolution

## Tasks
- FE-COMP-001 — Consolidate product selector (`tasks/ux-ui/FE-COMP-001-product-selector.md`)
- FE-FORM-001 — Form pattern pilot (`tasks/ux-ui/FE-FORM-001-form-pattern.md`)
- FE-UX-001 — Confirm dialog rollout (`tasks/ux-ui/FE-UX-001-confirm-dialog.md`)
- FE-COMP-002 — State primitives (`tasks/ux-ui/FE-COMP-002-state-primitives.md`)
- FE-UX-002 — Token audit (`tasks/ux-ui/FE-UX-002-token-audit.md`)

## Dependencies
Sprint 02 (mutation/toast policy), Sprint 03 (RoleGate exists for unauthorized states).

## Implementation Order
1. FE-COMP-002 (primitives others consume)
2. FE-UX-001
3. FE-COMP-001
4. FE-FORM-001
5. FE-UX-002

## Validation
```bash
pnpm run lint && pnpm test && pnpm run build
```
Manual: stock movement, purchase order, invoice item flows still pick products correctly; every destructive action shows themed RTL dialog; customer/product forms show inline field errors and cannot double-submit.

## Acceptance Criteria
- Exactly one product selector import remains.
- Zero native alert()/confirm() calls in src.
- Pilot dialogs use the documented form adapter; pattern doc committed.

## Definition of Done
Standard DoD.

## Expected Result
A reusable, consistent component vocabulary ready for page decomposition.

---

## Execution Record

**Branch:** `feat/frontend-sprint-04-ui-system` (stacked on sprint-03)
**Status:** COMPLETE

| Task | Commit | Summary |
|---|---|---|
| FE-COMP-002 | `41924d4` | New `EmptyState`/`TableEmptyState` primitive; DebtorTable + DebtTable migrated; four-state vocabulary API documented as Decision **D11** |
| FE-UX-001 | `670c01c` `fcc19eb` | New `ui/confirm-dialog.jsx` on Radix AlertDialog (RTL, destructive styling, pending state); all 10 native confirm sites migrated; 2 `alert()` sites → toast policy (D10); hook-level confirm removed from useInvoices (list items own their dialog) |
| FE-COMP-001 | `7c3566d` | Unified `products/ProductSelector.jsx` (`multiple`, `showFilters` props) using state primitives; InvoiceItemsManager (multi mode) and StockMovementDialog (single mode) migrated; legacy Modal/Dialog selectors deleted. Purchase-order quick-add dialog kept — it is a creation form, not a selector |
| FE-FORM-001 | `611b7d0` | Pattern doc `docs/frontend/architecture/form-pattern.md`; dependency-free `zodResolver` (@hookform/resolvers has no network access to install); `FormField` + `mapServerFieldErrors` helpers; new `validations/customer.schema.js`; CustomerFormDialog + ProductFormDialog rewritten with inline Arabic errors, noValidate, `isSubmitting` disable |
| FE-UX-002 | `ca9da5e` | Inventory produced; slate hex tokens (`#0f172a`→slate-900, `#1e293b`→slate-800) swept across 17 files incl. top offenders StockMovementDialog/receivables/settings/InvoicePaymentDialog/CustomerDetailsSheet |

**Gates at completion:** lint 0 errors / 55 warnings (baseline), tests 3/3, build green.

**Notes / deviations:**
- `@hookform/resolvers` could not be installed (no network in environment); a ~20-line contract-compatible resolver ships in `components/forms/zodResolver.js`. Swap for the official package when registry access exists.
- ProductFormDialog parent contract changed (`formData/setFormData` → `defaultValues/onSubmit(values)`); useProductPage handlers updated accordingly.
- Remaining hex occurrences are intentional: stored invoice-branding data values, print-stylesheet internals, chart border colors (deferred to FE-PERF-002), login brand gradient.

**Follow-ups filed for later sprints:**
- ESLint rule restricting hardcoded colors outside globals.css — documented suggestion, blocked until palette usage is 100% consistent (Sprint 10/11).
- Remaining dialogs migrate onto form pattern during Sprint 05 decompositions.
