# FE-SEC-001 — Sensitive Log Scrub

## Sprint
Sprint 03

## Branch
feat/frontend-sprint-03-auth-security

## Priority
P1

## Severity
HIGH (SEC-001)

## Objective
No user-identifying or session payloads in logs at any runtime.

## Problem
- `middleware.js:23` logs every path + token presence; `:30` logs userId+role per request. Middleware runs on edge runtime — `removeConsole` build option does NOT strip it.
- `login/page.jsx:31` logs entire login response; `useUserRole.js:10` logs session object on every fetch.

## Evidence
findings/high.md SEC-001 table.

## Root Cause
Debug logging left from development.

## Scope
### In Scope
Remove/downgrade the four sensitive sites (keep error-path warns without payloads). Optionally introduce a tiny gated logger (`if (NODE_ENV!=='production')`) for future debugging.
### Out of Scope
Benign console.error clusters (invoice detail etc.) — addressed opportunistically by FE-DATA-003 policy.

## Affected Files
- `src/middleware.js`, `src/app/(public)/login/page.jsx`, `src/hooks/useUserRole.js`

## Implementation Steps
1. Strip payload logging; keep minimal operational messages.
2. Grep-verify: no log statements include token/userId/role/response objects.

## Dependencies
Coordinate with FE-STATE-001 (same file) to avoid conflicts — do whichever merges first; rebase.

## Risks
Loss of debuggability → the gated dev logger compensates.

## Testing Requirements
Grep audit + manual login flow with console open.

## Acceptance Criteria
- [ ] Zero sensitive values logged in production runtime including middleware

## Definition of Done
Standard DoD.

## Related Findings
SEC-001 · **Related Tasks:** FE-STATE-001, FE-DATA-003
