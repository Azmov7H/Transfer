# 01 — Requirements

This folder breaks the master prompt's business requirements into implementable, testable units.

| Doc | Requirement area |
|-----|------------------|
| `financial-channels.md` | Treasury channels: Private Treasury, InstaPay, Cash Wallet |
| `transfer-source-validation.md` | Conditional source-number requirement |
| `customer-supplier-unification.md` | One entity, two roles |
| `export-repair.md` | Audit & repair export system |

Each requirement is tagged `REQ-FIN-*`, `REQ-VAL-*`, `REQ-PARTY-*`, `REQ-EXP-*` for the traceability
matrix (`14-traceability-matrix.md`).

## Source-of-Truth Note

Backend is `be-Jammaz`; frontend is `Jammaz-System`. Requirements that change data shape or validation
**must** be implemented in `be-Jammaz` (models + Zod + services + routes) and mirrored in the frontend
(services + components + selectors). Requirements are written assuming that dual edit.

## Backward Compatibility Principle

> Historical transactions recorded before these changes (e.g., existing `wallet`/`bank` transactions
> without a `sourceNumber`) **must remain valid**. The `sourceNumber` field is required **only for new
> transactions** where `method ∈ {instapay, wallet}` (configurable). No migration should reject or alter
> historical rows. See `05-database/migration-strategy.md`.
