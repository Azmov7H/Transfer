import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertTriangle, Info, XCircle } from 'lucide-react';

/**
 * Single source of business-state → (token, icon, label) mapping (UX-071).
 * Status meaning is conveyed by icon + Arabic label + color — never color alone (A2).
 */

const STATUS_MAP = {
    // paid / completed
    paid:       { variant: 'success',    icon: CheckCircle2,   label: 'مدفوعة' },
    settled:    { variant: 'success',    icon: CheckCircle2,   label: 'مسددة' },
    completed:  { variant: 'success',    icon: CheckCircle2,   label: 'مكتملة' },
    approved:   { variant: 'success',    icon: CheckCircle2,   label: 'معتمد' },
    received:   { variant: 'success',    icon: CheckCircle2,   label: 'مستلم' },

    // pending / partial
    partial:    { variant: 'warning',    icon: Clock,          label: 'جزئي' },
    pending:    { variant: 'warning',    icon: Clock,          label: 'قيد الانتظار' },
    unpaid:     { variant: 'warning',    icon: Clock,          label: 'غير مدفوعة' },
    draft:      { variant: 'secondary',  icon: Info,           label: 'مسودة' },

    // overdue / failed
    overdue:    { variant: 'destructive', icon: AlertTriangle, label: 'متأخرة' },
    cancelled:  { variant: 'destructive', icon: XCircle,       label: 'ملغاة' },
    'written-off': { variant: 'destructive', icon: XCircle,    label: 'مشطوبة' },

    // neutral info
    credit:     { variant: 'info',       icon: Info,           label: 'آجل' },
    cash:       { variant: 'success',    icon: CheckCircle2,   label: 'نقدي' }
};

const VARIANT_CLASSES = {
    success:    'bg-success/10 text-success border-success/30',
    warning:    'bg-warning/10 text-warning border-warning/30',
    destructive:'bg-destructive/10 text-destructive border-destructive/30',
    info:       'bg-info/10 text-info border-info/30',
    secondary:  'bg-secondary/10 text-secondary-foreground border-border'
};

/** Resolve a raw status string to a STATUS_MAP entry (case/synonym tolerant). */
export function resolveStatus(raw) {
    if (!raw) return null;
    const key = String(raw).toLowerCase().trim();
    return STATUS_MAP[key] || null;
}

export function StatusBadge({ status, label, className }) {
    const config = resolveStatus(status);
    if (!config) {
        // Unknown status → neutral outline with raw value (no invented meaning)
        return <Badge variant="outline" className={className}>{label || status || '—'}</Badge>;
    }
    const Icon = config.icon;
    return (
        <Badge variant="outline" className={`${VARIANT_CLASSES[config.variant]} ${className || ''}`}>
            <Icon aria-hidden="true" />
            {label || config.label}
        </Badge>
    );
}
