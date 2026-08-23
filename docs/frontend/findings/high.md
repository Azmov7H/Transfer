# HIGH Findings

## ARCH-001 — God Pages
- **Files:** `financial/page.jsx` (864), `(admin)/settings/page.jsx` (694), `accounting/page.jsx` (680), `physical-inventory/[id]/page.jsx` (634), `invoices/[id]/page.jsx` (622)
- **Evidence:** line counts + read of financial/page.jsx: fetch hooks, local filter state, transaction form, supplier payment flow, print, tables, summary cards in one file.
- **Problem/Impact:** Untestable, high merge-conflict surface, regression blast radius; blocks form-pattern rollout.
- **Root Cause:** Feature growth without extraction discipline.
- **Tasks:** FE-PAGES-001…004 · **Dependencies:** Sprint 04 primitives first.

## NEXT-001 — Client-Everything Rendering
- **Evidence:** 106 `"use client"` files; single server page (`customers/[id]/page.jsx`); zero async RSC data fetching.
- **Problem:** Full client JS per route; session→data waterfall on every cold load; Next server capabilities unused.
- **Recommendation:** Incremental — metadata/boundaries now (FE-NEXT-001); structural RSC adoption evaluated in Sprint 08 with measured wins only. Do not big-bang convert against the TanStack investment.

## AUTH-001 — Session Expiry Silent
- **File:** `src/lib/api-utils.js:103-108`
- **Evidence:** 401/403 branch is empty; redirect commented "Uncomment when routing is ready".
- **Impact:** Expired session = page of failing actions and raw error toasts, no path to login.
- **Tasks:** FE-AUTH-001

## AUTH-002 — Shallow Authorization UX + Phantom Role
- **Files:** `(admin)/audit/page.jsx:18` (`role === 'admin'` — not a member of ROLES in `lib/permissions.js`), `users/page.jsx:16-17`, middleware (authn-only)
- **Impact:** Inconsistent gating; audit-page condition can never be true for real roles; deep links reachable for any authenticated role in UI.
- **Tasks:** FE-AUTH-002

## SEC-001 — Sensitive Logging
- **Files:** `middleware.js:23,30` (path+token presence; userId+role per request — edge runtime, survives removeConsole), `login/page.jsx:31` (full login response), `useUserRole.js:10` (session object).
- **Tasks:** FE-SEC-001

## DATA-001 — Deduplication Targets Mutations
- **File:** `api-utils.js:66-73`. GETs never deduped; identical concurrent POST/PUT/DELETE coalesced into one promise via `${method}:${url}:${body}` key.
- **Impact:** Correctness risk on money/inventory mutations; double-submit protection accidental rather than explicit.
- **Tasks:** FE-DATA-001

## FORM-001 — No Form Standard
- **Evidence:** react-hook-form: 0 imports. zod consumed by nothing but the broken test. Hand-rolled state forms across ~10 dialogs.
- **Tasks:** FE-FORM-001 (+ rollout inside Sprint 05)

## PERF-001 — Heavy Export Libs Static
- **Files:** `ExportButton.jsx:13-14` (jsPDF+autotable, used by users page → route chunk), `services/exportService.js:1-2` (exceljs+jspdf, dead module one import away from graph).
- **Tasks:** FE-PERF-001

## TEST-001 — Broken, Empty Test Suite
- **Evidence:** `npm test` fails; sole file = 24-line schema smoke test.
- **Tasks:** FE-TEST-001…003
