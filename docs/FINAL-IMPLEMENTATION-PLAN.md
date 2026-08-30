# FINAL IMPLEMENTATION PLAN

> **STATUS: PLANNING COMPLETE — IMPLEMENTATION NOT STARTED.**
> Repository unchanged. No source code, schemas, migrations, or packages were modified. This document
> summarizes the full plan contained in `docs/`. Implementation may begin only after the user reviews and
> approves this plan.

---

## 1. Current Architecture (as discovered, not assumed)

- **Two repositories** in `/home/ali/Desktop/web/JM/`:
  - `Jammaz-System` — Next.js 16 (App Router) + React 19 frontend. Talks to the backend only via `/api/*`
    (rewritten by `next.config.mjs` to `API_PROXY_TARGET`, default `127.0.0.1:5050`). No server logic.
  - `be-Jammaz` — Node.js Express + Mongoose/MongoDB backend (port 5000). Layered: `routes → services →
    repositories → models`, with canonical Zod schemas in `validations/validators.js`.
- **Auth:** JWT (HS256) in HttpOnly cookie; `authMiddleware` + `roleMiddleware` (`owner/manager/cashier/
  warehouse/viewer`). Frontend mirror in `src/lib/permissions.js`.
- **Treasury:** single aggregated `TreasuryBalance` (one fixed doc) + per-day `CashboxDaily` method breakdown
  (cash/bank/wallet/check). All treasury writes go through `TreasuryService` (single choke point).
- **Parties:** `Customer` and `Supplier` are **separate collections** with separate balances; `Debt` is
  polymorphic; `UnifiedCollection` is a fragile surrogate over `customers`.
- **Export:** partially broken — `ExportButton.jsx` Excel path hits a non-existent `/api/export`; PDF uses jsPDF
  with no Arabic font; only Accounting CSV works client-side.

## 2. Current Problems

1. No `instapay` channel; only `cash/bank/wallet/check/adjustment` exist.
2. No `sourceNumber` / transfer-reference captured → no audit trail for electronic transfers.
3. Customer and Supplier are siloed; "both roles" requires duplicate records.
4. Export is non-functional for most modules and produces garbled Arabic PDFs.

## 3. Required Changes (summary)

- Add `instapay` to the payment-method dimension everywhere (model enum, Zod, UI selectors, cashbox breakdown).
- Add `sourceNumber` (DB-optional, validation-required for `instapay`/`wallet` on NEW transactions only).
- Unify Customer/Supplier via **Option B** (cross-link + role flags) — no destructive merge, fully reversible.
- Repair export: real server-side endpoint, Arabic-correct output, filter-respecting, authorized, large-safe.

## 4. Recommended Architecture

- **Channels = the existing `method` dimension extended** (do NOT create separate treasury accounts). Keep the
  single running balance; add per-channel `CashboxDaily` fields + `getSummary` breakdown for `instapay`.
- **Centralize** the method→cashbox field map in `TreasuryService` (currently duplicated in 9 methods).
- **Customer/Supplier = Option B** (keep collections, add `linkedSupplier`/`linkedCustomer` + role flags).
  Option A (unified `Party`) documented but deferred due to migration risk on historical references.
- **Export = new `/api/export`** reusing each service's query builders + a centralized column map; CSV/XLSX via
  `exceljs` (RTL Arabic), PDF via RTL-aware generator with embedded Arabic font.

## 5. Database Changes

All **additive** (no breaking migration):
- `TreasuryTransaction`: `method` +`'instapay'`; new `sourceNumber` (optional).
- `CashboxDaily`: +4 `instapay*` fields + `pre('save')` math.
- `Invoice`: `paymentType` +`'instapay'`; `payments[].method` +`'instapay'`; `payments[].sourceNumber`.
- `PurchaseOrder`: `paymentType` +`'instapay'`.
- `Customer`/`Supplier`: +`taxNumber`, `isSupplier`/`isCustomer`, `linkedSupplier`/`linkedCustomer` (sparse unique).
- Indexes: `{method,date}` on transactions; sparse-unique link fields.
- Historical rows never rejected; `sourceNumber` required only for new `instapay`/`wallet` writes.

## 6. Backend Changes (`be-Jammaz`)

- Models (FIN-MDL-001..005), Validation (FIN-VAL-001..005), Services (FIN-SVC-001..006), Routes (FIN-RTE-001..004),
  Export endpoint (FIN-EXP-001..004). Full task specs in `04-backend/README.md`.

## 7. Frontend Changes (`Jammaz-System`)

