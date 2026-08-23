'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils';

/**
 * Form field wrapper: label + control + inline Arabic error line (FORM-001).
 * `error` is the RHF field error object: { message?: string }
 */
export function FormField({ label, error, required, hint, children, className }) {
    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <Label>
                    {label}
                    {required && ' *'}
                </Label>
            )}
            {children}
            {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error?.message && (
                <p className="text-xs font-bold text-destructive">{error.message}</p>
            )}
        </div>
    );
}

/**
 * Map a JammazApiError onto RHF field errors.
 * Handles the common backend shapes: { field: 'msg' }, { errors: { field: 'msg' } },
 * and arrays of messages per field. Returns null when nothing mappable exists.
 */
export function mapServerFieldErrors(error) {
    const payload = error?.data;
    if (!payload || typeof payload !== 'object') return null;

    const raw = payload.errors && typeof payload.errors === 'object' ? payload.errors : payload;

    const mapped = {};
    for (const [field, value] of Object.entries(raw)) {
        if (typeof value === 'string') {
            mapped[field] = { type: 'server', message: value };
        } else if (Array.isArray(value) && typeof value[0] === 'string') {
            mapped[field] = { type: 'server', message: value[0] };
        }
    }
    return Object.keys(mapped).length > 0 ? mapped : null;
}
