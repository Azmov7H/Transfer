# 12 — Risk Register

Severity × Probability → Mitigation / Verification / Rollback. Implementation phase only (planning made no changes).

## REG-01 — Treasury balance/math regression when adding instapay
- **Severity:** Critical **Probability:** Medium
- **Impact:** Incorrect running balance or cashbox totals → wrong financial statements.
- **Mitigation:** All writes stay in `TreasuryService` choke point; centralize method→field map; add reconciliation
  test (T-INT-012) comparing `TreasuryBalance` to ledger sum.
- **Verification:** T-INT-001/012; post-deploy integrity check (05.6).
- **Rollback:** deploy previous backend (additive change).

## REG-02 — Historical data rejected by new sourceNumber rule
- **Severity:** Critical **Probability:** Low (by design)
- **Impact:** Reads/migrations fail if rule applied retroactively.
- **Mitigation:** Rule is validation-only for NEW transactions; DB field optional; no migration rewrites old rows.
- **Verification:** T-INT-012 (legacy wallet txn valid); matrix row 20.
- **Rollback:** n/a (no historical change).

## REG-03 — Customer/Supplier duplicate auto-merge destroys history
- **Severity:** Critical **Probability:** Low
- **Impact:** Lost role-specific balances/debts.
- **Mitigation:** Option B (cross-link, no merge); detection is READ-ONLY; linking is explicit/user-confirmed;
  unlink is trivial.
- **Verification:** T-INT-009/010; net-position equals sum of parts.
- **Rollback:** unset link fields (single update).

## REG-04 — Export endpoint introduces IDOR / data leak
- **Severity:** High **Probability:** Medium
- **Impact:** User exports another party's data.
- **Mitigation:** SEC-EXP-001/002 (auth + validated filters + reuse UI query builders); mask PII (SEC-PII-001).
- **Verification:** T-INT-011 E5/E6.
- **Rollback:** disable route.

## REG-05 — Arabic rendering broken in PDF export
- **Severity:** High **Probability:** High (jsPDF default font)
- **Impact:** Garbled Arabic → unusable PDFs; business rejection.
- **Mitigation:** embed Arabic font (Amiri/Noto) OR use RTL-capable lib (pdfkit+arabic) OR prioritize XLSX/CSV
  (which handle Arabic via UTF-8); decide in implementation, pilot before full rollout.
- **Verification:** visual check of exported PDF/Excel with Arabic data.
- **Rollback:** disable PDF option, keep CSV/XLSX.

## REG-06 — Large export OOM / timeout
- **Severity:** Medium **Probability:** Medium
- **Impact:** Server crash / hung request under load.
- **Mitigation:** server-side streaming/pagination; reuse `heavyLimiter`; async where needed.
- **Verification:** T-INT-011 E7 (100k rows).
- **Rollback:** cap export size / disable for huge sets.

## REG-07 — GL account mapping unknown for instapay
- **Severity:** Medium **Probability:** Medium
- **Impact:** inconsistent double-entry posting.
- **Mitigation:** read `services/accountingService.js` in S1; document account per channel; add test asserting
  posting.
- **Verification:** accounting test; manual ledger review.
- **Rollback:** n/a (additive posting).

## REG-08 — Cross-repo (frontend/backend) version drift
- **Severity:** High **Probability:** Medium
- **Impact:** frontend calls `/api/export` or `instapay` before backend supports it → 404/validation errors.
- **Mitigation:** lockstep release (09.3); backend deployed first; contract tests; feature flags.
- **Verification:** integration E2E per sprint.
- **Rollback:** revert frontend to previous version.

## REG-09 — UnifiedCollection surrogate fragility
- **Severity:** Low **Probability:** Low
- **Impact:** refPath target ambiguity if collections restructured.
- **Mitigation:** leave as-is for Option B; note tech debt; revisit only if Option A attempted later.
- **Verification:** existing unified-collection tests.
- **Rollback:** n/a.

## REG-10 — Rate-limit / auth gaps on new endpoints
- **Severity:** Medium **Probability:** Low
- **Impact:** abuse of export/link endpoints.
- **Mitigation:** mount `authMiddleware`+`roleMiddleware`; export under `heavyLimiter`.
- **Verification:** T-INT-011 E5.
- **Rollback:** n/a.

## REG-11 — Source-number PII leakage via logs/exports
- **Severity:** High **Probability:** Medium
- **Impact:** compliance/legal exposure.
- **Mitigation:** SEC-PII-001/002 (mask in UI/logs; exclude from exports unless owner/manager; never echo in errors).
- **Verification:** grep logs for raw sourceNumber; export column check.
- **Rollback:** n/a.
