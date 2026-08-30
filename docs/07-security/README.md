# 07 — Security Plan

Threats and mitigations for the enhancement. Reuses existing `authMiddleware` + `roleMiddleware` + `helmet`
+ `mongoSanitize` + `hpp` + rate limiting. New surfaces: `instapay` channel, `sourceNumber` PII, party links,
export endpoint.

## 07.1 — Authorization

- **SEC-AUTH-001** — All new endpoints (`/api/customers/:id/link-supplier`, `/api/suppliers/:id/link-customer`,
  `/api/export`) MUST mount `authMiddleware` + appropriate `roleMiddleware`. Export requires at least `viewer`;
  sensitive-column export (e.g., `sourceNumber`) requires `owner`/`manager`.
- **SEC-AUTH-002** — Party link endpoints: `owner`/`manager` only (consistent with other counterparty writes).

## 07.2 — Input Validation / Injection

- **SEC-VAL-001** — `sourceNumber` MUST be length-bounded (`maxlength:200`), trimmed, and rejected if it contains
  control chars / path separators (defense-in-depth beyond Zod). No reflection into shell/logs unescaped.
- **SEC-VAL-002** — Method enum enforced server-side (Zod) — never trust client `method`; reject unknown values
  (prevents "treasury manipulation" via fake channel).
- **SEC-VAL-003** — `mongoSanitize` + `hpp` already active; ensure new query params (export filters) go through the
  same sanitization (they do via `express` pipeline). Validate `filters` schema in export route (no arbitrary Mongo
  query passthrough).

## 07.3 — Financial / Amount Manipulation

- **SEC-FIN-001** — Amounts remain server-validated (positive, bounded `max(1e9)` per existing `money` schema). New
  `instapay` path reuses the same guards — no new amount surface.
- **SEC-FIN-002** — Treasury balance integrity: all writes still go through `_createTransactions`/`_deleteTransaction`
  (single choke point). Do NOT add any balance mutation outside `TreasuryService`. Regression test required.
- **SEC-FIN-003** — `sourceNumber` is not used in any balance math (display/audit only) → no leverage for balance
  manipulation.

## 07.4 — Source-Number Spoofing / PII

- **SEC-PII-001** — `sourceNumber` is sensitive (bank/ wallets identifiers). Rules:
  - Stored verbatim (needed for audit) but **masked in UI** (last 4) and **excluded from exports** unless
    `owner`/`manager`.
  - Logged only in redacted form (e.g., `instapay:****4821`).
  - Not returned in list endpoints unless role permits; detail/receipt endpoints may show masked.
- **SEC-PII-002** — Add `sourceNumber` to the system's PII inventory; ensure it is not leaked via logs
  (`lib/logger`) or error envelopes (`JammazApiError.data` must not echo full `sourceNumber`).

## 07.5 — IDOR on Export / Filters

- **SEC-EXP-001** — Export MUST scope results to the authenticated user's permissions; never accept a raw `_id` list
  or `partnerId` that the user cannot access. Reuse the same query builders the UI uses (which already enforce
  visibility).
- **SEC-EXP-002** — Export `filters` must be validated; reject unsupported keys; prevent NoSQL injection via filter
  objects (schema-validate, no `$` operators from client).
- **SEC-EXP-003** — Rate-limit export endpoints (reuse `heavyLimiter`); large exports may be queued/async to avoid
  DoS.

## 07.6 — Tenant / Company Isolation

- **SEC-TEN-001** — System appears single-tenant today (no `companyId` in models). If multi-tenant is introduced
  later, export + party links MUST filter by tenant. Document as future-proofing; not in scope now.

## 07.7 — Audit Logging

- **SEC-AUD-001** — Log party link/unlink actions and export actions via existing `LogService`
  (`logAction`), including actor `req.user._id`, target ids, and redacted source info. Supports forensic traceability
  for electronic transfers.

## 07.8 — Session / JWT

- No change to auth flow. Ensure new endpoints respect `tokenVersion` revocation (they do via `authMiddleware`).

## Acceptance

- Pen-test checklist in `13-acceptance-criteria.md` Security section. Automated tests: unauthorized export → 403;
  missing source for instapay → 400 (not stored); IDOR attempt on export → filtered; PII masking verified in responses.
