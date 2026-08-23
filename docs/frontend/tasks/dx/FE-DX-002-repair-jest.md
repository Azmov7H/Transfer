# FE-DX-002 — Repair Jest Execution

## Sprint
Sprint 00

## Branch
feat/frontend-sprint-00-baseline

## Priority
P0

## Severity
CRITICAL (DX-001), HIGH (TEST-001 partial)

## Objective
Make `pnpm test` run the existing suite green.

## Problem
`npm test` fails: jest cannot resolve an extensionless relative import in the only test file (`src/lib/validators.test.js:5` → `../validations/...`).

## Evidence
Jest output: `Cannot find module ... moduleFileExtensions ['js','mjs',...]` (audit run, 18-dx-build-audit.md).

## Root Cause
Extensionless relative import style not resolvable by default under next/jest config; suite never exercised so it rotted.

## Scope
### In Scope
- Fix the import in `validators.test.js` (extensioned or alias).
- Adjust `jest.config.js` only if a resolver-level fix is more general.
### Out of Scope
Writing new tests (Sprint 09).

## Affected Files
- `src/lib/validators.test.js`
- possibly `jest.config.js`

## Implementation Steps
1. Change the offending import to use the `@/validations/...` alias (already mapped in moduleNameMapper) or add `.js`.
2. Run `pnpm test`; ensure zod schema assertions pass (they may reveal real schema issues — record, don't fix schemas here unless assertion is trivially wrong).
3. Confirm watch mode works (`pnpm run test:watch`).

## Dependencies
FE-CLEAN-001

## Risks
Schema may genuinely fail its own sanity test — if so, stop and file a finding rather than weakening assertions.

## Testing Requirements
`pnpm test` exits 0 with 1 passing suite.

## Acceptance Criteria
- [ ] Existing test passes without weakened assertions
- [ ] No production code changed

## Definition of Done
Standard DoD.

## Related Findings
DX-001, TEST-001 · **Related Tasks:** FE-DX-001, FE-TEST-001
