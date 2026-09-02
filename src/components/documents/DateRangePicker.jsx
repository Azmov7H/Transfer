'use client';

import * as React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

/**
 * DOC-SHARED-006 — DateRangePicker.
 *
 * The single date-range control used by every filterable document
 * (statements, treasury, company financial statement, P&L, ...).
 * Backed by two native <input type="date"> fields with a preset
 * shortcut strip. RTL by default.
 *
 * Props:
 *  - value          : { from?: string (yyyy-MM-dd), to?: string }
 *  - onChange       : ({ from, to }) => void
 *  - presets        : Array<'today'|'yesterday'|'thisWeek'|'thisMonth'|'lastMonth'|'thisYear'|'custom'>
 *                     (default: all)
 *  - maxDays        : number   (default 365 — matches the backend cap)
 *  - disabled       : boolean
 *  - className
 *
 * The onChange payload is exactly the shape the backend accepts as
 * filter (from / to) — no further transformation needed.
 */
const ALL_PRESETS = [
    { value: 'today',     label: 'اليوم' },
    { value: 'yesterday', label: 'أمس' },
    { value: 'thisWeek',  label: 'هذا الأسبوع' },
    { value: 'thisMonth', label: 'هذا الشهر' },
    { value: 'lastMonth', label: 'الشهر السابق' },
    { value: 'thisYear',  label: 'هذه السنة' },
    { value: 'custom',    label: 'فترة مخصصة' },
];

function toYmd(d) {
    if (!d) return '';
    const dt = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(dt.getTime())) return '';
    return format(dt, 'yyyy-MM-dd');
}

function presetRange(preset) {
    const now = new Date();
    const end = new Date(now);
    const start = new Date(now);
    switch (preset) {
        case 'today':
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'yesterday': {
            start.setDate(now.getDate() - 1);
            start.setHours(0, 0, 0, 0);
            end.setDate(now.getDate() - 1);
            end.setHours(23, 59, 59, 999);
            break;
        }
        case 'thisWeek': {
            const day = now.getDay(); // 0 (Sun) .. 6 (Sat). Locale-aware
            const diff = (day + 6) % 7; // make Monday the first day
            start.setDate(now.getDate() - diff);
            start.setHours(0, 0, 0, 0);
            break;
        }
        case 'thisMonth':
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            break;
        case 'lastMonth': {
            const m = now.getMonth();
            start.setFullYear(now.getFullYear(), m - 1, 1);
            start.setHours(0, 0, 0, 0);
            end.setFullYear(now.getFullYear(), m, 0);
            end.setHours(23, 59, 59, 999);
            break;
        }
        case 'thisYear':
            start.setMonth(0, 1);
            start.setHours(0, 0, 0, 0);
            break;
        case 'custom':
        default:
            // No auto-fill for custom.
            return null;
    }
    return { from: toYmd(start), to: toYmd(end) };
}

function rangeTooLong(from, to, maxDays) {
    if (!from || !to) return false;
    const a = new Date(from);
    const b = new Date(to);
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return false;
    const diffMs = Math.abs(b - a);
    return Math.ceil(diffMs / (24 * 60 * 60 * 1000)) > maxDays;
}

export function DateRangePicker({
    value = {},
    onChange,
    presets,
    maxDays = 365,
    disabled = false,
    className,
}) {
    const list = presets && presets.length > 0
        ? ALL_PRESETS.filter((p) => presets.includes(p.value))
        : ALL_PRESETS;
    const { from, to } = value || {};
    const summary = from && to
        ? `${from} → ${to}`
        : from
            ? `${from} → ...`
            : 'اختر الفترة';
    const tooLong = rangeTooLong(from, to, maxDays);

    const handlePreset = (preset) => {
        if (preset === 'custom') {
            onChange?.({ from: from || '', to: to || '' });
            return;
        }
        const r = presetRange(preset);
        if (r) onChange?.(r);
    };

    const handleCustomChange = (key) => (e) => {
        const v = e.target.value || '';
        const next = { ...value, [key]: v };
        if (rangeTooLong(next.from, next.to, maxDays)) {
            // The user typed a value that would breach the cap. Allow the
            // edit but surface a soft warning so they can fix it.
        }
        onChange?.(next);
    };

    return (
        <div
            dir="rtl"
            className={cn('flex flex-wrap items-center gap-2', className)}
            data-testid="date-range-picker"
        >
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={disabled}
                        className="gap-2 font-bold"
                    >
                        <Calendar className="h-4 w-4" />
                        {summary}
                        <ChevronDown className="h-3 w-3" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-3 space-y-3">
                    <div className="grid grid-cols-3 gap-1.5">
                        {list.map((p) => (
                            <Button
                                key={p.value}
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => handlePreset(p.value)}
                                className="text-xs"
                            >
                                {p.label}
                            </Button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <label className="text-xs space-y-1">
                            <span className="text-muted-foreground">من</span>
                            <input
                                type="date"
                                value={from || ''}
                                onChange={handleCustomChange('from')}
                                className="w-full px-2 py-1.5 border rounded-md text-sm bg-background"
                            />
                        </label>
                        <label className="text-xs space-y-1">
                            <span className="text-muted-foreground">إلى</span>
                            <input
                                type="date"
                                value={to || ''}
                                onChange={handleCustomChange('to')}
                                className="w-full px-2 py-1.5 border rounded-md text-sm bg-background"
                            />
                        </label>
                    </div>
                    {tooLong && (
                        <p className="text-xs text-rose-600" data-testid="date-range-warning">
                            الفترة تتجاوز الحد المسموح ({maxDays} يوم)
                        </p>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    );
}

export { presetRange, rangeTooLong, toYmd };
export const __testInternals = { ALL_PRESETS, presetRange, rangeTooLong, toYmd };
