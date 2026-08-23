# Sprint 11 — Final Hardening

## Objective
Prove the whole program: every gate green from a clean checkout, findings registry closed, documentation truthful.

## Why This Sprint Exists
Programs drift; the final sprint re-validates end-to-end and closes the loop on the audit that started it.

## Scope
- Full validation pass on clean clone (fresh pnpm install → lint/test/build).
- Re-run key audit greps (security patterns, dead imports, aria-labels) — record deltas vs this audit.
- Update findings registry statuses; write closure notes.
- Optional (documented decision): minimal CI workflow; Playwright introduction plan.

## Out of Scope
New fixes discovered during validation go to a new finding + backlog sprint, not scope-creep here.

## Branch
`feat/frontend-sprint-11-hardening`

## Findings Addressed
All — closure verification

## Tasks
- FE-DX-005 — Clean-checkout gate run (`tasks/dx/FE-DX-005-clean-gates.md`)
- FE-ARCH-003 — Audit re-run & registry closure (`tasks/architecture/FE-ARCH-003-audit-closure.md`)

## Dependencies
All previous sprints.

## Implementation Order
1. FE-DX-005
2. FE-ARCH-003

## Validation
```bash
git clone <repo> /tmp/opencode/jammaz-verify && cd /tmp/opencode/jammaz-verify
pnpm install --frozen-lockfile && pnpm run lint && pnpm test && pnpm run build
```
Plus manual smoke of the three golden flows: login, invoice create+print, debt payment.

## Acceptance Criteria
- All gates exit 0 from clean clone.
- Findings registry shows status per finding (fixed/verified/deferred-with-reason).
- No HIGH/CRITICAL finding remains open.

## Definition of Done
Standard DoD + closure report in `docs/frontend/findings/README.md`.

## Expected Result
A verified, documented, maintainable frontend baseline.
