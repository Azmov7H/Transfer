# CRITICAL Findings

## DX-001 — Validation Pipeline Broken End-to-End
- **Severity:** CRITICAL · **Category:** DX/BUILD
- **Files:** `eslint.config.mjs`, `jest.config.js`, `src/lib/validators.test.js`, `package.json`, lockfiles
- **Evidence:**
  - `npm run lint` → `TypeError: Converting circular structure to JSON` in `@eslint/eslintrc/lib/shared/config-validator.js` while normalizing `next/core-web-vitals` via FlatCompat.
  - `npm test` → `Cannot find module` at `validators.test.js:5` (extensionless relative import under next/jest).
  - Git tracks `package-lock.json`; disk install is pnpm (`node_modules/.pnpm/*`); untracked `pnpm-lock.yaml` + `pnpm-workspace.yaml` (no `packages:` key); no `packageManager` field.
- **Problem:** No quality gate (lint/typecheck/test/build) can pass, so no remediation task can demonstrate completion.
- **Root Cause:** Mixed package-manager install corrupting config resolution + flat-config migration done through legacy compat layer + jest mapper never tested.
- **Impact:** Blocks the entire sprint program; masks latent lint errors across 106 client files.
- **Recommendation:** Sprint 00. Fix ESLint config to native flat format, repair jest resolution, standardize on one package manager, verify build.
- **Tasks:** FE-DX-001, FE-DX-002, FE-CLEAN-001, FE-DX-004

## ERR-001 — Missing Global Error Surfaces; ErrorBoundary Never Mounted
- **Severity:** CRITICAL · **Category:** ERR/NEXT
- **Files:** `src/app/` (missing `error.jsx` root, `global-error.jsx`, `not-found.jsx`), `src/components/ErrorBoundary.jsx` (0 importers)
- **Evidence:** `find src/app -name error.jsx -o -name not-found* -o -name global-error*` → only `(protected)/error.jsx`. Grep for ErrorBoundary imports outside itself → none.
- **Problem:** Uncaught render errors blank the screen with no recovery UI anywhere outside `(protected)`; a throw inside the protected layout or any public route is unrecoverable; unknown URLs render Next's default English 404 inside an Arabic RTL app.
- **Root Cause:** Error infrastructure was built (`ErrorBoundary.jsx`, segment error.jsx) but never wired to a complete coverage model.
- **Impact:** Any regression in Sprint work can ship as white-screen; worst possible failure UX for non-technical operators.
- **Recommendation:** Add root + global-error + localized not-found; decide ErrorBoundary placement for widget-level isolation.
- **Tasks:** FE-ARCH-001
