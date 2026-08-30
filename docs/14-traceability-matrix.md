# 14 — Traceability Matrix

Maps every requirement to Database, Backend, Frontend, UX/UI, Security, Tests, Export, Sprint, and Acceptance
Criteria. Use this to prove no requirement is undocumented or unimplemented.

Legend: ✔ = directly addressed; ◐ = partially / indirectly; — = not applicable.

---

## Requirements → Work Items

### REQ-FIN (Treasury / Payment Channels)

| Req | DB | Backend | Frontend | UX/UI | Security | Tests | Export | Sprint | Acceptance |
|-----|----|---------|----------|-------|----------|-------|--------|--------|------------|
| REQ-FIN-001 | ✔ (02-data-model) | ✔ (FIN-MDL-001) | ✔ (FIN-UI-000) | ✔ (UX-001) | — | ✔ T-UNIT-002 | — | S1, S2 | AC-FIN-01/02 |
| REQ-FIN-002 | ✔ | ✔ (FIN-MDL-001/003/004) | ✔ (FIN-UI-001..006) | ✔ (UX-001/002) | — | ✔ | — | S1, S2, S4–S6 | AC-FIN-02 |
| REQ-FIN-003 | ✔ (FIN-MDL-002) | ✔ (FIN-SVC-001) | ✔ (FIN-UI-009/010) | ✔ (UX-009/010) | — | ✔ T-UNIT-005 | — | S2 | AC-FIN-03/05 |
| REQ-FIN-004 | — | ✔ (FIN-SVC-001 summary) | ✔ (FIN-UI-009/010/011) | ✔ (UX-009) | — | ✔ T-FE-003 | — | S2 | AC-FIN-06 |
| REQ-FIN-005 | ✔ | ✔ (FIN-SVC-002) | ✔ (FIN-UI-008) | ✔ (UX-010) | — | ✔ T-INT-001 | — | S2–S6 | AC-FIN-04 |
| REQ-FIN-006 | — | — | ✔ | ✔ | — | ✔ T-INT-003 | — | S2 | AC-FIN-01 |

### REQ-VAL (Transfer-Source Validation)

| Req | DB | Backend | Frontend | UX/UI | Security | Tests | Export | Sprint | Acceptance |
|-----|----|---------|----------|-------|----------|-------|--------|--------|------------|
| REQ-VAL-001 | ✔ (FIN-MDL-001) | ✔ (FIN-SVC-002) | — | — | — | ✔ | — | S1, S3 | AC-VAL-01 |
| REQ-VAL-002 | ✔ (FIN-MDL-003) | ✔ (FIN-SVC-003/004) | — | — | — | ✔ | — | S3, S4 | AC-VAL-01 |
| REQ-VAL-003 | — | ✔ (FIN-VAL-002/003) | — | — | ✔ SEC-VAL-002 | ✔ T-UNIT-003 | — | S3 | AC-VAL-01/02 |
| REQ-VAL-004 | — | ✔ (FIN-VAL-002) | — | — | — | ✔ T-INT-003 | — | S3 | AC-VAL-03 |
| REQ-VAL-005 | — | ✔ (FIN-VAL-002, FIN-SVC-003) | — | — | — | ✔ T-INT-001..006 | — | S3–S6 | AC-VAL-05 |
| REQ-VAL-006 | — | — | ✔ (FIN-UI-007/008) | ✔ (UX-003/004) | — | ✔ T-FE-001/002 | — | S3 | AC-VAL-04 |
| REQ-VAL-007 | ✔ (optional field) | ✔ (validation-only) | — | — | — | ✔ T-INT-012 | — | S3 | AC-VAL-06 |
| REQ-VAL-008 | ✔ (sourceNumber on txn/payment) | ✔ (FIN-SVC-002) | ✔ (FIN-UI-008 mask) | ✔ (UX-005) | ✔ SEC-PII-001 | ✔ | ✔ (mask in export) | S3, S8 | AC-VAL-01..06 |

### REQ-PARTY (Customer ↔ Supplier Unification)

