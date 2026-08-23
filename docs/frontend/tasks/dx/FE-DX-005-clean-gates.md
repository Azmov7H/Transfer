# FE-DX-005 — Clean-Checkout Gate Run

## Sprint
Sprint 11

## Branch
feat/frontend-sprint-11-hardening

## Priority
P1

## Severity
HIGH (program closure gate)

## Objective
Prove every quality gate passes from a pristine clone.

## Problem
Program changes span 11 sprints; drift or environment assumptions may have crept in.

## Evidence
Program definition (sprint-11).

## Root Cause
n/a — verification task.

## Scope
### In Scope
Fresh clone → `pnpm install --frozen-lockfile` → lint → test → build, all exit 0. Manual golden-flow smoke: login → dashboard → invoice create+print → debt payment.
### Out of Scope
New fixes (file findings instead).

## Affected Files
None (or docs updates recording results).

## Implementation Steps
1. Clone to /tmp/opencode; run gates.
2. Execute smoke flows against dev server + backend.
3. Record results.

## Dependencies
All sprints.

## Risks
Discoveries here spawn findings for a follow-up backlog, not scope growth.

## Testing Requirements
The run itself is the test.

## Acceptance Criteria
- [ ] All gates exit 0 clean-checkout
- [ ] Smoke flows pass

## Definition of Done
Results recorded in sprint file.

## Related Findings
DX-001 closure · **Related Tasks:** FE-ARCH-003
