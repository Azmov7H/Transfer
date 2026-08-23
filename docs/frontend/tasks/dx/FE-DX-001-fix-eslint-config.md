# FE-DX-001 — Fix ESLint Flat Config

## Sprint
Sprint 00

## Branch
feat/frontend-sprint-00-baseline

## Priority
P0

## Severity
CRITICAL (DX-001)

## Objective
Make `pnpm run lint` execute the full codebase and exit 0.

## Problem
`npm run lint` crashes: `TypeError: Converting circular structure to JSON` thrown by `@eslint/eslintrc` config-validator while normalizing `next/core-web-vitals` through `FlatCompat`.

## Evidence
Full crash trace captured in audit (see docs/frontend/18-dx-build-audit.md); originates in `eslint.config.mjs` FlatCompat usage under a pnpm-layout node_modules.

## Root Cause
Legacy-config compat layer + mixed package-manager install produce an unserializable legacy config object.

## Scope
### In Scope
- Rewrite `eslint.config.mjs` as native flat config (import `next/core-web-vitals` via `eslint-config-next`'s flat export or keep FlatCompat if it works post FE-CLEAN-001 reinstall).
### Out of Scope
Adding new rules beyond making the suite runnable; auto-fix commits of style violations beyond errors blocking exit 0.

## Affected Files
- `eslint.config.mjs`
- possibly `package.json` (lint script args)

## Implementation Steps
1. After FE-CLEAN-001's clean install, re-run lint; if crash persists, replace FlatCompat with native flat import.
2. Run lint; fix remaining *config* errors only.
3. If source lint errors block exit 0, apply `--fix` for safe stylistic rules as one dedicated commit; manually fix any residual errors.

## Dependencies
FE-CLEAN-001 (do after clean pnpm install)

## Risks
Auto-fix churn creating noisy diff → isolate in its own commit.

## Testing Requirements
`pnpm run lint` exits 0; record error/warning counts before/after in PR.

## Acceptance Criteria
- [ ] `pnpm run lint` exits 0 on clean checkout
- [ ] Config uses supported ESLint 9 patterns
- [ ] No unrelated rule changes

## Definition of Done
Standard DoD.

## Related Findings
DX-001 · **Related Tasks:** FE-DX-002, FE-CLEAN-001
