# FE-CLEAN-001 — Resolve Package-Manager Ambiguity

## Sprint
Sprint 00

## Branch
feat/frontend-sprint-00-baseline

## Priority
P0

## Severity
CRITICAL (component of DX-001)

## Objective
One package manager, one lockfile, reproducible installs.

## Problem
Git tracks `package-lock.json`; the on-disk install is pnpm (`node_modules/.pnpm/*`); untracked `pnpm-lock.yaml` and `pnpm-workspace.yaml` exist; no `packageManager` field. Mixed state likely contributes to the ESLint crash.

## Evidence
Audit of repo root + `node_modules` layout; pnpm-workspace.yaml contains only `allowBuilds`, no workspace packages.

## Root Cause
Developers used different managers without policy.

## Scope
### In Scope
- Standardize on **pnpm**.
- Commit regenerated `pnpm-lock.yaml`; delete `package-lock.json`.
- Add `"packageManager": "pnpm@<version>"` to package.json.
- Decide fate of `pnpm-workspace.yaml` (delete if not using workspaces; keep only if allowBuilds entries are needed).
### Out of Scope
Dependency version changes.

## Affected Files
- `package.json`, lockfiles, possibly `pnpm-workspace.yaml`

## Implementation Steps
1. Delete `node_modules`; `pnpm install` fresh.
2. Verify app boots (`pnpm run dev`) before proceeding.
3. Remove npm lockfile from git; commit pnpm lockfile.
4. Add `packageManager` field with exact pinned version.
5. Document in README: install = `pnpm install`.

## Dependencies
None (first task of program).

## Risks
Fresh resolution may bump transitive versions → verify build immediately after.

## Testing Requirements
`pnpm install --frozen-lockfile` succeeds twice consecutively; dev server boots.

## Acceptance Criteria
- [ ] Single lockfile tracked
- [ ] packageManager pinned
- [ ] Fresh clone installs and builds

## Definition of Done
Standard DoD.

## Related Findings
DX-001 · **Related Tasks:** FE-DX-001, FE-DX-002, FE-DX-004
