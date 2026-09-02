'use client';

import { useQuery } from '@tanstack/react-query';
import { getInvoiceDesign } from '@/services/settingsService';

/**
 * DOC-SHARED-008 — Branding hook.
 *
 * Single source of truth for company branding on the document surface.
 * Backed by GET /api/settings/invoice-design (the existing settings
 * endpoint), with sensible defaults when the request fails so the
 * document layer always renders something.
 *
 * Caching: 5-minute stale time + 30-minute gc. The settings endpoint
 * is effectively read-only outside of /admin/settings, so this stays
 * fresh enough.
 */
export const DEFAULT_BRANDING = Object.freeze({
    companyName: 'شركتكم',
    companyLogo: '',
    showLogo: true,
    showQRCode: true,
    primaryColor: '#1B3C73',
    headerBgColor: '#1B3C73',
    address: '',
    phone: '',
    additionalPhones: [],
    email: '',
    website: '',
    footerText: 'شكراً لتعاملكم مع شركة الجماز',
});

/**
 * Normalize whatever the backend returns into a complete BrandingData
 * object. Settings endpoints in this codebase return either:
 *   - the raw settings document (the new path), or
 *   - { status, data } envelope (legacy)
 * This helper accepts both and falls back to defaults for missing keys.
 */
function normalizeBranding(raw) {
    if (!raw || typeof raw !== 'object') return { ...DEFAULT_BRANDING };
    const inner = raw.data && typeof raw.data === 'object' ? raw.data : raw;
    return {
        companyName: inner.companyName || DEFAULT_BRANDING.companyName,
        companyLogo: inner.companyLogo || DEFAULT_BRANDING.companyLogo,
        showLogo: inner.showLogo != null ? Boolean(inner.showLogo) : DEFAULT_BRANDING.showLogo,
        showQRCode: inner.showQRCode != null ? Boolean(inner.showQRCode) : DEFAULT_BRANDING.showQRCode,
        primaryColor: inner.primaryColor || DEFAULT_BRANDING.primaryColor,
        headerBgColor: inner.headerBgColor || DEFAULT_BRANDING.headerBgColor,
        address: inner.address || DEFAULT_BRANDING.address,
        phone: inner.phone || DEFAULT_BRANDING.phone,
        additionalPhones: Array.isArray(inner.additionalPhones)
            ? inner.additionalPhones
            : DEFAULT_BRANDING.additionalPhones,
        email: inner.email || DEFAULT_BRANDING.email,
        website: inner.website || DEFAULT_BRANDING.website,
        footerText: inner.footerText || DEFAULT_BRANDING.footerText,
    };
}

export function useBranding(options = {}) {
    const query = useQuery({
        queryKey: ['branding'],
        queryFn: ({ signal }) => getInvoiceDesign({ signal }),
        staleTime: 5 * 60 * 1000, // 5 min
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        ...options,
    });

    const branding = query.data ? normalizeBranding(query.data) : { ...DEFAULT_BRANDING };

    return {
        ...query,
        branding,
    };
}
