# FE-FORM-001 — RHF + zod Form Pattern (Pilot)

## Sprint
Sprint 04

## Branch
feat/frontend-sprint-04-ui-system

## Priority
P1

## Severity
HIGH (FORM-001)

## Objective
Establish and pilot the standard form implementation: react-hook-form + existing zod schemas, explicit double-submit protection, server field-error mapping.

## Problem
react-hook-form: zero imports despite being installed; zod consumed by nothing but a broken test. ~10 dialogs hand-roll per-field useState validation with inconsistent timing/messages and accidental double-submit protection only via DATA-001 quirk.

## Evidence
13-error-form-audit.md FORM-001.

## Root Cause
Libraries added aspirationally; pattern never established.

## Scope
### In Scope
- `src/components/forms/FormAdapter` conventions doc + thin helpers (RHF Controller ↔ shadcn inputs, zodResolver wiring).
- Pilot migration: `CustomerFormDialog.jsx`, `ProductFormDialog.jsx` (reuse `validations/product.schema.js`).
- Explicit `isSubmitting` disable on submit button.
- Map `JammazApiError.data` field errors onto form fields.
### Out of Scope
Remaining dialogs (migrate opportunistically during Sprint 05 decompositions); schema authoring for domains lacking them (create as needed during pilots).

## Affected Files
- new `src/components/forms/*`
- `CustomerFormDialog.jsx`, `ProductFormDialog.jsx`

## Implementation Steps
1. Write pattern doc (ADR appendix) with one canonical example.
2. Build helpers.
3. Migrate customer dialog → verify against current behavior parity.
4. Migrate product dialog using existing schema.

## Dependencies
FE-DATA-003 (error surfacing), FE-DATA-001 (mutation semantics now explicit).

## Risks
Behavior drift in validation timing — accept stricter client validation where schemas already define it.

## Testing Requirements
Manual: invalid submit shows inline Arabic errors; double-click cannot double-post; Sprint 09 adds adapter test.

## Acceptance Criteria
- [ ] Two dialogs on the documented pattern
- [ ] Double-submit impossible by construction

## Definition of Done
Standard DoD.

## Related Findings
FORM-001 · **Related Tasks:** FE-DATA-001, FE-PAGES-001..004 (rollout), FE-TEST-002
