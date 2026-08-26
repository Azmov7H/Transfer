# Findings Registry — CLOSED

Program complete (Sprints 00–11). Every finding below carries a terminal status:
**FIXED** (implemented + verified), **ADOPTED-PARTIAL** (pattern adopted where in scope, full rollout deferred with reason), **DEFERRED** (documented decision, backlog item), or **ACCEPTED** (verified harmless / deliberate).

Verification evidence: audit re-run of Sprint 11 (`sprint-11-hardening.md` execution record); clean-checkout gates exit 0 (lint / test 59 passed / build); targeted greps listed per finding.

## CRITICAL (2)

| ID | Title | Status | Evidence |
|---|---|---|---|
| DX-001 | Validation pipeline broken | **FIXED** | pnpm sole PM (`packageManager` pinned); lint exit 0, tests 59/59, build exit 0 from clean clone (FE-DX-005) |
| ERR-001 | No error boundary / global-error / not-found | **FIXED** | `src/app/error.jsx`, `global-error.jsx`, `not-found.jsx` (Arabic RTL), `(protected)/error.jsx` all present |

## HIGH (9)

| ID | Title | Status | Evidence |
|---|---|---|---|
| ARCH-001 | God pages (600–860 lines) | **FIXED** | Sprint 05 decomposition into components/hooks/services |
| NEXT-001 | 100% client-rendered app | **DEFERRED** | RSC conversion evaluated in FE-PERF-003 → documented NO-GO (`architecture/performance-metrics.md`); re-evaluate if hydration cost proven or auth moves server-side |
| AUTH-001 | Session expiry silent no-op | **FIXED** | Single-redirect `/login?expired=1` guard; regression-tested (`api-utils.test.js`) via `__internals` seam |
| AUTH-002 | Shallow authorization + phantom `'admin'` role | **FIXED** | ROLES constants everywhere; permissions matrix tested (`permissions.test.js`); grep for `'admin'` = 0 hits |
| SEC-001 | Sensitive logging (userId/role/session) | **FIXED** | Middleware log stripping (Sprint 03); re-grep shows only `err.message` warn, zero user data |
| DATA-001 | Dedup targeted mutations instead of GETs | **FIXED** | GET-only dedup keyed `method:url:body`; locked by test matrix |
| FORM-001 | react-hook-form installed, forms hand-rolled | **ADOPTED-PARTIAL** | Pattern adopted (pilot dialogs via dependency-free zodResolver shim); full rollout across remaining forms is a backlog item |
| PERF-001 | jsPDF/exceljs in route bundle | **FIXED** | Dynamic import on click (356 KB isolated chunk); exceljs dep removed entirely (Sprint 10) |
| TEST-001 | Suite broken; zero meaningful coverage | **FIXED** | 59 tests / 9 suites green <60s; HIGH fixes from Sprints 02–04 each have asserting tests |

## MEDIUM (13)

| ID | Title | Status | Evidence |
|---|---|---|---|
| COMP-001 | Triplicated product selectors | **FIXED** | Shared `components/products/ProductSelector.jsx` consumed by invoices + stock |
| UX-001 | Native alert()/confirm() ×10 | **FIXED** | ConfirmDialog primitive replaced in-app confirms; remaining `window.confirm` in `useUnsavedGuard` is deliberate synchronous native blocking for beforeunload/popstate/anchors (a React dialog cannot intercept these) — **ACCEPTED** |
| COMP-002 | Loading/empty/error primitives under-applied | **FIXED** | D11 rule: states exclusively via primitives (+ ResponsiveTable built-ins) |
| DATA-002 | No timeouts/cancellation | **FIXED** | 30s timeout → 408 `isTimeout`, caller-signal support; test-locked |
| DATA-004 | Unauthenticated notification polling | **FIXED** | Polling gated by session; test-locked (`useNotifications.test.js`) |
| DATA-003 | Contracts duplicated hooks↔services; no toast policy | **FIXED** | Services layer D-rules + `withMutationFeedback()` message policy |
| STATE-001 | useUserRole shape accidental | **FIXED** | Session-shape contract test (`useUserRole.test.js`) |
| PERF-002 | Two chart libraries | **FIXED** | Consolidated on recharts; chart.js removed (Sprint 08) |
| TYPE-001 | Zero static typing | **DEFERRED** | JSDoc contracts on services adopted (FE-DATA-005); TS migration explicitly out of program scope |
| SEO-001 | Static metadata; English 404 | **FIXED** | Arabic RTL `not-found.jsx`; `metadata`/`generateMetadata` present on 16 route files incl. protected routes |
| A11Y-001 | Icon-only buttons unlabeled | **FIXED** | ~40 labels added across 28 files (Sprint 07); re-grep: 45 files / 78 occurrences |
| SEC-002 | innerHTML print hack + forced reload | **FIXED** | grep `innerHTML` = 0 hits |

## LOW / INFO (10)

| ID | Title | Status | Evidence |
|---|---|---|---|
| SEC-003 | window.open without noopener | **FIXED** | `'noopener,noreferrer'` verified at CustomerClient.jsx:361 |
| RWD-001 | No mobile table pattern | **FIXED** | ResponsiveTable + card patterns (Sprint 06) |
| FORM-002 | No unsaved-changes guards | **FIXED** | `useUnsavedGuard` hook (Sprint 05) |
| CLEAN-002 | Commented-out code ×3 | **FIXED** | Last site removed Sprint 10; sweep clean |
| DX-002 | `seed` script → nonexistent file | **FIXED** | Script removed from package.json |
| DX-003 | No .env.example | **FIXED** | `.env.example` present |
| STATE-002 | Hydration-sensitive date initializers | **ACCEPTED** | All three `new Date()` initializers are inside dialog components that mount only after user interaction — never rendered during SSR, so no hydration mismatch is reachable |
| UX-002 | formatCurrency duplicated ×2 | **ACCEPTED** | Two one-line local helpers with intentionally different suffixes (`' ج.م'` vs none); extracting a shared util would be over-abstraction |

## VERIFY Items — resolved

- `ui/sidebar.jsx` export usage → whole module unimported; deleted (Sprint 10)
- `useMutationLock.js` consumers → zero; deleted (Sprint 10)
- Touch-target sizes on row actions → explicit ≥44px sizes (Sprint 06)
- Table th scope/caption coverage → `TableHead` defaults `scope="col"`; aria-labels on all data tables (Sprint 07)
- External CI existence → none found (Sprint 00); CI remains a backlog item

## Residual risk / backlog (post-program)

1. **FORM-001 full rollout** — migrate remaining hand-rolled forms to react-hook-form + zodResolver shim.
2. **CI workflow** — no external CI exists; a minimal GitHub Actions workflow (install → lint → test → build) is the highest-value next investment.
3. **Playwright introduction** — golden-flow E2E smoke (login, invoice create+print, debt payment) still manual; plan drafted in sprint-11 record.
4. **RSC re-evaluation** — trigger conditions recorded in `performance-metrics.md`.
5. **TypeScript migration** — deferred by program charter.
6. **Lint warnings (42)** — mostly exhaustive-deps/style; triage as ongoing hygiene, not program scope.
