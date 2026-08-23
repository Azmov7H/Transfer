# Form Pattern — RHF + zod (FE-FORM-001)

The standard way every form dialog is built from Sprint 04 onward.

## Stack

| Piece | Choice | Notes |
|---|---|---|
| State/validation | `react-hook-form` | installed; single source of form state |
| Schemas | `zod` (`src/validations/*.schema.js`) | Arabic messages live **in the schema** |
| Resolver | `src/components/forms/zodResolver.js` | dependency-free; same contract as `@hookform/resolvers/zod` (not installed, no network) |
| Field wrapper | `src/components/forms/FormField.jsx` → `<FormField>` | label + control + inline error line |
| Server errors | `mapServerFieldErrors(err)` → `setError(field, ...)` | maps `JammazApiError.data` shapes `{field: msg}`, `{errors: {field: msg}}`, arrays |

## Rules

1. **No per-field `useState`.** Form state lives in `useForm`; inputs bind via `register()` or `Controller`.
2. **Validation messages are Arabic strings inside the zod schema** — never duplicated in components.
3. **Double-submit protection by construction:** submit button `disabled={isPending || isSubmitting}`. RHF also ignores re-submits while validating.
4. **Server field errors** land on the matching field via `mapServerFieldErrors` + `setError`; unmapped failures rethrow to the mutation's toast policy (D10).
5. **Dialogs own their form; parents own mutations.** Parent `onSubmit(values)` receives parsed, schema-valid data and returns a promise when server-error mapping is wanted.
6. Controlled shadcn widgets (Select/Switch/Combobox) bind via `Controller`.

## Canonical example

```jsx
const { register, handleSubmit, control, reset, setError,
        formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues,
});

useEffect(() => { if (open) reset(defaultValues); }, [open]);

const onValid = async (values) => {
    try {
        await onSubmit(values);            // parent mutation
    } catch (err) {
        const server = mapServerFieldErrors(err);
        if (server) Object.entries(server).forEach(([f, e]) => setError(f, e));
        else throw err;                    // toast policy handles it
    }
};

<form onSubmit={handleSubmit(onValid)} noValidate>
    <FormField label="اسم العميل" required error={errors.name}>
        <Input {...register('name')} />
    </FormField>
    ...
    <Button type="submit" disabled={isPending || isSubmitting}>حفظ</Button>
</form>
```

## Pilots

- `src/components/customers/CustomerFormDialog.jsx` (+ `validations/customer.schema.js`)
- `src/components/products/ProductFormDialog.jsx` (reuses `validations/product.schema.js`)

## Rollout

Remaining dialogs migrate opportunistically during Sprint 05 page decompositions (FE-PAGES-001..004).
