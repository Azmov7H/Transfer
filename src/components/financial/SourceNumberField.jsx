'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isSourceNumberRequired } from '@/lib/paymentMethods';

/**
 * Reusable transfer source-number field (FIN-UI-007).
 *
 * Shows the "رقم حساب التحويل" input whenever the selected payment `method`
 * requires it (instapay/wallet). Controlled via `value`/`onChange`.
 *
 * Props:
 *   value, onChange(value), method, error?, id?, placeholder?, disabled?
 */
export function SourceNumberField({
    value,
    onChange,
    method,
    error,
    id = 'source-number',
    placeholder = 'مثال: IP-123456',
    disabled = false,
}) {
    if (!isSourceNumberRequired(method)) return null;

    const showError = error || (isSourceNumberRequired(method) && value != null && String(value).trim() === '');

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium">
                رقم حساب التحويل *
            </Label>
            <Input
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                dir="ltr"
                disabled={disabled}
                aria-invalid={showError ? true : undefined}
                className={showError ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {showError && (
                <p className="text-sm text-destructive">رقم حساب التحويل مطلوب</p>
            )}
        </div>
    );
}
