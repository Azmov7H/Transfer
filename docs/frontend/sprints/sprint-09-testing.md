# Sprint 09 — Testing & Regression Protection

## Objective
Stand up a working test suite that locks in everything Sprints 00–08 fixed.

## Why This Sprint Exists
The remediation changed the fetcher, auth UX, and page structure. Without tests, the next feature team silently regresses it. Runs after refactors stabilize so tests target final shapes.

## Scope
- Test utilities: QueryClient wrapper, api-module mock, render helper.
- Unit tests: api-utils (dedup/timeout/unwrap/401), useUserRole, permissions `can()`.
- Component tests: RoleGate, ConfirmDialog trigger, one form via adapter.
- Flow tests: invoice items totals; notification polling gating.
- Fix and extend validators schema tests.

## Out of Scope
E2E framework adoption (documented as future work in Sprint 11); coverage percentage targets.

## Branch
`feat/frontend-sprint-09-testing`

## Findings Addressed
TEST-001

## Tasks
- FE-TEST-001 — Test infrastructure (`tasks/testing/FE-TEST-001-infra.md`)
- FE-TEST-002 — Critical flow tests (`tasks/testing/FE-TEST-002-critical-flows.md`)
- FE-TEST-003 — Regression lock tests (`tasks/testing/FE-TEST-003-regression.md`)

## Dependencies
Sprints 02–05 (tests assert post-fix behavior).

## Implementation Order
1. FE-TEST-001
2. FE-TEST-002
3. FE-TEST-003

## Validation
```bash
pnpm test            # all green
pnpm run lint && pnpm run build
```

## Acceptance Criteria
- Every HIGH-severity fix from Sprints 02–04 has at least one asserting test.
- Suite runs <60s locally.
- README documents how to run and where helpers live.

## Definition of Done
Standard DoD.

## Expected Result
Regression protection proportional to the highest-risk fixes.

---

## Execution Record

**Branch:** `feat/frontend-sprint-09-testing` (stacked on sprint-08)
**Status:** COMPLETE

| Task | Commit | Summary |
|---|---|---|
| FE-TEST-001 | `73aa0bb` | `src/test/utils.jsx`: `createTestQueryClient` (retry off, gc pinned), `renderWithProviders`, envelope fixtures (`envelopeOk`/`envelopeFail`/`jsonResponse`); canary test proves the harness |
| FE-TEST-002 | `d50e02d` | Permissions matrix (locks AUTH-002), useUserRole session-shape contract (envelope-unwrapped user, isLoggedOut semantics incl. error ambiguity), RoleGate per-role/permission/fallback, ConfirmDialog confirm/cancel/pending, invoice-items math (stock clamps, qty×price shape), notification polling gated by session (no fetch logged out) |
| FE-TEST-003 | `396667e` | Fetcher case matrix: envelope unwrap, JammazApiError mapping, GET dedup / mutation non-dedup / cross-URL isolation / signal bypass, fake-timer 408 isTimeout, 401 single redirect + guard + /login exemption + auth-endpoint exemption, 403 no redirect. Validators extended (login/customer/stock-move, Arabic messages, coerce/trim semantics). README testing section added |

**Gates at completion:** 59 tests / 9 suites all green in ~42s (<60s target); lint 0 errors / 47 warnings; build green.

**Acceptance verification:**
- Every HIGH-severity fix from Sprints 02–04 has asserting tests: DATA-001 (dedup), DATA-002 (timeout), AUTH-001 (redirect guard — mutation spot-check: seam bypass or guard removal breaks the suite), AUTH-002 (permissions matrix), UX-001 (ConfirmDialog), STATE primitives exercised through RoleGate fallback paths.
- Suite runs <60s locally ✓.

**Notes / deviations (important for future test authors):**
- **jest.mock hoisting does not work under next/jest's SWC transform for ESM-style test files** (`import { describe } from '@jest/globals'`). All mock-based tests are written CommonJS-style; documented in README.
- Small production refactor allowed by task spec: api-utils gained an exported `__internals = { currentPathname, redirectToLogin }` seam so tests can observe the 401 redirect without patching window.location (non-configurable under jsdom ≥ recent). Zero behavior change otherwise.
- zod v4 emits generic "expected string" issues for missing keys rather than custom required-messages — validator tests assert Arabic messages against empty-string inputs instead.
- useUserRole error-path test waits ~1s+ because the hook deliberately sets retry:1 (backoff before settling as error).
