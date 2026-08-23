# Sprints — Index

12 sprints, each = one branch = one reviewable unit. Order is dependency-driven; do not reorder without checking task dependency graphs inside each file.

| Sprint | File | Branch | Objective |
|---|---|---|---|
| 00 | [sprint-00-baseline.md](sprint-00-baseline.md) | `feat/frontend-sprint-00-baseline` | Make lint/test/build work; one package manager |
| 01 | [sprint-01-architecture.md](sprint-01-architecture.md) | `feat/frontend-sprint-01-architecture` | Error surfaces, metadata, conventions |
| 02 | [sprint-02-data-state.md](sprint-02-data-state.md) | `feat/frontend-sprint-02-data-state` | Fetcher correctness, cancellation, contracts, polling || 03 | [sprint-03-auth-security.md](sprint-03-auth-security.md) | `feat/frontend-sprint-03-auth-security` | Session expiry, RoleGuard, log hygiene, print fix |
| 04 | [sprint-04-ui-system.md](sprint-04-ui-system.md) | `feat/frontend-sprint-04-ui-system` | Selector consolidation, form pattern pilot, confirms, state primitives |
| 05 | [sprint-05-pages-ux.md](sprint-05-pages-ux.md) | `feat/frontend-sprint-05-pages-ux` | Decompose god pages; UI-state completeness |
| 06 | [sprint-06-responsive.md](sprint-06-responsive.md) | `feat/frontend-sprint-06-responsive` | Mobile table strategy, touch targets |
| 07 | [sprint-07-accessibility.md](sprint-07-accessibility.md) | `feat/frontend-sprint-07-accessibility` | Labels, semantics, focus pass |
| 08 | [sprint-08-performance.md](sprint-08-performance.md) | `feat/frontend-sprint-08-performance` | Lazy exports, chart consolidation, bundle audit |
| 09 | [sprint-09-testing.md](sprint-09-testing.md) | `feat/frontend-sprint-09-testing` | Test infra + critical-flow coverage |
| 10 | [sprint-10-cleanup.md](sprint-10-cleanup.md) | `feat/frontend-sprint-10-cleanup` | Dead code + dependency hygiene |
| 11 | [sprint-11-hardening.md](sprint-11-hardening.md) | `feat/frontend-sprint-11-hardening` | Full-gate green, registry closure |

Cross-cutting rules:
- Every sprint ends with the Definition of Done checklist ([pr-strategy.md](pr-strategy.md)).
- A sprint may be skipped only if all its findings were resolved earlier; record deviations in the sprint file.
