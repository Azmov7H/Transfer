# 14 — Design System (Target Taxonomy)

Consolidates proposals from docs 04–13 into one component system. Categories: Layout, Navigation, Forms, Data Display, Feedback, Overlay, Actions, Status, Typography.

## Principles
1. **Semantic tokens only** — no raw palette classes in app surfaces.
2. **One pattern per job** — one page header, one table kit, one payment dialog, one form kit.
3. **Composition over configuration sprawl** — primitives from `ui/` composed by feature-level kits in `components/common` / `components/forms`.
4. **Arabic/RTL first** — every component verified RTL before desktop polish.

## Component Inventory (target)

### Layout
| Component | Status | Plan |
|---|---|---|
| PageShell (container + section rhythm) | new | UX-040 |
| PageHeader (title/subtitle/actions/breadcrumb) | exists → rewrite | UX-032 |
| Card / CardHeader / CardContent | exists | keep |
| Tabs | exists | keep; add scrollable mobile variant |
| Separator | exists | keep |

### Navigation
Sidebar (+Item/Group), Header, Breadcrumbs (in PageHeader), CommandPalette — see doc 04.

### Forms
| Component | Status |
|---|---|
| FormKit: FormLayout, FieldRow, TextField, SelectField, DateField, NumberField, FooterActions, ErrorText | new (UX-060) built on ui/field.jsx + zodResolver shim + lib/validators.js |
| SmartCombobox | exists — canonical entity picker |
| ConfirmDialog | exists — all destructive flows |

### Data Display
| Component | Status |
|---|---|
| ResponsiveTable (extended API) | extend (UX-070) |
| DataTable primitives (ui/table) | keep as base layer |
| StatCard / KPICard | **merge into one** KPIStat (UX-052) |
| AmountText / IdText (numeric isolation) | new (UX-034) |
| EmptyState / LoadingState / ErrorState | exist — mandatory everywhere |
| RevenueChart + chartPalette | restyle (UX-021) |

### Status
StatusBadge — single source of business-state→(token,icon,label) mapping. Replaces per-feature badge logic.

### Overlay
Dialog (sm/md/lg), Sheet (side + bottom-mobile variant), DrawerForm (FormKit inside Sheet), UnifiedPaymentDialog, CommandPalette popover. Anti-nesting rule enforced by convention + review checklist.

### Actions
Button variants: primary / secondary / outline / ghost / destructive — sizes sm/md/icon; loading state built-in. RowActions (≤3 icons + ⋯ menu). FilterChips (enum toggles w/ aria-pressed).

### Typography
Type scale roles as utility classes documented in doc 06; enforced via ESLint bans (UX-035). AmountText handles numerals.

## Governance
- New UI must compose these; PR checklist references this taxonomy.
- Allow-lists (raw colors, font-black, print styles) live in `.eslintrc` comments + here.
- Chart palette constant exported from `src/lib/chart-palette.js`.

## Business Logic Preservation
Taxonomy is presentational; feature components keep their hooks/services wiring untouched during adoption.

## Dependencies
Docs 05–12 tasks produce the pieces; this document is the reference contract they must satisfy.
