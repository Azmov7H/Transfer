/**
 * Dependency-free react-hook-form resolver for zod schemas.
 * Same contract as @hookform/resolvers/zod (which is not installed).
 */
export function zodResolver(schema) {
    return async (values) => {
        const result = await schema.safeParseAsync(values);
        if (result.success) {
            return { values: result.data, errors: {} };
        }
        const errors = {};
        for (const issue of result.error.issues) {
            const path = issue.path.join('.') || 'root';
            if (!errors[path]) {
                errors[path] = { type: issue.code ?? 'validation', message: issue.message };
            }
        }
        return { values: {}, errors };
    };
}
