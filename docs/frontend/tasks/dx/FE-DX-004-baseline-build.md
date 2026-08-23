# FE-DX-004 — Baseline Build Verification

## Sprint
Sprint 00

## Branch
feat/frontend-sprint-00-baseline

## Priority
P0

## Severity
HIGH (gate for entire program)

## Objective
Prove the production build succeeds post-tooling-fixes and record baseline metrics.

## Problem
Build was never executed during audit; with lint/test broken, build health is unknown.

## Evidence
18-dx-build-audit.md — build marked NOT RUN/VERIFY.

## Scope
### In Scope
- Run `pnpm run build`; fix any build-blocking issues that are pure tooling/config (not app refactors).
- Record route-size table + warnings as the program baseline.
### Out of Scope
Performance optimization (Sprint 08); fixing deprecation warnings beyond blockers.

## Affected Files
- Possibly `next.config.mjs` if config-level blocker appears
- `docs/frontend/sprints/sprint-00-baseline.md` (record metrics)

## Implementation Steps
1. `pnpm run build` on clean install.
2. If failure: classify (config vs code). Config → fix here. Code → file finding, assess whether it predates program.
3. Save full route-size output into PR description.

## Dependencies
FE-CLEAN-001, FE-DX-001, FE-DX-002

## Risks
Unknown latent build errors could expand scope — timebox triage, escalate real code issues as findings.

## Testing Requirements
Build exits 0 twice consecutively.

## Acceptance Criteria
- [ ] Build green from clean checkout
- [ ] Baseline sizes recorded in Sprint 00 docs

## Definition of Done
Standard DoD.

## Related Findings
DX-001 · **Related Tasks:** all Sprint 00 tasks
