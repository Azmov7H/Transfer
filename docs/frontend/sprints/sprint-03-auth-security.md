# Sprint 03 — Authentication & Frontend Security

## Objective
Handle session expiry end-to-end, make role-based UI consistent and correct, and remove sensitive logging and the innerHTML print hack.

## Why This Sprint Exists
Expiry handling (AUTH-001) is the largest daily UX defect for operators; phantom-role gating (AUTH-002) is a correctness bug; log hygiene closes the top security finding.

## Scope
- Global 401/403 reaction in fetcher → redirect to `/login` with return-path awareness.
- `<RoleGate>` guard component; apply to `(admin)`, `(finance)`, `(operations)` groups + fix `'admin'` phantom role.
- Strip/gate sensitive console output (middleware edge bundle included).
- Replace innerHTML print flow with print stylesheet approach; add noopener.

## Out of Scope
Backend authorization changes (Frontend Integration Issue noted); refresh-token design; form-level auth UX.

## Branch
`feat/frontend-sprint-03-auth-security`

## Findings Addressed
AUTH-001, AUTH-002, SEC-001, SEC-002, SEC-003

## Tasks
- FE-AUTH-001 — Session expiry handling (`tasks/security/FE-AUTH-001-session-expiry.md`)
- FE-AUTH-002 — RoleGate + phantom role fix (`tasks/security/FE-AUTH-002-rolegate.md`)
- FE-SEC-001 — Sensitive log scrub (`tasks/security/FE-SEC-001-log-scrub.md`)
- FE-SEC-002 — Print without innerHTML (`tasks/security/FE-SEC-002-print-fix.md`)
- FE-SEC-003 — window.open hardening (`tasks/security/FE-SEC-003-noopener.md`)

## Dependencies
Sprint 02 (fetcher changes land first to avoid merge conflicts in api-utils.js).

## Implementation Order
1. FE-SEC-001 (isolated, low risk)
2. FE-AUTH-001
3. FE-AUTH-002
4. FE-SEC-002
5. FE-SEC-003

## Validation
```bash
pnpm run lint && pnpm test && pnpm run build
```
Manual: expire/destroy token cookie → next API call lands on /login; cashier deep-links /users → blocked UI not crash; grep src for `console.log` sensitive patterns = 0; partner transaction print works and no reload occurs.

## Acceptance Criteria
- Expired session always terminates at /login within one failed request.
- Role checks all reference `ROLES` constants; zero stringly-typed role comparisons outside permissions lib.
- No userId/role/session payloads logged at any runtime.
- PartnerTransactionDialog prints without unmounting the React tree.

## Definition of Done
Standard DoD.

## Expected Result
Auth failures are recoverable; authorization UI is uniform; security log surface clean.
