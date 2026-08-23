# FE-AUTH-001 — Session Expiry Handling

## Sprint
Sprint 03

## Branch
feat/frontend-sprint-03-auth-security

## Priority
P0

## Severity
HIGH (AUTH-001)

## Objective
An expired/invalid session always terminates at /login within one failed request, with the user's context preserved.

## Problem
`api-utils.js:103-108` — 401/403 branch is an empty no-op ("Uncomment when routing is ready"). Middleware only guards navigations; in-page expiry leaves users stranded with failing actions.

## Evidence
findings/high.md AUTH-001.

## Root Cause
Redirect intentionally deferred and never implemented.

## Scope
### In Scope
- In fetcher: on 401 → clear React Query cache, hard-redirect to `/login` (client side only). On 403 → do NOT redirect; surface forbidden feedback (role issue, not session).
- Avoid redirect loops: skip when request is to `/api/auth/*` or current path is /login.
- Optional `?expired=1` flag for login page messaging.
### Out of Scope
Token refresh design (Frontend Integration Issue — backend has none visible); RoleGate (FE-AUTH-002).

## Affected Files
- `src/lib/api-utils.js`
- possibly `login/page.jsx` (expired notice)

## Implementation Steps
1. Implement 401 branch with guards against loops.
2. Distinguish 401 vs 403 explicitly.
3. Test with cookie deleted mid-session and with JWT expired (short-lived test token).

## Dependencies
Sprint 02 fetcher work merged first.

## Risks
Over-eager redirect on transient 401s from flaky endpoints — acceptable for this app class; document.

## Testing Requirements
Manual: delete token cookie → next action lands on /login; Sprint 09 adds regression test via mocked fetcher.

## Acceptance Criteria
- [ ] 401 always redirects exactly once
- [ ] 403 shows feedback without logout

## Definition of Done
Standard DoD.

## Related Findings
AUTH-001 · **Related Tasks:** FE-AUTH-002, FE-TEST-003
