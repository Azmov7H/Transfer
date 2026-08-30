# 09 — Git Strategy

Branch and commit strategy. Branches are **proposed only** — not created during planning.

## 09.1 — Branch Strategy

Isolate each feature so it can be reviewed, tested, and reverted independently. Base branch: `main`
(or the repo's default; verify in `be-Jammaz` and `Jammaz-System` separately — they are two repos).

| Branch | Scope | Depends on |
|--------|-------|------------|
| `feature/financial-payment-methods` | Add `instapay` to method enum + Zod + UI selectors (no source rule yet) | — |
| `feature/transfer-source-validation` | `sourceNumber` field + conditional required validation (backend+frontend) | `feature/financial-payment-methods` |
| `feature/treasury-channel-breakdown` | CashboxDaily instapay fields + TreasuryService map + summary/UI | `feature/financial-payment-methods` |
| `feature/customer-supplier-roles` | Option B cross-link + detection + UI | — |
| `fix/export-system` | Backend export endpoint + Arabic PDF + frontend wiring | — |
| `test/financial-regression` | Tests for the above (can be folded into each feature branch; this is a shared test branch for CI) | all |

> Cross-repo note: `feature/*` likely needs a matching branch in **both** `be-Jammaz` and `Jammaz-System`
> (e.g., `feature/transfer-source-validation` in each), merged/versioned together. Coordinate via PR labels.

## 09.2 — Commit Strategy

- Atomic commits; one concern per commit. Prefix by area: `feat(fin):`, `feat(ui):`, `fix(export):`,
  `test(fin):`, `docs:`, `refactor(treasury):`.
- Examples:
  - `feat(fin): add instapay to TreasuryTransaction.method enum`
  - `feat(fin): centralize method→cashbox field map in TreasuryService`
  - `feat(val): require sourceNumber for instapay/wallet`
  - `feat(ui): SourceNumberField shown for instapay/wallet`
  - `feat(party): link customer↔supplier (Option B)`
  - `fix(export): implement /api/export with Arabic XLSX`
- **No commit modifies behavior without a test** (or explicitly notes test to follow).
- **No `fixup`/squash that drops history** until after review.
- Protect `main`; require PR review + CI (lint + tests) before merge.
- Never commit secrets (`.env` already gitignored; verify `be-Jammaz/.gitignore` excludes `.env`).
- Revert strategy: if a feature branch is bad, revert the PR (git revert) — additive changes make revert safe.

## 09.3 — Release Coordination

- Backend (`be-Jammaz`) and frontend (`Jammaz-System`) must be released in lockstep (contract coupling).
- Use matching version tags (e.g., `v1.7.0-be` / `v1.7.0-fe`) and a combined changelog entry.
- Deploy backend first (additive), then frontend (consumes new contract), to avoid 404/contract mismatch.
