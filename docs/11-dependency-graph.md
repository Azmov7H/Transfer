# 11 — Dependency Graph

Recommended implementation order (arrows = "must precede").

```
[Discovery / Architecture]  (docs/ — DONE)
        │
        ▼
[S1 Database & Financial Foundation]
   - method enum + Zod + accounting GL accounts
        │
        ├───────────────┬───────────────────┐
        ▼               ▼                   ▼
[S2 Treasury/Payment   [S3 Transfer-Source  [S7 Customer/Supplier
    Methods]            Validation]           Unification (Option B)]
   - instapay channel    - sourceNumber +      - models + partyService
     + cashbox map         conditional rule     + link routes/UI
        │                  - forward in svc
        │                        │
        └───────────┬────────────┘
                    ▼
        [S4 Sales] → [S5 Collections] → [S6 Supplier Payments]
                    (all depend on S2+S3)
                        │
                        ▼
                [S8 Export Repair]
            (needs all data modules' serializers)
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
   [S9 UX/UI]    [S10 Security]    [S11 Testing/Regression]
                        │                │
                        └───────┬────────┘
                                ▼
                    [S12 Production Readiness]
```

## Notes

- S2 and S3 are tightly coupled (channel + validation); S3 cannot enforce "instapay requires source" until the
  `instapay` method exists (S2) and the `sourceNumber` field exists (S1).
- S7 (unification) is largely independent of the financial channel work and can run in parallel with S2–S6;
  it is sequenced after S1 only because it needs model fields.
- S8 (export) is last among feature sprints because it depends on having stable serializers for every module
  (customers, suppliers, invoices, POs, treasury, reports).
- Security (S10) overlaps S3/S7/S8 and is called out as a cross-cutting sprint but should be implemented
  incrementally within those sprints (don't defer all security to the end if it blocks a feature).
- Tests (S11) run continuously but the formal regression gate is pre-production.
