# 13 — Acceptance Criteria

The system must satisfy the following before the enhancement is considered production-ready. Each criterion
references the requirement (`REQ-*`), the implementing tasks, and the tests that prove it.

---

## A. Financial — Treasury / Payment Channels

| ID | Criterion | Source | Proof |
|----|-----------|--------|-------|
| AC-FIN-01 | Private Treasury (`cash`) works exactly as before; remains the default channel. | REQ-FIN-001, REQ-FIN-006 | T-INT-001/003, T-UNIT-002 |
| AC-FIN-02 | InstaPay (`instapay`) is a first-class method across model, Zod, and all UI selectors. | REQ-FIN-002 | T-UNIT-002, T-FE-001, FIN-UI-001..006 |
| AC-FIN-03 | Cash Wallet (`wallet`) continues to work and is labeled consistently ("محفظة"). | REQ-FIN-001 | T-INT-004 |
| AC-FIN-04 | Transactions correctly affect the selected channel; running balance stays accurate. | REQ-FIN-005 | T-INT-001/012 (reconciliation) |
| AC-FIN-05 | `CashboxDaily` and the summary `breakdown` compute and display an `instapay` component. | REQ-FIN-003 | T-UNIT-005, T-INT-001, T-FE-003 |
| AC-FIN-06 | Financial summary UI shows the InstaPay channel. | REQ-FIN-004 | FIN-UI-009/010/011, T-FE-003 |

## B. Transfer-Source Validation

| ID | Criterion | Source | Proof |
|----|-----------|--------|-------|
| AC-VAL-01 | InstaPay requires `sourceNumber` (reject when missing). | REQ-VAL-003 | Matrix #3, #8, #13; T-INT-002/004/005 |
| AC-VAL-02 | Cash Wallet requires `sourceNumber` (reject when missing). | REQ-VAL-003 | Matrix #5, #10, #15; T-INT-002/004/005 |
| AC-VAL-03 | Private Treasury does NOT require `sourceNumber`. | REQ-VAL-004 | Matrix #1, #6, #11; T-INT-003 |
| AC-VAL-04 | Validation exists in backend (Zod) AND frontend (RHF). | REQ-VAL-006 | FIN-VAL-002/003, FIN-UI-007, T-FE-001/002 |
| AC-VAL-05 | Rule applies to Sales, Customer Collections, Supplier Payments, Manual Debt, Expenses. | REQ-VAL-005 | Matrix #1–17; T-INT-001..006 |
| AC-VAL-06 | Historical transactions lacking `sourceNumber` remain valid (read/migration never reject). | REQ-VAL-007 | Matrix #20; T-INT-012 |

## C. Customer / Supplier Unification

| ID | Criterion | Source | Proof |
|----|-----------|--------|-------|
| AC-PARTY-01 | An entity can be both Customer and Supplier (two roles, one underlying record set). | REQ-PARTY-001 | FIN-MDL-005, FIN-SVC-006 |
| AC-PARTY-02 | Promoting a Customer→Supplier (or vice-versa) does NOT create a duplicate record. | REQ-PARTY-002 | T-INT-009 (idempotent link), E3/E4 |
| AC-PARTY-03 | Each role's financial history remains intact and independently queryable. | REQ-PARTY-003 | T-INT-009/010 (net = sum of parts) |
| AC-PARTY-04 | Combined net-position view is available and reconciles. | REQ-PARTY-004 | T-INT-010, T-FE-004 |
| AC-PARTY-05 | Linking is explicit/safe; read-only duplicate detection runs before any link. | REQ-PARTY-005 | PartyService.detectDuplicates (read-only) |
| AC-PARTY-06 | APIs support list-by-role, link, and net-position. | REQ-PARTY-006 | FIN-RTE-001, FIN-SVC-006 |

## D. Export

| ID | Criterion | Source | Proof |
|----|-----------|--------|-------|
| AC-EXP-01 | All existing exports work (Accounting CSV continues; Users/others repaired). | REQ-EXP-001 | T-FE-005, REG-EXP |
| AC-EXP-02 | Filters applied in UI are respected in the export (date, search, type, status). | REQ-EXP-002 | T-INT-011 (E6) |
| AC-EXP-03 | Permissions are respected; unauthorized export → 401/403. | REQ-EXP-007 | T-INT-011 (E5), SEC-EXP-001 |
| AC-EXP-04 | Data is correct and complete (full result set, not just loaded page). | REQ-EXP-002 | T-INT-011 |
| AC-EXP-05 | Arabic data exports correctly (CSV BOM + XLSX/PDF RTL, no garbled text). | REQ-EXP-004 | REG-05 verification (visual) |
| AC-EXP-06 | Large datasets handled safely (streamed/paginated, no OOM/timeout). | REQ-EXP-006 | T-INT-011 (E7) |
| AC-EXP-07 | Errors handled gracefully (clear message, no crash; empty → notice). | REQ-EXP-010 | FIN-UI-016/018 |

## E. Security

| ID | Criterion | Source | Proof |
|----|-----------|--------|-------|
| AC-SEC-01 | New endpoints enforce auth + role. | SEC-AUTH-001/002 | T-INT-011 (E5) |
| AC-SEC-02 | `sourceNumber` is masked in UI/logs and excluded from exports unless owner/manager. | SEC-PII-001/002 | log grep test, export column check |
| AC-SEC-03 | Export IDOR blocked (no cross-party data leak). | SEC-EXP-001/002 | T-INT-011 (E6) |
| AC-SEC-04 | Party link prevents self-link / double-link. | SEC-AUTH-002 | T-INT-009 (E3/E4) |
| AC-SEC-05 | Treasury balance integrity preserved (no out-of-band mutation). | SEC-FIN-002 | T-INT-012 |

## F. Backward Compatibility

| ID | Criterion | Source | Proof |
|----|-----------|--------|-------|
| AC-BC-01 | Existing sales/purchases/collections/payments/treasury txns remain valid. | 05.4 | T-INT-012, Matrix #20 |
| AC-BC-02 | `TreasuryBalance` single doc untouched; balances unchanged. | 05.4 | reconciliation test |
| AC-BC-03 | No destructive data migration executed; rollback is trivial. | 05.5 | migration dry-run + revert |

## G. Production Readiness

| ID | Criterion | Source | Proof |
|----|-----------|--------|-------|
| AC-PROD-01 | Backup taken; migrations dry-run successfully (report only). | 05.7 | ops checklist |
| AC-PROD-02 | Deploy backend → frontend lockstep; smoke + regression green. | 09.3, 10-S12 | CI + manual |
| AC-PROD-03 | Integrity checks pass (balance reconciliation, cashbox math, net-position). | 05.6 | script run |
| AC-PROD-04 | Monitoring/alerting in place for export + treasury errors. | 07.7 | ops checklist |

---

**Exit gate:** All AC-FIN / AC-VAL / AC-PARTY / AC-EXP / AC-SEC / AC-BC criteria must be GREEN and demonstrated
by the corresponding tests before Sprint 12 sign-off.
