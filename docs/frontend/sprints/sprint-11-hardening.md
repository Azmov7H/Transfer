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

---

## Execution Record

**Branch:** `feat/frontend-sprint-11-hardening` (stacked on sprint-10)
**Status:** COMPLETE

### FE-DX-005 — Clean-checkout gates
Fresh clone of pushed `feat/frontend-sprint-10-cleanup` tip (`0223bbe`) into `/tmp/opencode/jammaz-verify`:

| Gate | Result |
|---|---|
| `pnpm install --frozen-lockfile` | exit 0 |
| `JWT_SECRET=x pnpm run lint` | exit 0 (42 warnings) |
| `JWT_SECRET=x pnpm test` | exit 0 — **59 passed / 9 suites** |
| `JWT_SECRET=x pnpm run build` | exit 0 |

**Golden-flow smoke (login → invoice create+print → debt payment): NOT EXECUTABLE in this environment** — backend at `API_PROXY_TARGET` (127.0.0.1:5000) unreachable during validation (connection refused). Flows remain covered indirectly by the unit/contract suite (fetcher matrix, session contract, invoice-items math, notification gating). Manual smoke deferred to the operator's environment; recorded as residual risk.

### FE-ARCH-003 — Audit re-run & closure
Re-ran key scans (results embedded per-finding in `findings/README.md`):
- Sensitive logging: only `err.message` warn in middleware — zero user data ✓ (SEC-001)
- In-app native alert()/confirm(): 0; sole `window.confirm` is deliberate sync blocking in useUnsavedGuard ✓ (UX-001 accepted)
- Direct `'@/lib/api'` imports outside services+lib: 0 hits ✓
- aria-label: 45 files / 78 occurrences (was 5 files pre-program) ✓ (A11Y-001)
- Dead-module greps (`lib/auth`, `cache-config`, `api-response`, `useMutationLock`, `ui/sidebar`, `ThemeToggle`, `exportService`): 0 hits ✓ (CLEAN registry)
- Lockfile singularity: only `pnpm-lock.yaml` ✓ (DX-001)
- Phantom `'admin'` role: 0 hits ✓ (AUTH-002) · `innerHTML`: 0 hits ✓ (SEC-002) · noopener present ✓ (SEC-003)

Registry closed: every finding has terminal status (FIXED 27 · ACCEPTED 2 with reasons · DEFERRED 2 with documented decisions); no CRITICAL/HIGH open. Backlog of 6 residual items recorded in `findings/README.md`.

**Playwright introduction plan (optional scope item):** phase 1 — install @playwright/test, single chromium project, `webServer` reuse of `pnpm dev`; phase 2 — three golden-flow specs against a seeded staging backend; phase 3 — wire into CI after workflow exists. Not installed now (program charter: no new heavy tooling post-gates).
