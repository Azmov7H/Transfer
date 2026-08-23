# Sprint 10 — Code Cleanup & Dependency Hygiene

## Objective
Remove verified dead code and resolve remaining dependency redundancy.

## Why This Sprint Exists
Cleanup is safest last: by now every "is this used?" question has been answered by the preceding sprints' work.

## Scope
- Delete verified-dead modules (registry below) after final re-verification.
- Resolve `useMutationLock` and `ui/sidebar.jsx` VERIFY items.
- Dependency decisions executed: chart-lib leftover removal (post FE-PERF-002), dotenv, animate-plugin duplicate, react-hook-form status per FORM-001 rollout outcome.
- Remove commented-out code blocks.
- Run `pnpm audit`; address actionable advisories with documented risk.

## Out of Scope
Any behavior change; TypeScript migration; Tailwind 4 upgrade.

## Branch
`feat/frontend-sprint-10-cleanup`

## Findings Addressed
CLEAN-D1…D8, CLEAN-002, DEP-001, DEP-002

## Tasks
- FE-CLEAN-002 — Dead module deletion (`tasks/cleanup/FE-CLEAN-002-dead-modules.md`)
- FE-DEP-001 — Dependency resolution (`tasks/cleanup/FE-DEP-001-dependency-resolution.md`)
- FE-CLEAN-003 — Commented code removal (`tasks/cleanup/FE-CLEAN-003-commented-code.md`)

## Dependencies
Sprints 02–09 complete (especially FE-PERF-001/002 and FE-FORM-001 outcomes).

## Implementation Order
1. FE-CLEAN-003 (trivial)
2. FE-CLEAN-002
3. FE-DEP-001

## Validation
```bash
pnpm install && pnpm run lint && pnpm test && pnpm run build
grep -rn "lib/auth\|cache-config\|api-response" src  # zero hits
```
Manual: smoke test login → dashboard → one invoice flow.

## Acceptance Criteria
- All SAFE registry items deleted; VERIFY items resolved with recorded decisions.
- No package in dependencies lacks a runtime import (or has a documented reason).
- `pnpm audit` output recorded; criticals resolved or risk-accepted in writing.

## Definition of Done
Standard DoD.

## Expected Result
Minimal dependency surface; no dead weight for future contributors to trip on.
