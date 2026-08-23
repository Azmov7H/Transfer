# 14 — Testing Audit

## Current State

### TEST-001 — Test Suite Is Broken and Effectively Empty (HIGH)
- Exactly one test file: `src/lib/validators.test.js` (24 lines) — three smoke assertions on zod schemas.
- `npm test` **fails**: module resolution error (`Cannot find module` for extensionless schema import at validators.test.js:5).
- Testing Library + jest-dom installed and configured (`jest.config.js` via next/jest, `jest.setup.js`) but zero component/hook tests exist.
- No CI configuration found in repo (no `.github/`, no pipelines) — VERIFY for external CI.

## Risk Ranking for New Tests (Sprint 09)

| Priority | Target | Why |
|---|---|---|
| 1 | Auth: `useUserRole` shape handling, RoleGate, session-expiry redirect | AUTH fixes in Sprint 03 are regression-prone |
| 2 | Invoice creation flow (items manager totals, submit payload) | highest business impact |
| 3 | Payment/debt dialogs mutation payloads | money |
| 4 | Permission-aware rendering (`can()`, navigation filtering) | phantom-role bug class (AUTH-002) |
| 5 | api-utils fetcher unit tests (dedup fix DATA-001, 401 handling, unwrap logic) | pure functions, cheap to test, central |
| 6 | Form validation schemas (fix existing file while at it) | already half-written |

## Strategy
- Unit-first: `api-utils`, hooks with a QueryClient wrapper helper, zod schemas.
- Component tests only for RoleGuard, ExportButton trigger, and one representative dialog.
- E2E: explicitly deferred (no infrastructure; Playwright decision documented as future work in sprint-11).
- Mocking approach: mock the `api` module (`@/lib/api-utils`) rather than `fetch` — single seam, stable tests.
