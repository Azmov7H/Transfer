# FE-AUTH-002 — RoleGate Component & Phantom Role Fix

## Sprint
Sprint 03

## Branch
feat/frontend-sprint-03-auth-security

## Priority
P0

## Severity
HIGH (AUTH-002)

## Objective
Uniform, correct, client-side authorization UX for role-restricted surfaces.

## Problem
1. `audit/page.jsx:18` checks `role === 'admin'` — `'admin'` is not in ROLES (owner/manager/cashier/warehouse/viewer) → condition can never be true.
2. Role checks are hand-rolled per page (`users/page.jsx:16-17`) with inconsistent shapes.
3. Middleware authenticates only; deep links render restricted pages until data calls fail.

## Evidence
findings/high.md AUTH-002; permissions.js ROLES block.

## Root Cause
No shared guard; roles compared as raw strings.

## Scope
### In Scope
- `<RoleGate permission|roles>` component: renders children / unauthorized state / nothing, consuming the cached session query (zero extra requests).
- Wrap `(admin)` group content and other sensitive pages.
- Replace all stringly-typed comparisons with `can(role, permission)` from `lib/permissions.js`; fix phantom 'admin'.
- Unauthorized state UI consistent with FE-COMP-002 primitives.
### Out of Scope
Middleware-level authorization mapping (document as Frontend Integration Issue if backend enforcement unconfirmed); navigation filtering logic beyond reuse.

## Affected Files
- new `src/components/auth/RoleGate.jsx`
- `(admin)/**` pages, `users/page.jsx`, `audit/page.jsx`, `settings/page.jsx`, UserFormDialog

## Implementation Steps
1. Build RoleGate with loading + unauthorized + children states.
2. Fix audit page's impossible condition to intended role set (confirm intent: likely manager+owner).
3. Sweep grep `role ===` and migrate.

## Dependencies
FE-STATE-001 (session shape), Sprint 02 merged.

## Risks
Wrong permission mapping could lock managers out — verify each page's intended audience before wrapping; keep backend enforcement assumption documented.

## Testing Requirements
Matrix test per role × protected page; Sprint 09 component test on RoleGate.

## Acceptance Criteria
- [ ] Zero raw `role === 'string'` outside permissions lib
- [ ] Every restricted surface renders a defined unauthorized state
- [ ] Phantom role removed

## Definition of Done
Standard DoD.

## Related Findings
AUTH-002 · **Related Tasks:** FE-STATE-001, FE-COMP-002, FE-TEST-002
