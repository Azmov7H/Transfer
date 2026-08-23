# Sprint 00 — Baseline & Safety

## Objective
Make the three validation gates (lint, test, build) executable and deterministic, and eliminate the package-manager split-brain. Nothing else can be verified until this lands.

## Why This Sprint Exists
`npm run lint` crashes, `npm test` fails, and two lockfiles describe two different installs. Every Definition of Done in later sprints depends on these gates. This sprint is pure tooling — zero behavior change.

## Scope
- Repair ESLint flat config; make `npm run lint` run clean on the current codebase.
- Repair Jest configuration/module resolution; make the existing validators test pass (fixing the test file itself is allowed).
- Standardize on **pnpm** (matches on-disk reality), commit its lockfile, add `"packageManager"` field, remove npm lockfile, document install command.
- Add keys-only `.env.example`; fix/remove broken `seed` script.
- Run and record a production build as the baseline artifact.

## Out of Scope
Any lint rule tightening beyond making the suite runnable; dependency upgrades; code style auto-fix commits beyond what lint requires to pass.

## Branch
`feat/frontend-sprint-00-baseline`

## Findings Addressed
DX-001, DX-002, DX-003, DEP-003 (partial)

## Tasks
- FE-DX-001 — Fix ESLint flat config (`tasks/dx/FE-DX-001-fix-eslint-config.md`)
- FE-DX-002 — Repair Jest execution (`tasks/dx/FE-DX-002-repair-jest.md`)
- FE-CLEAN-001 — Resolve package-manager ambiguity (`tasks/cleanup/FE-CLEAN-001-package-manager.md`)
- FE-DX-003 — .env.example + script hygiene (`tasks/dx/FE-DX-003-env-example-scripts.md`)
- FE-DX-004 — Baseline build verification record (`tasks/dx/FE-DX-004-baseline-build.md`)

## Dependencies
None. This sprint blocks all others.

## Implementation Order
1. FE-CLEAN-001 (correct install first — likely fixes part of 001)
2. FE-DX-001
3. FE-DX-002
4. FE-DX-003
5. FE-DX-004

## Validation
```bash
pnpm install --frozen-lockfile
pnpm run lint     # exits 0
pnpm test         # exits 0
pnpm run build    # succeeds; record output size summary in PR description
```

## Acceptance Criteria
- All four commands above exit 0 on CI-clean checkout.
- Exactly one lockfile tracked in git; `packageManager` field present.
- `.env.example` lists JWT_SECRET, API_PROXY_TARGET, NEXT_PUBLIC_API_URL with empty values + comments.
- No application behavior changed.

## Definition of Done
Standard DoD (see pr-strategy.md) + this sprint's additions recorded in PR description (lint error count before/after, build output sizes).

## Expected Result
A trustworthy baseline: every subsequent PR can be mechanically validated.
