'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PAYMENT_METHODS, getPaymentMethod } from '@/lib/paymentMethods';
import { cn } from '@/utils';

/**
 * Shared payment-method selector (UX-001/UX-002).
 *
 * Single component replacing all ad-hoc method toggles/selects so labels,
 * icons, colors, and ordering stay consistent. Keyboard-operable (radix).
 *
 * Props:
 *   value, onValueChange, methods? (allowed subset, default all), id?,
 *   disabled?, className?, placeholder?
 */
export function PaymentMethodSelect({
    value,
    onValueChange,
    methods,
    id,
    disabled = false,
    className,
    placeholder = 'اختر طريقة الدفع',
}) {
    const list = methods?.length
        ? PAYMENT_METHODS.filter((m) => methods.includes(m.value))
        : PAYMENT_METHODS;

    const selected = getPaymentMethod(value);
    const SelectedIcon = selected?.icon;

    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger id={id} className={cn('h-11', className)}>
                <SelectValue placeholder={placeholder}>
                    {SelectedIcon && selected && (
                        <span className="inline-flex items-center gap-2">
                            <SelectedIcon className={cn('h-4 w-4', selected.color)} />
                            {selected.labelAr}
                        </span>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {list.map((m) => {
                    const Icon = m.icon;
                    return (
                        <SelectItem key={m.value} value={m.value}>
                            <span className="inline-flex items-center gap-2">
                                <Icon className={cn('h-4 w-4', m.color)} />
                                {m.labelAr}
                            </span>
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}
