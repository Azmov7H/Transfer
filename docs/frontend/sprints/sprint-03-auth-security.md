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

---

## Execution Record

**Branch:** `feat/frontend-sprint-03-auth-security` (stacked on sprint-02)
**Status:** COMPLETE

| Task | Commit | Summary |
|---|---|---|
| FE-SEC-001 | `fcd46eb` | Removed middleware path+token-presence and userId+role logs; removed login response dump; kept payload-free error warns. `useUserRole` already clean via FE-STATE-001 |
| FE-AUTH-001 | `de1f36a` | Fetcher 401 → single hard redirect to `/login?expired=1` (`window.location.replace`, guarded by module flag + `/login` path check; `/api/auth/*` excluded); 403 never redirects. Hard navigation clears React Query cache implicitly. Login page shows Arabic expired-session notice |
| FE-AUTH-002 | `25451af` | New `<RoleGate permission|roles>` consuming cached session; wrapped `(finance)` + `(operations)` layouts and users/settings/logs/audit pages; phantom `'admin'` removed — audit adjust now owner+manager, page view adds warehouse; permissions lib gained `can` alias + `hasRole`; all raw string comparisons migrated to ROLES constants (`Header`, `useSidebarLogic`, `useProductPage`, `UserFormDialog`, `users/page`) |
| FE-SEC-002 | `e16ff8a` | innerHTML swap + reload replaced by scoped print CSS (`body.printing-partner-transactions #print-area` visibility pattern in globals.css); dialog state survives printing |
| FE-SEC-003 | `e1bbb77` | `window.open(..., 'noopener,noreferrer')` |

**Gates at completion:** lint 0 errors / 55 warnings (54 baseline + 1 new `set-state-in-effect` from the expired-banner effect on login page), tests 3/3, build green.

**Notes / deviations:**
- `(admin)` group NOT gated at layout level: it mixes audiences (audit is stock-facing for warehouse; users/settings are manager+owner). Pages gated individually instead.
- Audit page deep-link gate allows owner+manager+warehouse (stock roles); the adjust action stays owner+manager per task intent.
- Redirect uses `location.replace` over `location.href`: avoids back-button trap into expired app and dodges a false-positive `no-location-assign-relative-destination` warning.
- 401 redirect does not clear React Query cache explicitly — full document reload destroys all client state, making an import of QueryClient into the fetcher unnecessary.

**Follow-ups filed for later sprints:**
- Backend authorization enforcement unverified — documented as Frontend Integration Issue (client gates are UX only).
- Manager role lacks `audit:manage` in PERMISSIONS matrix while physical-inventory nav requires it — matrix review deferred to Sprint 11 hardening.
- New tracked lint warning: login page expired-banner `set-state-in-effect` (same class as existing baseline).
