/**
 * Invoice items math (FE-TEST-002): stock-aware quantity clamping and the
 * item shape the invoice totals formula depends on (qty × unitPrice).
 *
 * CJS style — required for jest.mock hoisting under next/jest (SWC).
 */
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        warning: jest.fn(),
        info: jest.fn(),
    },
}));

jest.mock('@/services/productService', () => ({
    getProducts: jest.fn(),
}));

const { renderHook, act } = require('@testing-library/react');
const { useInvoiceItems } = require('./useInvoiceItems');
const { toast } = require('sonner');

function hookWithMutableItems(initial) {
    let current = initial;
    const { result, rerender } = renderHook(
        ({ items }) => useInvoiceItems({ items, setItems: (u) => { current = typeof u === 'function' ? u(current) : u; } }),
        { initialProps: { items: initial } }
    );
    return { result, rerender: () => rerender({ items: current }), getCurrent: () => current };
}

const SHOP_PRODUCT = {
    _id: 'p1', name: 'منتج أ', code: 'A1',
    retailPrice: 100, buyPrice: 60,
    shopQty: 5, warehouseQty: 10,
};

describe('useInvoiceItems — totals-critical behavior', () => {
    beforeEach(() => jest.clearAllMocks());

    it('addItem creates an item whose qty × unitPrice feeds the subtotal', () => {
        const { result, getCurrent } = hookWithMutableItems([]);
        act(() => result.current.addItem(SHOP_PRODUCT));

        expect(getCurrent()).toHaveLength(1);
        expect(getCurrent()[0]).toMatchObject({
            productId: 'p1',
            unitPrice: 100,
            qty: 1,
            source: 'shop',
            maxQty: 5,
        });
        const subtotal = getCurrent().reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
        expect(subtotal).toBe(100);
    });

    it('updateQty rejects quantities above available shop stock', () => {
        const existing = [{ productId: 'p1', name: 'منتج أ', unitPrice: 100, qty: 2, source: 'shop', shopQty: 5, warehouseQty: 10, buyPrice: 60 }];
        const { result, getCurrent } = hookWithMutableItems(existing);

        act(() => result.current.updateQty(0, 99));
        expect(toast.error).toHaveBeenCalled();
        expect(getCurrent()[0].qty).toBe(2);
    });

    it('updatePrice rejects non-positive prices that would zero the subtotal', () => {
        const existing = [{ productId: 'p1', unitPrice: 100, qty: 1, source: 'shop', shopQty: 5, warehouseQty: 0, buyPrice: 60 }];
        const { result, getCurrent } = hookWithMutableItems(existing);

        act(() => result.current.updatePrice(0, 0));
        expect(toast.error).toHaveBeenCalledWith('السعر يجب أن يكون أكبر من صفر');
        expect(getCurrent()[0].unitPrice).toBe(100);
    });

    it('removeItem drops exactly one row so totals shrink correctly', () => {
        const two = [
            { productId: 'p1', unitPrice: 100, qty: 1 },
            { productId: 'p2', unitPrice: 50, qty: 2 },
        ];
        const { result, getCurrent } = hookWithMutableItems(two);

        act(() => result.current.removeItem(0));
        const subtotal = getCurrent().reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
        expect(getCurrent()).toHaveLength(1);
        expect(subtotal).toBe(100);
    });
});
