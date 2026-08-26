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

---

## Execution Record

**Branch:** `feat/frontend-sprint-10-cleanup` (stacked on sprint-09)
**Status:** COMPLETE

| Task | Commit | Summary |
|---|---|---|
| FE-CLEAN-003 | `9f91d27` | Last disabled-code comment removed (`InvoiceCustomerSelect` dead sync branch). The other two registry sites were already resolved by earlier sprints (api-utils rewritten in FE-AUTH-001; NotificationContext comment is documentation, not code). |
| FE-CLEAN-002 | `8b95391` | Deleted after re-grep: `lib/auth.js`, `lib/cache.js`, `lib/cache-config.js`, `lib/api-response.js` (legacy backend layer — validation grep zero hits), `ThemeToggle.jsx`, `themes/Toggle.jsx`, `hooks/useMutationLock.js`, `services/authService.handleGoogleCallback`. **VERIFY resolutions:** `components/Logo/Logo.jsx` **retained** (imported by 9 files); shadcn `ui/sidebar.jsx` **deleted whole** — zero importers anywhere (app uses custom `components/Sidebar.jsx`). |
| FE-DEP-001 | `9150d6d` | jspdf 2.5.2→4.2.1 + jspdf-autotable 3.8.4→5.0.8 (**pnpm audit: 28 vulns incl. 2 critical → 0**); removed dotenv, exceljs (FE-PERF-001 leftover), tw-animate-css. Dispositions recorded in `architecture/dependency-dispositions.md`. react-hook-form retained (FE-FORM-001 adopted). |

**Gates at completion:** lint 0 errors / 42 warnings (down from 47 baseline — warnings died with the dead code), tests 59/59 (~42s), build green.

**Acceptance criteria:** all SAFE items deleted ✓ · VERIFY items resolved with recorded decisions ✓ · no dependency without runtime import or documented reason ✓ · audit output recorded, criticals resolved (not risk-accepted) ✓.
