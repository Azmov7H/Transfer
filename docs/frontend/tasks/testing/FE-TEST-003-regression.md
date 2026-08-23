# FE-TEST-003 — Regression Lock Tests (Fetcher)

## Sprint
Sprint 09

## Branch
feat/frontend-sprint-09-testing

## Priority
P1

## Severity
HIGH (TEST-001 + locks DATA/AUTH fixes)

## Objective
Unit-test the fetcher so its fixed semantics can never silently regress.

## Problem
`api-utils.js` received the program's most behavior-critical changes (dedup inversion DATA-001, timeout DATA-002, 401 redirect AUTH-001) with no tests.

## Evidence
06-data-layer-audit.md; 14-testing-audit.md.

## Root Cause
No suite existed when bugs were found.

## Scope
### In Scope
- fetcher unit tests with mocked global fetch: envelope unwrapping, error throw w/ status, GET dedup, mutation non-dedup, timeout firing, 401 → redirect invoked once, 403 → no redirect.
- Fix/extend validators.test.js schemas coverage.
### Out of Scope
Integration with real backend.

## Affected Files
- new `src/lib/api-utils.test.js`
- `src/lib/validators.test.js` extension

## Implementation Steps
1. Mock fetch + timers; write case matrix.
2. Assert redirect via mocked window.location assignment pattern used by implementation.

## Dependencies
FE-DATA-001/002, FE-AUTH-001 merged.

## Risks
Implementation details (redirect mechanism) may need small refactor for testability — allowed, note in PR.

## Testing Requirements
Case matrix green; mutation of any guarded line breaks suite (spot-check one).

## Acceptance Criteria
- [ ] Full fetcher case matrix covered

## Definition of Done
Standard DoD.

## Related Findings
TEST-001 · **Related Tasks:** FE-DATA-001, FE-DATA-002, FE-AUTH-001
