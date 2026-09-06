'use client';

import { getPaymentLabel } from '@/lib/paymentMethods';

/**
 * Treasury movement print report (كشف حركة الخزينة).
 *
 * Print-only view (`hidden print:block`): the browser renders the HTML
 * with its native Arabic shaping/bidi engine, so no server-side export
 * step is needed — the user prints directly and picks "Save as PDF" as
 * the print destination to keep a file on their device.
 *
 * Data contract: `rows` are full-period treasury transactions
 * ({ date|createdAt, type, method, amount, receiptNumber, description }),
 * `summary` carries server aggregates ({ income, expense, net, count }).
 */
const TYPE_AR = { INCOME: 'وارد', EXPENSE: 'صادر' };

function fmtDate(value) {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('ar-EG');
}

function fmtAmount(value) {
    return Number(value ?? 0).toLocaleString('en-US');
}

export function TreasuryPrintView({ rows = [], summary = {}, periodLabel = '', dateRange = {} }) {
    const income = Number(summary.income ?? 0);
    const expense = Number(summary.expense ?? 0);
    const net = Number(summary.net ?? income - expense);
    const count = Number(summary.count ?? rows.length);
    const rangeLabel = [dateRange.startDate, dateRange.endDate].filter(Boolean).join(' – ') || 'كامل السجل';

    return (
        <div id="treasury-print-area" dir="rtl" className="hidden print:block bg-white text-slate-900">
            {/* Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
                <h1 className="text-2xl font-bold">كشف حركة الخزينة</h1>
                <p className="text-sm text-slate-600 mt-1">
                    الفترة: {periodLabel} ({rangeLabel}) • عدد الحركات: {count.toLocaleString('en-US')}
                </p>
            </div>

            {/* Summary */}
            <div className="flex justify-between gap-4 text-sm mb-4">
                <p><span className="font-bold">إجمالي الوارد: </span>{fmtAmount(income)} ج.م</p>
                <p><span className="font-bold">إجمالي الصادر: </span>{fmtAmount(expense)} ج.م</p>
                <p><span className="font-bold">الصافي: </span>{fmtAmount(net)} ج.م</p>
            </div>

            {/* Ledger */}
            {rows.length === 0 ? (
                <p className="text-center text-slate-500 py-8">لا توجد معاملات في هذه الفترة</p>
            ) : (
                <table className="w-full border-collapse text-xs">
                    <thead>
                        <tr className="bg-slate-900 text-white">
                            <th className="py-2 px-2 text-right">التاريخ</th>
                            <th className="py-2 px-2 text-right">النوع</th>
                            <th className="py-2 px-2 text-right">الطريقة</th>
                            <th className="py-2 px-2 text-right">المبلغ</th>
                            <th className="py-2 px-2 text-right">رقم السند</th>
                            <th className="py-2 px-2 text-right">الوصف</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((tx, i) => (
                            <tr key={tx._id || i} className="border-b border-slate-200">
                                <td className="py-1.5 px-2 whitespace-nowrap">{fmtDate(tx.date || tx.createdAt)}</td>
                                <td className="py-1.5 px-2">{TYPE_AR[tx.type] || tx.type || ''}</td>
                                <td className="py-1.5 px-2">{getPaymentLabel(tx.method, 'ar') || tx.method || ''}</td>
                                <td className="py-1.5 px-2 font-bold whitespace-nowrap">{fmtAmount(tx.amount)} ج.م</td>
                                <td className="py-1.5 px-2 whitespace-nowrap">{tx.receiptNumber || ''}</td>
                                <td className="py-1.5 px-2">{tx.description || ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
