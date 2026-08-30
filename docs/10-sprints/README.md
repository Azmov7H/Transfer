# 10 — Sprint Structure

Eleven implementation sprints. Order is adjusted from the master prompt to respect the discovered architecture
(single treasury balance, separate Customer/Supplier, broken export). Each sprint: Objective, Tasks, Dependencies,
Affected modules, Risks, Acceptance, Tests, Deliverables.

## Sprint 0 — Discovery & Architecture (DONE during planning)
- Objective: document current system, define target architecture.
- Deliverables: this `docs/` set.
- Acceptance: repo inspected; architecture maps + plans written; no code changed.

## Sprint 1 — Database & Financial Foundation
- Tasks: FIN-MDL-001..005, FIN-VAL-001, FIN-SVC-005 (read accounting accounts).
- Modules: `be-Jammaz/models`, `validations`, `services/accountingService`.
- Risks: enum drift; GL account unknowns → resolve before coding.
- Acceptance: `instapay` accepted by schema; GL mapping documented.
- Tests: T-UNIT-002.

## Sprint 2 — Treasury / Payment Methods (InstaPay channel)
- Tasks: FIN-SVC-001 (method map), FIN-MDL-002 (cashbox instapay), FIN-UI-000/001..006 (selectors),
  FIN-UI-009/010/011 (summary UI).
- Depends on: S1.
- Modules: `treasuryService`, `CashboxDaily`, `PaymentDialog`, `AddTransactionDialog`, `invoices/new`,
  `purchase-orders/[id]`, `SupplierDebtManager`, `TreasuryStatsCards`.
- Risks: cashbox math regression.
- Acceptance: instapay flows update balance + cashbox + summary; UI shows channel.
- Tests: T-INT-001, T-UNIT-004/005, T-FE-003.

## Sprint 3 — Transfer-Source Validation
- Tasks: FIN-VAL-002/003, FIN-SVC-002/003/004, FIN-UI-007/008.
- Depends on: S1, S2.
- Modules: all payment schemas + services + `SourceNumberField`.
- Acceptance: matrix rows 1–15 pass (see `08-testing/test-matrix.md`).
- Tests: T-INT-001..006, T-FE-001/002, E1/E2.

## Sprint 4 — Sales Integration
- Tasks: invoice `paymentType`+`payments[].sourceNumber` (FIN-MDL-003), sale service forward (FIN-SVC-004),
  `invoices/new` UI (FIN-UI-003).
- Depends on: S2, S3.
- Acceptance: sales via instapay/wallet enforce source; cash does not.
- Tests: T-INT-001..003, T-E2E-001.

## Sprint 5 — Customer Collections
- Tasks: collection paths forward source (FIN-SVC-003), UI (FIN-UI-001/002/005/006 as applicable to collections).
- Depends on: S3.
- Acceptance: collection matrix rows 6–10.
- Tests: T-INT-004.

## Sprint 6 — Supplier Payments
- Tasks: purchase service forward source (FIN-SVC-004), `purchase-orders/[id]` + `SupplierDebtManager` UI (FIN-UI-004/005).
- Depends on: S3.
- Acceptance: supplier payment matrix rows 11–15.
- Tests: T-INT-005.

## Sprint 7 — Customer/Supplier Unification (Option B)
- Tasks: FIN-MDL-005, FIN-VAL-004/005, FIN-SVC-006 (partyService), FIN-RTE-001, FIN-UI-012..015.
- Depends on: S1 (models).
- Modules: Customer/Supplier models, `partyService`, link routes, customer/supplier UI, parties page.
- Risks: duplicate detection false positives → human review gate.
- Acceptance: link is idempotent; net position correct; no duplicate record; historical data intact.
- Tests: T-INT-009/010, T-FE-004, E3/E4.

## Sprint 8 — Export Repair
- Tasks: FIN-EXP-001..004, FIN-RTE-003, FIN-UI-016..018, FIN-UI-017 (CSV serializer).
- Depends on: all data modules (needs their serializers).
- Modules: new `exportRoutes`, `reportingService`/resource services, `ExportButton`, module export buttons.
- Acceptance: export works for every module; Arabic correct; filters honored; authorized only.
- Tests: T-INT-011, T-FE-005, E5/E6/E7.

## Sprint 9 — UX/UI Polish
- Tasks: UX-001..016.
- Depends on: S2–S8.
- Acceptance: consistent components, RTL/mobile/a11y verified.
- Tests: T-FE-* + manual QA checklist.

## Sprint 10 — Security Hardening
- Tasks: SEC-AUTH-001/002, SEC-VAL-001/002/003, SEC-FIN-001/002/003, SEC-PII-001/002, SEC-EXP-001/002/003,
  SEC-AUD-001.
- Depends on: S3, S7, S8.
- Acceptance: PII masked; export IDOR blocked; full audit log.
- Tests: E1–E8 security subset.

## Sprint 11 — Testing & Regression
- Tasks: full `08-testing` matrix green; CI; performance test for export; reconciliation script run.
- Depends on: all.
- Acceptance: all 20 + edge cases green; treasury reconciles.

## Sprint 12 — Production Readiness
- Tasks: backup, dry-run migrations, deploy backend→frontend, integrity checks, smoke + regression, monitoring.
- Deliverables: verified production rollout; rollback plan validated.
- Acceptance: `13-acceptance-criteria.md` fully met.

> Sprints 0 is complete (this planning phase). S1–S12 are implementation; the prompt stops at planning, so they are
> specified but NOT started.
