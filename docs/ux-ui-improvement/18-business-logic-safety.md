# 18 — Business Logic Safety Matrix

## Master matrix

| Area | Can Change UX/UI? | Can Change Logic? | Risk | Notes |
|---|---|---|---|---|
| Navigation config/labels/icons | Yes | No | Low | permission mapping must be identical (snapshot test) |
| Page layout/grouping/tabs | Yes | No | Low-Med | role-gated content must stay gated per surface |
| Colors/typography/spacing | Yes | No | Low | print views partially exempt |
| Table columns presentation | Yes (reorder/priority/hide-behind-toggle) | No (data) | Medium | every datum stays reachable |
| Filters/sorting UI | Yes | Presentation only | Medium | no new server params invented |
| Forms layout/labels/errors | Yes | No | Medium | payload construction reviewed per form |
| Validation **semantics** | No | No | Critical | validators in `lib/validators.js` untouched; presentation of messages allowed |
| Payment flows | Container/UI yes | No | High | parity matrix before any dialog deletion |
| Installment schedules display | Yes | No | High | math display copied as-is |
| API calls/services layer | No | No | Critical | `src/services/**` frozen during UX program except none planned |
| Permissions/roles gating | No | No | Critical | ROLES + permissions lib frozen; nav filtering behavior preserved |
| Calculations (totals, balances, profit) | No | No | Critical | display-only formatting allowed (thousands separators already exist) |
| Auth/session handling | No | No | Critical | fetcher 401 logic, guards untouched |
| Database/backend | No | No | Critical | out of scope entirely |
| Workflow outcomes (invoice lifecycle, PO receiving, inventory approval) | No | No | Critical | steppers/indicators may *visualize* existing states only |
| Routes/URLs | Mostly no | — | Med | IA proposals keep URLs; any future URL move = separate approved task |
| Arabic copy | Verbatim by default | Terminology changes need review | Medium | label disambiguation list reviewed before implementation |

## REQUIRES BUSINESS DECISION register
| ID | Topic | Doc | Blocking? |
|---|---|---|---|
| BD-1 | Accounting page relationship to financial hub | 03,16 | Blocks full IA-1 merge; interim links unblocked |
| BD-2 | Daily-sales placement (nav vs reports) | 03 | Blocks its nav entry only |
| BD-3 *(discovered)* | "طلب" button on low-stock alert target flow | 08 | Button links to existing purchase flow; if owner wants auto-PO creation → business decision, not planned |

## Preservation mechanisms (implementation-time)
1. **Logic-diff checklist** on every PR: statement that hooks/services/mutations/validators diffs are empty or presentation-only.
2. **Parity matrices** for payment consolidation and customers decomposition (field × validation × endpoint × success).
3. **Golden-flow manual scripts**: login, invoice create+print, debt collect (per entry point), product create, report view — run per phase.
4. **Existing tests as tripwire**: 59-test suite (permissions matrix, fetcher semantics, invoice-items math, notification gating) must stay green throughout.
5. **Snapshot tests added** for: navigationConfig role filtering, StatusBadge mapping, ResponsiveTable config API.

## Explicit non-goals
No endpoint changes; no schema changes; no permission model changes; no removal of business data from any screen; no workflow shortcuts that skip steps (e.g., no auto-approve).
