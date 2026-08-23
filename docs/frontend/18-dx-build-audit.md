# 18 — DX / Build Audit

## Command Reality (executed during audit)

| Command | Status | Detail |
|---|---|---|
| `npm run lint` | ❌ CRASH | `TypeError: Converting circular structure to JSON` from `@eslint/eslintrc` config-validator — FlatCompat wrapping `next/core-web-vitals` fails under current install layout |
| `npm test` | ❌ FAIL | jest cannot resolve extensionless import in the only test file (`validators.test.js:5`) |
| `npm run build` | ⚠ NOT RUN | must be verified first thing in Sprint 00 (FE-DX-004) |
| `npm run dev` | assumed OK | not executed in audit |
| typecheck | n/a | no TypeScript configured |

## Findings

### DX-001 — Validation Pipeline Broken End-to-End (CRITICAL)
Three compounding causes:
1. ESLint 9 flat-config via `FlatCompat` crashing (circular structure serializing legacy config).
2. Jest module resolution misconfigured for the codebase's extensionless-relative-import style.
3. Package-manager split-brain: git tracks `package-lock.json`, disk is pnpm-installed, `pnpm-lock.yaml`/`pnpm-workspace.yaml` untracked, no `packageManager` field.
Consequence: **no quality gate can pass**, so no task in any sprint can prove completion. This is why Sprint 00 exists and why it blocks everything.

### DX-002 — Broken npm Script (LOW)
`"seed": "node scripts/seed.js"` → `scripts/` directory does not exist. Remove or restore.

### DX-003 — No `.env.example` (LOW)
App requires `JWT_SECRET` (middleware), `API_PROXY_TARGET` (next.config rewrite), optional `NEXT_PUBLIC_API_URL`. Nothing documents them; `lib/auth.js:8` would even throw if its dead module were ever imported without JWT_SECRET. Ship a keys-only `.env.example`.

### DX-004 — No CI
No workflow/pipeline files in repo. Out of scope to build infra, but Sprint 11 defines the minimal gate set (lint+test+build green locally documented) and a future CI task is noted as optional.

## Positives
- Scripts are conventional; jest wired through `next/jest`; `@/*` alias mapped in both jsconfig and jest moduleNameMapper.
- next.config is clean and production-aware.
