# 16 — Dependency Audit

Runtime deps: 33. Verified usage via grep across `src/`.

## Findings

### DEP-001 — Declared-but-Unused / Redundant Libraries (MEDIUM)
| Package | Status | Evidence |
|---|---|---|
| `react-hook-form` ^7.69 | installed, **0 imports** | grep |
| `dotenv` ^17.2.3 | unneeded at runtime (Next loads env natively); likely only for the missing `scripts/seed.js` | no import in src/ |
| `tailwindcss-animate` **and** `tw-animate-css` | two plugins solving the same problem; VERIFY which tailwind.config references, keep one | package.json both |
| `chart.js`+`react-chartjs-2` vs `recharts` | both used (3 charts total) — consolidate to one, remove other (~100KB+) | PERF-002 |
| `@tanstack/react-query-devtools` | correctly dev-gated ✅ keep | QueryProvider.jsx:28 |
| `exceljs` + `jspdf` + `jspdf-autotable` | used but statically imported; keep after lazy-loading (PERF-001) | ExportButton.jsx |

### DEP-002 — Version Posture (INFO)
All deps are current majors (Next 16, React 19, Tailwind 3.4, RQ5, zod 4). No deprecated libraries detected. No `npm audit` executed during audit (network-dependent) — run as part of Sprint 00 validation and record output.

### DEP-003 — Upgrade Rules
No blind upgrades. Any bump must document: why / risk / compatibility / required code changes. Highest-risk candidate noted: Tailwind 3→4 (breaking config migration) — **not recommended** within this program.

## Package Manager Conflict → see DX-001 (CRITICAL)
`package-lock.json` tracked in git while `node_modules/.pnpm/*` shows a pnpm install; `pnpm-lock.yaml` + `pnpm-workspace.yaml` sit untracked on disk; no `packageManager` field. This mixed state is the likely root cause of the ESLint FlatCompat crash. Resolution is FE-CLEAN-001 (Sprint 00): choose pnpm (matches on-disk reality), commit its lockfile, add `"packageManager"` field, regenerate install, delete npm lockfile.
