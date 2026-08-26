# 09 — Forms UX Standard

## Problem
1. Two coexisting patterns: react-hook-form+zodResolver (`CustomerFormDialog`, `ProductFormDialog`) vs hand-rolled `useState` forms everywhere else — different error presentation, label styles, submit flows.
2. Required fields unmarked or inconsistently marked; validation appears only as toast at submit in hand-rolled forms (user learns errors late, at the end).
3. Field ordering not grouped by meaning (e.g., payment fields interleaved with identity fields on some dialogs).
4. Cancel semantics vary: some close immediately discarding input without the unsaved-guard used on pages.
5. Success feedback inconsistent: toast vs dialog-close vs navigation.

## Current Behavior
Validation logic lives in service-layer validators (`src/lib/validators.js`, Arabic messages) and ad-hoc checks inside components. Business rules themselves are NOT duplicated in UI except where pre-submit checks exist — these must be preserved verbatim.

## Proposed UX/UI — one standard form kit

### Layout standard
```
Dialog/Drawer body:
  [Group 1 title — optional]
    field row (label above input; hint text-xs muted below; error text-xs destructive with aria-describedby)
  [Group 2 …]
Footer: [secondary: إلغاء] …… [primary: فعل الحفظ]   (RTL order; destructive actions styled destructive)
Required: asterisk-free convention — mark OPTIONAL fields "(اختياري)" instead; Arabic-first pattern.
```

### Interaction rules
1. Validate on blur + on submit; never block typing.
2. Errors inline per-field **and** summarized focus-first on submit attempt; toasts only for server-side failures.
3. Submit button shows spinner + disabled while pending; double-submit already guarded (keep).
4. Unsaved-changes guard (`useUnsavedGuard`) applied to any drawer/page form; short dialogs may close-with-confirm using ConfirmDialog when dirty.
5. Conditional fields animate-in without layout jump; conditional requirements re-validated automatically.

### Implementation approach
Introduce `FormField` wrapper composition around existing `ui/field.jsx` primitives + wire zodResolver shim + `lib/validators.js` schemas (they already exist and are tested). Migrate forms incrementally; hand-rolled forms keep their exact validator functions during migration — only presentation changes until parity is proven.

### Priority forms to migrate (by traffic)
| Form | Surface | Notes |
|---|---|---|
| Unified Payment | new (IA-3) | highest frequency |
| Customer add/edit | customers page/detail | already RHF — align visuals |
| Product add/edit | products | already RHF |
| Invoice customer+payment section | /invoices/new | page-level, adapt kit |
| Supplier + debt terms | suppliers | includes numeric terms — tabular inputs |
| Installment plan | drawer | schedule preview required |
| Transaction add | financial | simple |
| User invite/edit | admin users | role select w/ description |

## Business Logic Preservation
- Validator functions/schemas untouched; only where a form currently lacks server-parity client checks do we NOT invent new rules.
- Payload construction code paths preserved per-form (reviewed diff-by-diff).
- Any change to what is validated → `REQUIRES BUSINESS DECISION`.

## Components Affected
`ui/field.jsx`, new `components/forms/FormLayout.jsx` (+ TextField/SelectField wrappers), all feature form dialogs listed above.

## Dependencies
Color/typography tokens (05/06) for label/error styles; IA-3 for unified payment.

## Risks
Medium — forms touch mutation payloads indirectly; mitigation: each migration is its own commit with manual test script of success+failure paths; contract tests exist for validators.

## Acceptance Criteria
Per migrated form:
1. Same fields, same payload, same endpoint.
2. Inline errors appear before submit for client-side rules.
3. Keyboard-only completion possible; errors announced (aria-live polite region).
4. No new/removed business rule (code review checklist item).

## Priority: P1 · Complexity: L overall, M per form

---

## Tasks
| ID | Task | Pri |
|---|---|---|
| UX-060 | Build FormKit (layout, FieldRow, ErrorText, FooterActions) | P1 |
| UX-061 | Migrate customer/product forms' visuals to kit | P2 |
| UX-062 | Migrate transaction add + supplier forms | P2 |
| UX-063 | Invoice page sections adopt kit styling (no RHF rewrite of items manager) | P2 |
| UX-064 | User/settings admin forms to kit | P3 |
| UX-065 | Form parity test checklist doc per migrated form | P2 |
