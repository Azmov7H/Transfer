# Commit Strategy (companion to `branch-strategy.md`)

Detailed commit conventions for the enhancement.

## Format

```
<type>(<area>): <concise Arabic/English summary>

[optional body explaining why, not what]
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `security`.
Areas: `fin` (financial/treasury), `ui`, `val` (validation), `party` (customer/supplier),
`export`, `db`, `sec`, `test`.

## Rules

1. **One logical change per commit.** Never mix model change + UI + test in one commit unless trivial.
2. **Backend + frontend contract changes** should be paired commits across the two repos with matching messages
   and a cross-reference (e.g., "see be-Jammaz PR #X").
3. **Tests accompany features.** A `feat(fin):` commit adding `instapay` should include the Zod + integration
   test in the same or immediately following commit.
4. **No secrets, no `.env`.** Verify `.gitignore` in both repos.
5. **No `--no-verify`** (pre-commit hooks: ESLint in both repos, Vitest/Jest in CI).
6. **Rebase, don't merge,** feature branches onto `main` before PR (keep linear history); the merge to `main` is a
   squash or merge commit per team preference.
7. **Reverts** use `git revert <sha>` (preserves audit trail); do not force-push to shared branches.
8. **Migration scripts** committed under `be-Jammaz/scripts/` with a `dry-run` flag; never executed in commit.

## Example Sequence (for `feature/transfer-source-validation`)

```
feat(fin): add sourceNumber to TreasuryTransaction + Invoice.payments
feat(val): require sourceNumber for instapay/wallet (superRefine)
test(fin): reject instapay/wallet without sourceNumber (T-INT-002/004/005)
feat(ui): SourceNumberField conditional on method (FIN-UI-007)
test(ui): PaymentDialog blocks empty source for instapay (T-FE-001)
docs: update export + financial architecture notes
```

## PR Description Must Include

- Requirement ID(s) (REQ-FIN-*, REQ-VAL-*, REQ-PARTY-*, REQ-EXP-*).
- Acceptance criteria checked.
- Test results (CI green).
- Backward-compatibility note (additive only).
- Rollback note.
