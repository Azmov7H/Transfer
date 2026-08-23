# FE-CLEAN-002 — Delete Dead Modules

## Sprint
Sprint 10

## Branch
feat/frontend-sprint-10-cleanup

## Priority
P2

## Severity
MEDIUM (CLEAN registry)

## Objective
Remove all verified-dead code with final re-verification.

## Problem
Dead backend layer and orphan components mislead contributors and carry risk (`lib/auth.js` throws at import if JWT_SECRET missing).

## Evidence
17-code-quality-audit.md registry CLEAN-D1…D8 with import verification.

## Root Cause
Backend repo split left orphans.

## Scope
### In Scope
Delete after re-grepping importers:
- `src/lib/auth.js`, `src/lib/cache.js`, `src/lib/cache-config.js`, `src/lib/api-response.js`
- `src/components/ThemeToggle.jsx`, `src/components/themes/Toggle.jsx`
- `AuthService.handleGoogleCallback`
- VERIFY-resolved items: `useMutationLock.js` (if unused), `ui/sidebar.jsx` unused exports, `components/Logo/Logo.jsx` (if unimported), exportService (per FE-PERF-001 decision)
### Out of Scope
Commented-out lines (FE-CLEAN-003); dependency removals (FE-DEP-001).

## Affected Files
As listed.

## Implementation Steps
1. Re-run import greps (code may have changed since audit).
2. Delete in logical commits per cluster.
3. Full gates + smoke test.

## Dependencies
Sprints 02–09 merged; FE-PERF-001 decision made.

## Risks
Low — every deletion is import-verified.

## Testing Requirements
`pnpm run build` catches any missed dynamic reference.

## Acceptance Criteria
- [ ] Registry items deleted or explicitly retained with reason

## Definition of Done
Standard DoD.

## Related Findings
ARCH-003, COMP-002(dead) · **Related Tasks:** FE-PERF-001, FE-DEP-001
