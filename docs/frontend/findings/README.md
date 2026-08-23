# Findings Registry — Index

Every finding has a unique ID, severity, evidence, and a mapped task. Full details per severity file; per-finding task links below.

## CRITICAL (2)

| ID | Title | Task |
|---|---|---|
| DX-001 | Validation pipeline broken: ESLint crashes, Jest fails, package-manager split-brain | FE-DX-001/002, FE-CLEAN-001 |
| ERR-001 | No root error boundary / global-error / not-found; ErrorBoundary never mounted | FE-ARCH-001 |

## HIGH (9)

| ID | Title | Task |
|---|---|---|
| ARCH-001 | God pages (864/694/680/634/622 lines) mixing fetch+forms+presentation | FE-PAGES-001…004 |
| NEXT-001 | 100% client-rendered app; zero server-side data fetching | FE-NEXT-001 (+ Sprint 08 review) |
| AUTH-001 | Session expiry silent: 401/403 handler is a commented-out no-op | FE-AUTH-001 |
| AUTH-002 | Shallow client authorization + phantom `'admin'` role check in audit page | FE-AUTH-002 |
| SEC-001 | Sensitive logging: userId/role/session objects in middleware, login, useUserRole | FE-SEC-001 |
| DATA-001 | Fetcher "deduplication" targets mutations instead of GETs | FE-DATA-001 |
| FORM-001 | react-hook-form+zod installed; all forms hand-rolled inconsistently | FE-FORM-001 |
| PERF-001 | jsPDF/exceljs statically imported into route bundle | FE-PERF-001 |
| TEST-001 | Test suite broken; single smoke test; zero meaningful coverage | FE-TEST-001…003 |

## MEDIUM (13)

| ID | Title | Task |
|---|---|---|
| COMP-001 | Triplicated product selector dialogs | FE-COMP-001 |
| UX-001 | Native alert()/confirm() ×10 vs installed AlertDialog | FE-UX-001 |
| COMP-002 | Loading/empty/error primitives under-applied | FE-COMP-002, FE-PAGES-005 |
| DATA-002 | No timeouts or request cancellation anywhere | FE-DATA-002 |
| DATA-004 | Notification polling runs unauthenticated from root layout | FE-DATA-004 |
| DATA-003 | Endpoint contracts duplicated hooks↔services; no error-toast policy | FE-DATA-003/005 |
| STATE-001 | useUserRole shape handling accidental; config drift | FE-STATE-001 |
| PERF-002 | Two chart libraries shipped for three charts | FE-PERF-002 |
| TYPE-001 | Zero static typing on 26k-line business app | FE-DATA-005 (JSDoc contracts), deferred migration |
| SEO-001 | Single static metadata; English default 404 in Arabic app | FE-NEXT-001 |
| A11Y-001 | Icon-only buttons unlabeled (5 files with aria-label total) | FE-A11Y-001 |
| SEC-002 | innerHTML print hack destroys React tree + forced reload | FE-SEC-002 |

## LOW / INFO (10)

| ID | Title | Task |
|---|---|---|
| SEC-003 | window.open without noopener (CustomerClient.jsx:374) | FE-SEC-003 |
| RWD-001 | Wide tables have overflow only; no mobile pattern | FE-RWD-001 |
| FORM-002 | No unsaved-changes guards on destructive flows | FE-PAGES-004 scope |
| CLEAN-002 | Commented-out code blocks ×3 | FE-CLEAN-003 |
| DX-002 | `seed` script points to nonexistent scripts/seed.js | FE-DX-003 |
| DX-003 | No .env.example despite required env vars | FE-DX-003 |
| STATE-002 | Hydration-sensitive date initializers | FE-PAGES-001 scope |
| UX-002 | formatCurrency/formatDate duplicated in SalesChart + reports/sales | folded into FE-PAGES tasks |

## VERIFY Items (need runtime confirmation before acting)
- `ui/sidebar.jsx` export usage (CLEAN-D8) → Sprint 10
- `useMutationLock.js` consumers (CLEAN-D7) → Sprint 04
- Touch-target sizes on row actions (RWD-003) → Sprint 06
- Table th scope/caption coverage (A11Y-003) → Sprint 07
- External CI existence (TEST audit) → Sprint 00
