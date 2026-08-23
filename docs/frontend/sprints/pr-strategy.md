# PR Strategy

## Model
- **One Sprint = One primary branch = One reviewable PR** (plus stacked sub-PRs for large sprints like 02/05 where reviewers need smaller units).
- One logically isolated task = one commit or small commit group. Never mix unrelated tasks in one commit.

## Commit Naming

```
feat(frontend): add RoleGate guard component (FE-AUTH-002)
fix(frontend): redirect to login on 401 responses (FE-AUTH-001)
refactor(frontend): decompose financial page into feature views (FE-PAGES-001)
perf(frontend): lazy-load jsPDF behind export action (FE-PERF-001)
test(frontend): cover fetcher dedup semantics (FE-TEST-003)
chore(frontend): adopt pnpm, drop npm lockfile (FE-CLEAN-001)
docs(frontend): record target architecture ADR (FE-ARCH-002)
```

Every commit references its task ID; every PR lists its finding IDs.

## PR Template (per sprint)

```markdown
## Sprint
Sprint XX — <title> (branch: feat/frontend-sprint-XX-name)

## Findings addressed
- ID — title

## Tasks included
- FE-XXX-NNN — one-line result

## Validation run
- [ ] pnpm run lint
- [ ] pnpm test
- [ ] pnpm run build
- Manual checks: <list from sprint file>

## Out of scope / deferred
- <anything discovered but not fixed → new finding ID>
```

## Review Guidance
- Sprints 00–03 are behavior-sensitive: require manual QA notes per sprint's validation section.
- Sprint 05 PRs should include before/after recordings or screenshots per decomposed page.
- Sprint 08 PR must include the metrics table.

## New Work Discovered Mid-Sprint
Do NOT fix inline. Record a new finding in `docs/frontend/findings/` with evidence, map it to the appropriate existing or new task, and continue the sprint scoped as defined. Exceptions: a two-line fix strictly required for the sprint's acceptance criteria may land with a `fix(frontend):` commit referencing the new finding ID.
