# FE-TEST-002 — Critical Flow Tests

## Sprint
Sprint 09

## Branch
feat/frontend-sprint-09-testing

## Priority
P1

## Severity
HIGH (TEST-001)

## Objective
Cover the highest-risk flows: auth session, RoleGate, invoice items totals, notification gating.

## Problem
Zero meaningful coverage; the program's riskiest fixes (session shape, role checks, polling gate) are unguarded.

## Evidence
14-testing-audit.md priority table.

## Root Cause
No suite.

## Scope
### In Scope
- Unit: useUserRole (user shape, isLoggedOut), permissions `can()` matrix.
- Component: RoleGate renders per role; ConfirmDialog blocks until confirm.
- Hook/flow: useInvoiceItems totals math; useNotifications enabled-gating by session.
### Out of Scope
Full page integration tests.

## Affected Files
- new test files mirroring source locations

## Implementation Steps
1. Permissions matrix test (fastest, locks AUTH-002).
2. useUserRole + notifications gating tests.
3. RoleGate + ConfirmDialog component tests via harness.
4. Invoice totals unit tests.

## Dependencies
FE-TEST-001.

## Risks
None.

## Testing Requirements
All green <60s total.

## Acceptance Criteria
- [ ] Listed targets covered and green

## Definition of Done
Standard DoD.

## Related Findings
TEST-001 · **Related Tasks:** FE-AUTH-002, FE-STATE-001, FE-DATA-004
