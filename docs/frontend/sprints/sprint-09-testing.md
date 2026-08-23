# Sprint 09 — Testing & Regression Protection

## Objective
Stand up a working test suite that locks in everything Sprints 00–08 fixed.

## Why This Sprint Exists
The remediation changed the fetcher, auth UX, and page structure. Without tests, the next feature team silently regresses it. Runs after refactors stabilize so tests target final shapes.

## Scope
- Test utilities: QueryClient wrapper, api-module mock, render helper.
- Unit tests: api-utils (dedup/timeout/unwrap/401), useUserRole, permissions `can()`.
- Component tests: RoleGate, ConfirmDialog trigger, one form via adapter.
- Flow tests: invoice items totals; notification polling gating.
- Fix and extend validators schema tests.

## Out of Scope
E2E framework adoption (documented as future work in Sprint 11); coverage percentage targets.

## Branch
`feat/frontend-sprint-09-testing`

## Findings Addressed
TEST-001

## Tasks
- FE-TEST-001 — Test infrastructure (`tasks/testing/FE-TEST-001-infra.md`)
- FE-TEST-002 — Critical flow tests (`tasks/testing/FE-TEST-002-critical-flows.md`)
- FE-TEST-003 — Regression lock tests (`tasks/testing/FE-TEST-003-regression.md`)

## Dependencies
Sprints 02–05 (tests assert post-fix behavior).

## Implementation Order
1. FE-TEST-001
2. FE-TEST-002
3. FE-TEST-003

## Validation
```bash
pnpm test            # all green
pnpm run lint && pnpm run build
```

## Acceptance Criteria
- Every HIGH-severity fix from Sprints 02–04 has at least one asserting test.
- Suite runs <60s locally.
- README documents how to run and where helpers live.

## Definition of Done
Standard DoD.

## Expected Result
Regression protection proportional to the highest-risk fixes.