- Centralize payment-method constants (FIN-UI-000); add InstaPay to all selectors (FIN-UI-001..006);
  conditional `SourceNumberField` (FIN-UI-007/008); treasury summary instapay tiles (FIN-UI-009..011);
  party UI (FIN-UI-012..015); export repair + module export buttons (FIN-UI-016..018). See `03-frontend/README.md`.

## 8. UX/UI Changes

Shared `PaymentMethodSelect`; conditional source field inline under method; masked source in history; party role
badges + net-position card; duplicate-candidates screen; unified Export dropdown with loading/error/empty states;
RTL/mobile/a11y consistency. See `06-ux-ui/README.md`.

## 9. Security Changes

All new endpoints behind `authMiddleware`+`roleMiddleware`; `sourceNumber` masked in UI/logs and excluded from
exports unless owner/manager; export IDOR blocked via validated filters + reused query builders; rate-limited;
audit-logged. See `07-security/README.md` and `12-risk-register.md` (REG-01..11).

## 10. Export Changes

Replace broken `ExportButton` Excel/PDF with a real server-side `/api/export` honoring filters and permissions,
producing Arabic-correct CSV/XLSX/PDF, streaming for large sets, with centralized column maps. See
`01-requirements/export-repair.md` and `00-current-system/export-architecture.md`.

## 11. Testing Strategy

Unit (Zod, method map, cashbox math, detection, CSV), Integration (Vitest + mongodb-memory-server) for every
matrix row, Frontend (Jest + RTL), E2E. Full matrix (20 primary + 8 edge cases) in `08-testing/test-matrix.md`.

## 12. Migration Strategy

Additive only. Scripts designed but NOT executed: `migrate-add-instapay-channel.js` (idempotent, backfills cashbox
defaults), `party-detect-duplicates.js` (READ-ONLY report), `party-link.js` (explicit pairs only). See
`05-database/README.md`.

## 13. Sprint Plan

S0 Discovery (done) → S1 DB/Foundation → S2 Treasury/Methods → S3 Source-Validation → S4 Sales → S5 Collections
→ S6 Supplier Payments → S7 Customer/Supplier Unification → S8 Export Repair → S9 UX/UI → S10 Security →
S11 Testing/Regression → S12 Production Readiness. See `10-sprints/README.md` and `11-dependency-graph.md`.

## 14. Branch Strategy

Isolated feature branches in BOTH repos (`feature/financial-payment-methods`, `feature/transfer-source-validation`,
`feature/treasury-channel-breakdown`, `feature/customer-supplier-roles`, `fix/export-system`, `test/financial-
regression`). Lockstep backend→frontend release. See `09-git/branch-strategy.md` + `commit-strategy.md`.

## 15. Risks

11 registered (REG-01..11). Highest: treasury math regression (mitigated by single choke point + reconciliation
test), historical-data rejection (mitigated by validation-only rule), duplicate auto-merge (mitigated by Option B
read-only detection + explicit link). See `12-risk-register.md`.

## 16. Acceptance Criteria

Financial, Transfer-Validation, Customer/Supplier, Export, Security, Backward-Compatibility, and Production-
Readiness criteria enumerated in `13-acceptance-criteria.md` and traced in `14-traceability-matrix.md`.

## 17. Recommended Implementation Order

1. Approve plan → 2. S1 foundation (enum + Zod + resolve GL accounts) → 3. S2 channel + cashbox map →
4. S3 source validation → 5. S4–S6 sales/collections/supplier → 6. S7 party unification → 7. S8 export repair →
8. S9 UX → 9. S10 security → 10. S11 regression → 11. S12 production (backup, dry-run, deploy, verify, monitor).

This order protects accounting consistency (all writes stay in `TreasuryService`), minimizes migration risk
(additive only), and keeps export isolated until data serializers are stable.

---

## Document Index (this plan)

```
docs/
├── README.md                                 (master index)
├── 00-current-system/  (8 files)            existing architecture
├── 01-requirements/    (5 files)            REQ-FIN / REQ-VAL / REQ-PARTY / REQ-EXP
├── 02-architecture/    (4 files)            proposed target design
├── 03-frontend/        README.md            frontend task plan
├── 04-backend/         README.md            backend task plan
├── 05-database/        README.md            migration + rollback
├── 06-ux-ui/           README.md            UX plan
├── 07-security/        README.md            security plan
├── 08-testing/         README.md + test-matrix.md
├── 09-git/             branch-strategy.md + commit-strategy.md
├── 10-sprints/         README.md
├── 11-dependency-graph.md
├── 12-risk-register.md
├── 13-acceptance-criteria.md
├── 14-traceability-matrix.md
└── FINAL-IMPLEMENTATION-PLAN.md             (this file)
```

**Pre-existing docs** (`docs/frontend/`, `docs/ux-ui-improvement/`) were left untouched; they are prior audits
and remain valid context.
