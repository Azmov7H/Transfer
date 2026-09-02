'use client';

import * as React from 'react';
import { Phone, MapPin, Mail, Globe } from 'lucide-react';
import { cn } from '@/utils';

/**
 * DOC-SHARED-003 — Branded document header.
 *
 * Used by every document in the system (invoices, receipts, statements,
 * financial reports) so the company identity stays consistent. Sourced
 * from the BrandingData shape (see lib/documentRegistry / hooks/useBranding).
 *
 * Props:
 *  - branding    : BrandingData  (required — pass useBranding().branding)
 *  - title       : string        (document title in Arabic, e.g. "فاتورة مبيعات")
 *  - meta        : { number, date, time, status? }  (document number, date/time, optional status badge)
 *  - rightSlot   : ReactNode     (optional — typically the QR code on a sales invoice)
 *  - className   : string
 *
 * RTL by default (matches every other document surface).
 */
export function DocumentHeader({ branding, title, meta, rightSlot, className }) {
    const phones = collectPhones(branding);
    const showLogo = Boolean(branding?.showLogo) && Boolean(branding?.companyLogo);
    const initial = (branding?.companyName || '?').trim().charAt(0) || '?';

    return (
        <div
            dir="rtl"
            className={cn(
                'flex flex-col md:flex-row items-start justify-between gap-6 pb-6 mb-6 border-b',
                className
            )}
            style={{ borderColor: branding?.primaryColor || '#1B3C73' }}
            data-testid="document-header"
        >
            {/* Brand block */}
            <div className="flex items-start gap-4">
                {showLogo ? (
                    <img
                        src={branding.companyLogo}
                        alt={branding.companyName}
                        className="w-20 h-20 rounded-xl object-contain border-2 bg-white"
                        style={{ borderColor: branding?.primaryColor || '#1B3C73' }}
                    />
                ) : (
                    <div
                        className="w-20 h-20 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-lg"
                        style={{ backgroundColor: branding?.primaryColor || '#1B3C73' }}
                        aria-label="Company initial"
                    >
                        {initial}
                    </div>
                )}
                <div className="space-y-1">
                    <h1
                        className="text-2xl font-bold"
                        style={{ color: branding?.primaryColor || '#1B3C73' }}
                    >
                        {branding?.companyName || 'شركتكم'}
                    </h1>
                    {branding?.address && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>{branding.address}</span>
                        </div>
                    )}
                    {phones.length > 0 && (
                        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                            {phones.map((p, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <Phone className="h-3 w-3 shrink-0" />
                                    <span className="font-mono" dir="ltr">{p}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {branding?.email && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span dir="ltr">{branding.email}</span>
                        </div>
                    )}
                    {branding?.website && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Globe className="h-3 w-3 shrink-0" />
                            <span dir="ltr">{branding.website}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Title + meta + optional right slot (e.g. QR) */}
            <div className="flex items-start gap-3">
                <div className="text-right space-y-2">
                    {title && (
                        <div
                            className="px-4 py-1 rounded-t-lg text-center text-sm font-bold text-white"
                            style={{ backgroundColor: branding?.primaryColor || '#1B3C73' }}
                        >
                            {title}
                        </div>
                    )}
                    {meta && (
                        <div
                            className="rounded-b-lg p-3 text-center min-w-[160px] border bg-muted"
                            style={{ borderColor: branding?.primaryColor || '#1B3C73' }}
                        >
                            {meta.number && (
                                <p
                                    className="font-mono text-lg font-bold"
                                    style={{ color: branding?.primaryColor || '#1B3C73' }}
                                >
                                    {meta.number}
                                </p>
                            )}
                            {meta.date && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {meta.date}
                                    {meta.time ? ` — ${meta.time}` : ''}
                                </p>
                            )}
                            {meta.status && (
                                <div className="mt-2">
                                    {typeof meta.status === 'string' ? (
                                        <span
                                            className={cn(
                                                'inline-block px-2 py-0.5 rounded text-xs font-bold',
                                                statusBadgeClass(meta.status)
                                            )}
                                        >
                                            {meta.status}
                                        </span>
                                    ) : (
                                        meta.status
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {rightSlot}
            </div>
        </div>
    );
}

function collectPhones(branding) {
    const out = [];
    if (branding?.phone) out.push(branding.phone);
    if (Array.isArray(branding?.additionalPhones)) {
        for (const p of branding.additionalPhones) {
            if (p && !out.includes(p)) out.push(p);
        }
    }
    return out;
}

function statusBadgeClass(status) {
    // Status is treated as opaque Arabic; we map a few known labels to
    // semantic colors and fall back to neutral.
    const s = String(status).toLowerCase();
    if (s.includes('مدفوع') && !s.includes('غير')) {
        return 'bg-emerald-100 text-emerald-800';
    }
    if (s.includes('جزئي') || s.includes('معلق') || s.includes('انتظار')) {
        return 'bg-amber-100 text-amber-800';
    }
    if (s.includes('غير مدفوع') || s.includes('ملغي') || s.includes('مرفوض')) {
        return 'bg-rose-100 text-rose-800';
    }
    return 'bg-muted text-muted-foreground';
}
