# Sprint → Branch Map

| Sprint | Branch | Purpose | Tasks |
|---|---|---|---|
| 00 | `feat/frontend-sprint-00-baseline` | Tooling gates + package manager | 5 |
| 01 | `feat/frontend-sprint-01-architecture` | Error surfaces, metadata, ADR | 3 |
| 02 | `feat/frontend-sprint-02-data-state` | Fetcher, contracts, polling, session hook | 6 |
| 03 | `feat/frontend-sprint-03-auth-security` | Expiry UX, RoleGuard, log/print/open hygiene | 5 |
| 04 | `feat/frontend-sprint-04-ui-system` | Selector, form pattern, confirms, primitives | 5 |
| 05 | `feat/frontend-sprint-05-pages-ux` | God-page decomposition, UI states | 5 |
| 06 | `feat/frontend-sprint-06-responsive` | Mobile tables, touch targets | 2 |
| 07 | `feat/frontend-sprint-07-accessibility` | Labels, semantics, focus | 2 |
| 08 | `feat/frontend-sprint-08-performance` | Lazy exports, chart consolidation, metrics | 3 |
| 09 | `feat/frontend-sprint-09-testing` | Test infra + coverage of fixes | 3 |
| 10 | `feat/frontend-sprint-10-cleanup` | Dead code, dependency resolution | 3 |
| 11 | `feat/frontend-sprint-11-hardening` | Clean-checkout verification, closure | 2 |

**Total: 44 tasks across 12 branches.**

## Rules
1. One sprint = one branch = one primary PR.
2. Branch from the previous sprint's merged branch (linear program) or from `main` if sprints are executed out of order with rebasing discipline.
3. No unrelated fixes ride along; new discoveries become findings first (see pr-strategy.md).
