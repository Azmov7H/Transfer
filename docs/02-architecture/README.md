# 02 — Proposed Architecture

Target design for the enhancement. These are recommendations; the implementation tasks live in `03`–`08`.

| Doc | Topic |
|-----|-------|
| `proposed-treasury-architecture.md` | How channels (incl. InstaPay) are represented |
| `proposed-data-model.md` | Schema/field changes (method, sourceNumber, links) |
| `proposed-customer-supplier.md` | Party unification approach (Option B recommended) |

All recommendations preserve the **single running treasury balance** and the **separate Customer/Supplier
collections** to minimize migration risk and protect historical financial integrity.
