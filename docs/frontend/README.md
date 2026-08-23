# Frontend Audit & Remediation — Master Index

Project: **Jammaz-System** (`transfer`) — Next.js 16 App Router, React 19, JavaScript (no TypeScript), Tailwind 3 + shadcn/radix UI, TanStack Query 5, Arabic RTL internal business system. The frontend proxies `/api/*` to an external backend via `next.config.mjs` rewrites (`API_PROXY_TARGET`, default `http://127.0.0.1:5050`). There are **no API routes in this repo**.

---

## Frontend Health: 🟡 Needs Structured Remediation

The app is feature-complete and functionally coherent, but the **validation pipeline is broken** (lint crashes, tests crash), error handling has systemic gaps, the codebase carries significant dead weight, and several god components concentrate risk.

## Findings Summary

| Severity | Count | Registry |
|---|---|---|
| CRITICAL | 2 | [findings/critical.md](findings/critical.md) |
| HIGH | 9 | [findings/high.md](findings/high.md) |
| MEDIUM | 13 | [findings/medium.md](findings/medium.md) |
| LOW / INFO | 10 | [findings/low.md](findings/low.md) |

Full category index: [findings/README.md](findings/README.md)

## Sprint Plan

| # | Sprint | Branch | Tasks |
|---|---|---|---|
| 00 | Baseline & Safety | `feat/frontend-sprint-00-baseline` | 5 |
| 01 | Architecture & Foundations | `feat/frontend-sprint-01-architecture` | 3 |
| 02 | Data Layer & State Management | `feat/frontend-sprint-02-data-state` | 6 |
| 03 | Authentication & Frontend Security | `feat/frontend-sprint-03-auth-security` | 5 |
| 04 | Core Components & UI Consistency | `feat/frontend-sprint-04-ui-system` | 5 |
| 05 | Pages & Feature UX | `feat/frontend-sprint-05-pages-ux` | 5 |
| 06 | Responsive Experience | `feat/frontend-sprint-06-responsive` | 2 |
| 07 | Accessibility | `feat/frontend-sprint-07-accessibility` | 2 |
| 08 | Performance | `feat/frontend-sprint-08-performance` | 3 |
| 09 | Testing & Regression Protection | `feat/frontend-sprint-09-testing` | 3 |
| 10 | Code Cleanup & Dependency Hygiene | `feat/frontend-sprint-10-cleanup` | 3 |
| 11 | Final Hardening | `feat/frontend-sprint-11-hardening` | 2 |

**Total: 12 sprints · 44 tasks · 1 branch per sprint**
Branch map: [sprints/branch-map.md](sprints/branch-map.md) · PR strategy: [sprints/pr-strategy.md](sprints/pr-strategy.md)

## Current Status

- **Current sprint:** none started (audit phase complete, no code modified)
- **Recommended starting sprint:** Sprint 00 — nothing can be validated until lint/test/build gates work

## Most Critical Areas

1. **Broken validation pipeline** — `npm run lint` crashes (ESLint 9 / FlatCompat circular-config error), `npm test` fails module resolution, npm lockfile tracked while node_modules is pnpm-installed (`DX-001`)
2. **Error handling architecture** — no root `error.jsx`, no `global-error.jsx`, no `not-found.jsx`; `src/components/ErrorBoundary.jsx` exists but is mounted nowhere; session expiry is a silent no-op (`ERR-001`, `AUTH-001`)
3. **God pages & duplication** — 5 pages over 600 lines mixing fetch/forms/presentation; three near-identical product selector dialogs; two dead theme toggles; two chart libraries (`ARCH-001`, `COMP-001`, `PERF-002`)

## Audit Coverage

All 26,148 lines of `src/**` were inventoried; deep inspection covered: routing/layout tree, all 40+ routes, data layer (`api-utils.js`, all 25 services, all 24 hooks), providers/context, auth flow (middleware → login → session), security surface scan, dependency graph, build/test/lint tooling, and representative component samples from every feature area. Items marked VERIFY in findings require runtime/browser confirmation that static analysis cannot provide.

## Documentation Index

### Audits
- [00-audit-scope.md](00-audit-scope.md)
- [01-current-state.md](01-current-state.md)
- [02-architecture-audit.md](02-architecture-audit.md)
- [03-next-react-audit.md](03-next-react-audit.md)
- [04-component-audit.md](04-component-audit.md)
- [05-state-management-audit.md](05-state-management-audit.md)
- [06-data-layer-audit.md](06-data-layer-audit.md)
- [07-auth-security-audit.md](07-auth-security-audit.md)
- [08-ux-ui-audit.md](08-ux-ui-audit.md)
- [09-responsive-audit.md](09-responsive-audit.md)
- [10-accessibility-audit.md](10-accessibility-audit.md)
- [11-performance-audit.md](11-performance-audit.md)
- [12-typescript-audit.md](12-typescript-audit.md)
- [13-error-form-audit.md](13-error-form-audit.md)
- [14-testing-audit.md](14-testing-audit.md)
- [15-seo-audit.md](15-seo-audit.md)
- [16-dependency-audit.md](16-dependency-audit.md)
- [17-code-quality-audit.md](17-code-quality-audit.md)
- [18-dx-build-audit.md](18-dx-build-audit.md)

### Findings
[findings/README.md](findings/README.md) → critical.md · high.md · medium.md · low.md

### Sprints
[sprints/README.md](sprints/README.md) → sprint-00 … sprint-11 · branch-map.md · pr-strategy.md

### Tasks
[tasks/README.md](tasks/README.md) → dx/ · architecture/ · data/ · state/ · security/ · ux-ui/ · responsive/ · accessibility/ · performance/ · testing/ · cleanup/

### Architecture References
- [architecture/current.md](architecture/current.md)
- [architecture/target.md](architecture/target.md)

## First Task

**FE-DX-001 — Repair ESLint flat config so `npm run lint` executes**
File: [tasks/dx/FE-DX-001-fix-eslint-config.md](tasks/dx/FE-DX-001-fix-eslint-config.md)
Branch: `feat/frontend-sprint-00-baseline`
