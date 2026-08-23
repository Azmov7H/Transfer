# FE-TEST-001 — Test Infrastructure

## Sprint
Sprint 09

## Branch
feat/frontend-sprint-09-testing

## Priority
P1

## Severity
HIGH (TEST-001)

## Objective
Reusable test utilities so flow tests are cheap to write.

## Problem
Testing Library is installed but unused; no helpers exist; mocking strategy undefined.

## Evidence
14-testing-audit.md.

## Root Cause
Infra never established beyond next/jest wiring.

## Scope
### In Scope
- `src/test/` helpers: `renderWithProviders` (QueryClient fresh per test, ThemeProvider, Router mock), `mockApi` (jest.mock of `@/lib/api-utils` with typed-ish fixture helpers).
- Document usage in README section.
### Out of Scope
MSW adoption (evaluate later); E2E.

## Affected Files
- new `src/test/*`
- `docs/frontend/` or root README testing section

## Implementation Steps
1. Build renderWithProviders with per-test QueryClient (retry off).
2. Build api mock helper returning `{success,data}` envelope shapes.
3. Write one canary test proving the harness works.

## Dependencies
Sprints 02–05 merged (tests assert final shapes).

## Risks
None.

## Testing Requirements
Canary test green in CI-less local run.

## Acceptance Criteria
- [ ] Helpers exist and documented
- [ ] Canary passes

## Definition of Done
Standard DoD.

## Related Findings
TEST-001 · **Related Tasks:** FE-TEST-002, FE-TEST-003
