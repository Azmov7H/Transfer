# Test Matrix (companion to `08-testing/README.md`)

Every row maps to a backend integration test (T-INT-*) and/or frontend test (T-FE-*). IDs follow
`08-testing/README.md`. "Expected" = system behavior after the enhancement.

| # | Module | Scenario | Payment Method | Source Number | Expected | Test ID |
|---|--------|----------|----------------|--------------|----------|---------|
| 1 | Sale | Cash sale | Private Treasury (`cash`) | empty | ✅ Success | T-INT-001/3 |
| 2 | Sale | InstaPay sale | `instapay` | present | ✅ Success | T-INT-001 |
| 3 | Sale | InstaPay sale | `instapay` | empty | ❌ Reject (400) | T-INT-002 |
| 4 | Sale | Cash Wallet sale | `wallet` | present | ✅ Success | T-INT-001 |
| 5 | Sale | Cash Wallet sale | `wallet` | empty | ❌ Reject (400) | T-INT-002 |
| 6 | Collection | Cash collection | `cash` | empty | ✅ Success | T-INT-003 |
| 7 | Collection | InstaPay collection | `instapay` | present | ✅ Success | T-INT-004 |
| 8 | Collection | InstaPay collection | `instapay` | empty | ❌ Reject (400) | T-INT-004 |
| 9 | Collection | Cash Wallet collection | `wallet` | present | ✅ Success | T-INT-004 |
| 10 | Collection | Cash Wallet collection | `wallet` | empty | ❌ Reject (400) | T-INT-004 |
| 11 | Supplier Payment | Cash payment | `cash` | empty | ✅ Success | T-INT-005 |
| 12 | Supplier Payment | InstaPay payment | `instapay` | present | ✅ Success | T-INT-005 |
| 13 | Supplier Payment | InstaPay payment | `instapay` | empty | ❌ Reject (400) | T-INT-005 |
| 14 | Supplier Payment | Cash Wallet payment | `wallet` | present | ✅ Success | T-INT-005 |
| 15 | Supplier Payment | Cash Wallet payment | `wallet` | empty | ❌ Reject (400) | T-INT-005 |
| 16 | Manual Expense | InstaPay expense | `instapay` | present | ✅ Success | T-INT-002 (expense) |
| 17 | Manual Expense | InstaPay expense | `instapay` | empty | ❌ Reject (400) | T-INT-002 (expense) |
| 18 | Sales Return | Refund via InstaPay | `instapay` | destination present (opt) | ✅ Success | T-INT-006 (return) |
| 19 | Bank transfer | Bank | `bank` | empty | ✅ Success (source optional) | T-INT-001 (bank) |
| 20 | Historical | Pre-change wallet txn | `wallet` (legacy) | empty (legacy) | ✅ Valid; never rejected | T-INT-012 |

## Negative / Edge Cases (additional)

| # | Scenario | Expected | Test ID |
|---|----------|----------|---------|
| E1 | Unknown `method` value | ❌ 400 (enum) | T-UNIT-002 |
| E2 | `sourceNumber` with control chars | ❌ 400 (sanitized) | T-UNIT-003 / SEC-VAL-001 |
| E3 | Party self-link (customer==supplier) | ❌ 400 | T-INT-009 |
| E4 | Party double-link | ❌ Conflict / idempotent | T-INT-009 |
| E5 | Export without auth | ❌ 401/403 | T-INT-011 / SEC-EXP-001 |
| E6 | Export with IDOR partnerId | ❌ Filtered out | T-INT-011 / SEC-EXP-001 |
| E7 | Export >100k rows | ✅ Completes (streamed) | T-INT-011 |
| E8 | Treasury balance after mixed channels | ✅ Reconciles | T-INT-012 |

## Coverage Gate

- All 20 primary rows + E1–E8 must be green before Sprint 10 exit.
- `requiresSourceNumber` + Zod superRefine unit tests are the gate for FIN-VAL-* tasks.
