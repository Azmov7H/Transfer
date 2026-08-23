# FE-STATE-001 — useUserRole Correctness & Config Alignment

## Sprint
Sprint 02

## Branch
feat/frontend-sprint-02-data-state

## Priority
P1

## Severity
MEDIUM (STATE-001, STATE-002)

## Objective
Make session-shape handling explicit and align query config with global defaults.

## Problem
`useUserRole.js:22-27` — dead variables + a comment describing an unwrap that already happened in `api-utils.js:126-128`; works only by accident. Also overrides `refetchOnWindowFocus: true` / `staleTime: 5min` against global defaults without documented reason.

## Evidence
findings/medium.md STATE-001; code cited above.

## Root Cause
Copy-paste evolution without understanding the fetcher contract.

## Scope
### In Scope
- Simplify to `const user = data ?? null`.
- Remove misleading comments and dead vars; remove noisy console lines (coordination: FE-SEC-001 removes logging — do not duplicate work; this task fixes shape only if SEC lands first, otherwise both here).
- Document or normalize staleTime/refetchOnWindowFocus choice in one sentence.
### Out of Scope
Session endpoint contract (backend); RoleGuard (Sprint 03).

## Affected Files
- `src/hooks/useUserRole.js`

## Implementation Steps
1. Rewrite data extraction honestly per actual fetcher output.
2. Add explanatory comment on the real shape (`data` IS the user object).
3. Align or document query options.

## Dependencies
FE-DATA-001 (fetcher semantics confirmed first).

## Risks
If any consumer depended on wrapper-shaped `data`, fix consumers — grep confirms consumers use `user`/`role` only.

## Testing Requirements
Sprint 09 unit test locks this; manual: login → role visible; logout state → isLoggedOut true.

## Acceptance Criteria
- [ ] No dead variables/misleading comments
- [ ] All consumers still function (Header, users page, audit page, UserFormDialog)

## Definition of Done
Standard DoD.

## Related Findings
STATE-001 · **Related Tasks:** FE-AUTH-002, FE-TEST-002
