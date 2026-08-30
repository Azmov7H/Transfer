# Jammaz System — Financial & Customer/Supplier Enhancement

## Plan Documentation Master Index

> **PHASE:** Discovery & Planning ONLY. No source code, schemas, migrations, or packages were
> modified. Repository is unchanged. This is an implementation-ready engineering plan.

This documentation set analyzes the **existing** Jammaz System and designs changes for:

1. **Treasury / Payment Channels** — Private Treasury, InstaPay, Cash Wallet
2. **Transfer-Source Validation** — require source/account number for InstaPay & Cash Wallet
3. **Customer ↔ Supplier Unification** — one entity, two roles
4. **Export Repair** — audit and fix all export functionality

---

## Repository Layout (discovered)

| Layer | Path | Stack |
|-------|------|-------|
| Frontend | `/home/ali/Desktop/web/JM/Jammaz-System` | Next.js 16 (App Router), React 19, Tailwind, shadcn/ui, React Query, RHF, Zod, jsPDF |
| Backend | `/home/ali/Desktop/web/JM/be-Jammaz` | Node.js Express, Mongoose/MongoDB, Zod, layered (routes→services→repositories→models) |
| Proxy | `next.config.mjs` rewrites `/api/*` → `API_PROXY_TARGET` (default `127.0.0.1:5050`, env `:5000`) | — |
| DB | MongoDB (per `docker-compose.production-local.yml`, `mongo:7`) | — |

The frontend and backend are **separate repos** in sibling directories under `/home/ali/Desktop/web/JM/`.
The frontend talks to the backend exclusively through `/api/*` (rewritten) or `NEXT_PUBLIC_API_URL`.

---

## Documentation Map

```
docs/
├── README.md                          (this file — master index)
├── 00-current-system/                 Existing architecture (discovered from source)
│   ├── README.md
│   ├── architecture.md
│   ├── frontend-architecture.md
│   ├── backend-architecture.md
│   ├── database-architecture.md
│   ├── financial-architecture.md
│   ├── customer-supplier-architecture.md
│   ├── export-architecture.md
│   └── dependency-map.md
├── 01-requirements/                   Requirement breakdown
│   ├── README.md
│   ├── financial-channels.md
│   ├── transfer-source-validation.md
│   ├── customer-supplier-unification.md
│   └── export-repair.md
├── 02-architecture/                   Proposed target architecture
│   ├── README.md
│   ├── proposed-treasury-architecture.md
│   ├── proposed-data-model.md
│   └── proposed-customer-supplier.md
├── 03-frontend/                       Frontend task plan
├── 04-backend/                        Backend task plan
├── 05-database/                       DB / migration plan
├── 06-ux-ui/                          UX/UI plan
├── 07-security/                       Security plan
├── 08-testing/                        Testing plan + matrix
├── 09-git/                            Branch & commit strategy
├── 10-sprints/                        Sprint breakdown
├── 11-dependency-graph.md
├── 12-risk-register.md
├── 13-acceptance-criteria.md
├── 14-traceability-matrix.md
└── FINAL-IMPLEMENTATION-PLAN.md
```

There is **pre-existing** documentation under `docs/frontend/` and `docs/ux-ui-improvement/`
(audit reports). Those remain untouched; this plan is additive and addresses the new enhancement
scope. Where the prior audits overlap, this plan links rather than duplicates.

---

## Key Discovered Facts (TL;DR for implementers)

- **Payment methods already exist** as `TreasuryTransaction.method` enum
  `['cash','bank','wallet','check','adjustment']` (`be-Jammaz/models/TreasuryTransaction.js:44`).
  - `cash` ≈ **Private / Main Cash Treasury**
  - `wallet` ≈ **Cash Wallet** (UI labels: "محفظة", "محفظة كاش", "محفظة إلكترونية")
  - **InstaPay does NOT exist** — must be added `instapay`.
- **Treasury is a SINGLE aggregated balance** (`TreasuryBalance`, one fixed doc `_id:'treasury'`)
  with a per-day `CashboxDaily` breakdown by method (cash/bank/wallet/check). There are **no
  separate treasury accounts** today.
- **No `sourceNumber` / transfer-reference field exists anywhere.** Must be added and made
  required conditionally for `instapay` and `wallet`.
- **Customer and Supplier are SEPARATE collections** (`models/Customer.js`, `models/Supplier.js`)
  with independent balances. `Debt` is polymorphic (`debtorType: ['Customer','Supplier']`).
  `UnifiedCollection` is a fragile surrogate model over the `customers` collection — tech debt.
- **Export is partially BROKEN**: `ExportButton.jsx` Excel path calls `POST /api/export` which
  **has no backend route**; PDF path uses jsPDF with **no Arabic font** (garbled Arabic).
  Only `accounting/page.jsx` client-side CSV export works. Report endpoints return JSON only.

See `00-current-system/` for full detail and `FINAL-IMPLEMENTATION-PLAN.md` for the summary.

---

## How to Read This Plan

1. Read `00-current-system/` to understand the system as-built.
2. Read `01-requirements/` for the business rules being enforced.
3. Read `02-architecture/` for the recommended target design.
4. Implement per `03-frontend/` … `08-testing/` tasks, grouped by sprint in `10-sprints/`.
5. Track coverage via `14-traceability-matrix.md`; verify via `13-acceptance-criteria.md`.

> **Rule:** Do not begin implementation until this plan is reviewed and approved. No code was
> changed during planning.
