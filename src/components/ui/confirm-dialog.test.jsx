import { describe, it, expect, jest } from '@jest/globals';
import { screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ConfirmDialog } from './confirm-dialog';
import { renderWithProviders } from '@/test/utils';

/**
 * UX-001 regression lock: destructive actions must route through this dialog,
 * and the confirm action must be an explicit click (never auto-fired).
 */
function setup(props = {}) {
    const onConfirm = jest.fn();
    const onOpenChange = jest.fn();
    renderWithProviders(
        <ConfirmDialog
            open
            onOpenChange={onOpenChange}
            title="حذف الفاتورة"
            description="هل أنت متأكد؟"
            onConfirm={onConfirm}
            {...props}
        />
    );
    return { onConfirm, onOpenChange };
}

describe('ConfirmDialog', () => {
    it('renders Arabic copy and fires onConfirm when confirmed', () => {
        const { onConfirm } = setup();
        expect(screen.getByText('حذف الفاتورة')).toBeInTheDocument();
        expect(screen.getByText('هل أنت متأكد؟')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'تأكيد' }));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('cancel button does not invoke onConfirm', () => {
        const { onConfirm, onOpenChange } = setup();
        fireEvent.click(screen.getByRole('button', { name: 'إلغاء' }));
        expect(onConfirm).not.toHaveBeenCalled();
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('supports custom labels and disables while pending', () => {
        const { onConfirm } = setup({ confirmLabel: 'حذف نهائي', cancelLabel: 'رجوع', pending: true });
        const confirmBtn = screen.getByRole('button', { name: 'حذف نهائي' });
        expect(confirmBtn).toBeDisabled();
        expect(screen.getByRole('button', { name: 'رجوع' })).toBeInTheDocument();
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it('does not render anything when closed', () => {
        renderWithProviders(
            <ConfirmDialog open={false} onOpenChange={() => {}} title="x" onConfirm={() => {}} />
        );
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
