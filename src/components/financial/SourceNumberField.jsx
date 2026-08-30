'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isSourceNumberRequired } from '@/lib/paymentMethods';

/**
 * Reusable transfer source-number field (FIN-UI-007 / UX-003).
 *
 * Shows the "رقم حساب التحويل" input whenever the selected payment `method`
 * requires it (instapay/wallet). Rendered inline under the method select and
 * autofocuses on show. Controlled via `value`/`onChange`.
 *
 * Props:
 *   value, onChange(value), method, error?, id?, placeholder?, disabled?, autoFocus?
 */
export function SourceNumberField({
    value,
    onChange,
    method,
    error,
    id = 'source-number',
    placeholder = 'مثال: IP-123456',
    disabled = false,
    autoFocus = false,
}) {
    if (!isSourceNumberRequired(method)) return null;

    // show the inline error when empty-and-required (UX-004) or on explicit error.
    const showError = error || (isSourceNumberRequired(method) && value != null && String(value).trim() === '');
    const errorId = `${id}-error`;

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium">
                رقم حساب التحويل <span className="text-destructive">*</span>
            </Label>
            <Input
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                dir="ltr"
                disabled={disabled}
                autoFocus={autoFocus}
                aria-required={isSourceNumberRequired(method) ? true : undefined}
                aria-invalid={showError ? true : undefined}
                aria-describedby={showError ? errorId : undefined}
                className={showError ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {showError && (
                <p id={errorId} className="text-sm text-destructive" role="alert">
                    رقم حساب التحويل مطلوب لطريقة الدفع هذه
                </p>
            )}
        </div>
    );
}
