'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { getInvoiceDesign, updateInvoiceDesign } from '@/services/settingsService';
import { DEFAULT_INVOICE_SETTINGS } from '@/components/settings/defaults';

export function useInvoiceSettings() {
    const [invoiceSettings, setInvoiceSettings] = useState(DEFAULT_INVOICE_SETTINGS);
    const [loading, setLoading] = useState(false);

    const loadSettings = async ({ signal } = {}) => {
        try {
            const data = await getInvoiceDesign({ signal });
            if (data?.status === 'success' && data.data) {
                setInvoiceSettings(data.data);
            } else if (data && !data.status) {
                setInvoiceSettings(data);
            }
        } catch (error) {
            console.error('Error fetching invoice settings:', error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const data = await updateInvoiceDesign(invoiceSettings);
            if (data?.status === 'success' && data.data) {
                setInvoiceSettings(data.data);
            }
            toast.success('تم حفظ الإعدادات بنجاح');
        } catch (error) {
            toast.error('فشل في حفظ الإعدادات');
        } finally {
            setLoading(false);
        }
    };

    return { invoiceSettings, setInvoiceSettings, loading, loadSettings, handleSave };
}