| Req | DB | Backend | Frontend | UX/UI | Security | Tests | Export | Sprint | Acceptance |
|-----|----|---------|----------|-------|----------|-------|--------|--------|------------|
| REQ-PARTY-001 | ✔ (FIN-MDL-005) | ✔ (FIN-SVC-006) | ✔ (FIN-UI-012/013) | ✔ (UX-006) | — | ✔ T-INT-009 | — | S7 | AC-PARTY-01 |
| REQ-PARTY-002 | ✔ (link fields) | ✔ (FIN-SVC-006, FIN-RTE-001) | ✔ (FIN-UI-012/013) | ✔ (UX-006) | ✔ SEC-AUTH-002 | ✔ T-INT-009 (E3/E4) | — | S7 | AC-PARTY-02 |
| REQ-PARTY-003 | ✔ | ✔ (FIN-SVC-006 net) | ✔ (FIN-UI-014) | ✔ (UX-007) | — | ✔ T-INT-009/010 | — | S7 | AC-PARTY-03 |
| REQ-PARTY-004 | — | ✔ (getNetPosition) | ✔ (FIN-UI-014) | ✔ (UX-007) | — | ✔ T-INT-010 | — | S7 | AC-PARTY-04 |
| REQ-PARTY-005 | — | ✔ (detectDuplicates read-only) | ✔ (FIN-UI-015) | ✔ (UX-008) | — | ✔ T-UNIT-006 | — | S7 | AC-PARTY-05 |
| REQ-PARTY-006 | — | ✔ (FIN-RTE-001, FIN-SVC-006) | ✔ (FIN-UI-015) | ✔ (UX-008) | ✔ SEC-AUTH-002 | ✔ T-INT-009/010 | — | S7 | AC-PARTY-06 |

### REQ-EXP (Export Repair)

| Req | DB | Backend | Frontend | UX/UI | Security | Tests | Export | Sprint | Acceptance |
|-----|----|---------|----------|-------|----------|-------|--------|--------|------------|
| REQ-EXP-001 | — | ✔ (FIN-RTE-003, FIN-EXP-001) | ✔ (FIN-UI-016) | ✔ (UX-011) | ✔ SEC-AUTH-001 | ✔ T-INT-011 (E5) | ✔ | S8 | AC-EXP-01/07 |
| REQ-EXP-002 | — | ✔ (FIN-EXP-001 filters) | ✔ (FIN-UI-016 filters prop) | ✔ (UX-011) | ✔ SEC-EXP-002 | ✔ T-INT-011 (E6) | ✔ | S8 | AC-EXP-02/04 |
| REQ-EXP-003 | — | ✔ (FIN-EXP-002) | ✔ | ✔ (UX-013) | — | ✔ | ✔ | S8 | AC-EXP-05 |
| REQ-EXP-004 | — | ✔ (FIN-EXP-002 Arabic) | — | ✔ (UX Arabic) | — | ✔ visual | ✔ | S8 | AC-EXP-05 |
| REQ-EXP-005 | — | ✔ (formatting) | — | — | — | ✔ | ✔ | S8 | AC-EXP-05 |
| REQ-EXP-006 | — | ✔ (FIN-EXP-003 stream) | — | ✔ (UX-013) | ✔ SEC-EXP-003 | ✔ T-INT-011 (E7) | ✔ | S8 | AC-EXP-06 |
| REQ-EXP-007 | — | ✔ (FIN-EXP-001 auth + FIN-EXP-004 mask) | — | — | ✔ SEC-EXP-001/002, SEC-PII-001 | ✔ T-INT-011 (E5/E6) | ✔ | S8 | AC-EXP-03 |
| REQ-EXP-008 | — | ✔ (per-resource serializers) | ✔ (FIN-UI-018) | ✔ (UX-011) | — | ✔ T-FE-005 | ✔ | S8 | AC-EXP-01 |
| REQ-EXP-009 | — | ✔ (centralized column maps) | ✔ (FIN-UI-017) | — | — | ✔ T-UNIT-007 | ✔ | S8 | AC-EXP-01 |
| REQ-EXP-010 | — | ✔ (FIN-EXP-001 error handling) | ✔ (FIN-UI-016/018) | ✔ (UX-012) | — | ✔ | ✔ | S8 | AC-EXP-07 |

---

## Coverage Confirmation

- Every `REQ-*` has at least one Backend OR Frontend task and at least one Test.
- Every Sprint (S1–S12) maps to requirements above.
- Every Acceptance Criterion (AC-*) is traceable to a `REQ-*` and a test.
- No requirement is left as "UNKNOWN — requires implementation investigation" except the GL account strings
  (REQ-FIN-005 / FIN-SVC-005), which are explicitly scheduled for resolution in Sprint 1 before coding.
