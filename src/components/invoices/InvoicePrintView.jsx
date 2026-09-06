'use client';

import QRCode from "react-qr-code";
import { ArrowRightLeft } from 'lucide-react';
import { getPaymentMethod, getPaymentLabel, maskSource } from '@/lib/paymentMethods';

export function InvoicePrintView({ invoice, settings, returns }) {
    const primaryColor = settings?.primaryColor || '#1B3C73';
    const headerBgColor = settings?.headerBgColor || '#1B3C73';

    // DOC-SINV-005 — centralize the payment method lookup so instapay /
    // wallet / check render their correct labels (and the channel badge
    // appears next to the method). The legacy hard-coded ternary showed
    // them all as 'آجل', which was factually wrong.
    //
    // `credit` is the Invoice.paymentType value that means "no
    // payment received yet" (debt); it has no channel/source number
    // of its own and maps to 'آجل' for the user.
    const isCredit = invoice?.paymentType === 'credit';
    const methodInfo = getPaymentMethod(invoice?.paymentType) || null;
    const methodLabel = isCredit
        ? 'آجل'
        : (methodInfo?.labelAr || getPaymentLabel(invoice?.paymentType, 'ar') || '—');
    const channelLabel = isCredit ? '' : (methodInfo?.channelLabelAr || '');
    const sourceNumber = invoice?.sourceNumber || '';
    const isElectronicMethod = invoice?.paymentType === 'instapay'
        || invoice?.paymentType === 'wallet';
    // On this legacy view we always show masked source — the masked
    // value is informational; the unredacted one is available to
    // owner/manager via the redesigned DocumentActions export.
    const maskedSource = isElectronicMethod && sourceNumber
        ? maskSource(sourceNumber) : '';

    return (
        <div className="bg-white text-slate-900 border border-slate-300 p-10 rounded-xl shadow-2xl print:shadow-none print:border-none print:p-0" id="invoice-area">

                {/* Header with Logo */}
                <div
                    className="flex justify-between items-start pb-6 mb-6"
                    style={{ borderBottom: `2px solid ${primaryColor}` }}
                >
                    <div className="flex items-center gap-4">
                        {settings?.showLogo && (
                            <div
                                className="w-20 h-20 flex flex-col items-center justify-center rounded-xl shadow-lg border-2"
                                style={{
                                    backgroundColor: primaryColor,
                                    color: 'white',
                                    borderColor: primaryColor
                                }}
                            >
                                {settings.companyLogo ? (
                                    <img src={settings.companyLogo} alt="Logo" className="w-full h-full object-contain rounded-xl" />
                                ) : (
                                    <>
                                        <span className="text-3xl font-bold text-white">{settings?.companyName?.charAt(0) || 'ج'}</span>
                                        <span className="text-xs tracking-widest uppercase mt-1 text-white">
                                            {settings?.companyName || 'Jammaz'}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>{settings?.companyName || 'شركة الجماز'}</h1>
                            <p className="text-sm font-semibold" style={{ color: primaryColor }}>للاستيراد والتصدير</p>
                            <p className="text-xs text-slate-600 mt-2">{settings?.address || 'القاهرة - العتبة - شارع العسيلي'}</p>
                            <div className="text-xs text-slate-600 mt-2 space-y-1">
                                {[settings?.phone, ...(settings?.additionalPhones || [])]
                                    .filter(Boolean)
                                    .map((phone, index) => (
                                        <div key={index} className="flex items-center gap-1">
                                            <span className="text-slate-600 w-4">ت:</span>
                                            <span className="font-bold font-mono text-slate-700">{phone}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-left">
                            <div
                                className="text-white px-4 py-1 rounded-t-lg text-center text-sm font-bold"
                                style={{ backgroundColor: primaryColor }}
                            >
                                فاتورة مبيعات
                            </div>
                            <div className="border border-slate-300 rounded-b-lg p-3 text-center bg-slate-50" style={{ borderColor: primaryColor }}>
                                <p className="font-mono text-xl font-bold" style={{ color: primaryColor }}>{invoice.number}</p>
                                <p className="text-xs text-slate-600 mt-1">{new Date(invoice.date).toLocaleDateString('ar-EG')}</p>
                            </div>
                        </div>
                        {settings?.showQRCode && (
                            <div className="bg-white p-2 border border-slate-300 rounded-lg shadow-sm" style={{ borderColor: '#e5e7eb' }}>
                                <QRCode
                                    value={invoice.number}
                                    size={80}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                        )}
                    </div>
                </div >

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8 text-sm bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
                    <div className="space-y-3">
                        <h3 className="font-bold mb-3 flex items-center gap-2 border-b border-slate-200 pb-1" style={{ color: primaryColor }}>
                            بيانات العميل
                        </h3>
                        <div className="space-y-2 text-slate-800">
                            <p className="flex justify-between items-center"><span className="text-slate-600">الاسم:</span> <span className="font-bold text-slate-900 text-lg">{invoice.customerName}</span></p>
                            {invoice.customerPhone && <p className="flex justify-between items-center"><span className="text-slate-600">الهاتف:</span> <span className="font-mono text-slate-900">{invoice.customerPhone}</span></p>}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-bold mb-3 text-left border-b border-slate-200 pb-1" style={{ color: primaryColor }}>تفاصيل الفاتورة</h3>
                        <div className="space-y-2 text-slate-800">
                            <p className="flex justify-between items-center"><span className="text-slate-600">الحالة:</span> <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-200">مدفوع بالكامل</span></p>
                            <p className="flex justify-between items-center">
                                <span className="text-slate-600">طريقة الدفع:</span>
                                <span className="font-bold text-slate-900">{methodLabel}</span>
                            </p>
                            {channelLabel && (
                                <p className="flex justify-between items-center">
                                    <span className="text-slate-600">القناة:</span>
                                    <span className="font-bold text-slate-900">{channelLabel}</span>
                                </p>
                            )}
                            {isElectronicMethod && maskedSource && (
                                <p className="flex justify-between items-center">
                                    <span className="text-slate-600">رقم التحويل:</span>
                                    <span className="font-mono font-bold text-slate-900">{maskedSource}</span>
                                </p>
                            )}
                            <p className="flex justify-between items-center"><span className="text-slate-600">بواسطة:</span> <span className="font-semibold text-slate-900">{invoice.createdBy?.name || 'المدير'}</span></p>
                        </div>
                    </div>
                </div >

                {/* Items Table */}
                < div className="rounded-xl overflow-hidden border border-slate-300 shadow-sm mb-8" >
                    <table className="w-full border-collapse">
                        <thead className="text-white text-sm" style={{ backgroundColor: headerBgColor }}>
                            <tr>
                                <th className="py-4 px-4 text-right">المنتج</th>
                                <th className="py-4 px-4 text-center">الكمية</th>
                                <th className="py-4 px-4 text-center">سعر الوحدة</th>
                                <th className="py-4 px-4 text-center">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-800">
                            {invoice.items.map((item, i) => (
                                <tr key={i} className="border-b border-slate-200 last:border-0 hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-4 font-bold" style={{ color: primaryColor }}>{item.productName || item.name || 'منتج'}</td>
                                    <td className="py-4 px-4 text-center font-semibold text-slate-900">{item.qty}</td>
                                    <td className="py-4 px-4 text-center font-mono text-slate-900">{item.unitPrice.toLocaleString()} ج.م</td>
                                    <td className="py-4 px-4 text-center font-bold text-slate-900">{(item.qty * item.unitPrice).toLocaleString()} ج.م</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div >

                {/* Returns History */}
                {
                    returns && returns.length > 0 && (
                        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 rounded-xl border border-amber-300">
                                <ArrowRightLeft className="text-amber-700" size={18} />
                                <h3 className="font-bold text-amber-800 uppercase tracking-tight">سجل المرتجعات لهذه الفاتورة</h3>
                            </div>
                            <div className="space-y-3">
                                {returns.map((ret, idx) => (
                                    <div key={idx} className="bg-white border-2 border-dashed border-amber-300 p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500 transition-colors">
                                        <div className="flex flex-col md:flex-row justify-between gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-amber-500 text-white rounded-md font-mono text-xs font-bold">{ret.returnNumber}</span>
                                                    <span className="text-slate-600 text-xs">{new Date(ret.date).toLocaleString('ar-EG')}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    {ret.items.map((it, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm">
                                                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                                                            <span className="font-bold text-slate-900">{it.productId?.name || it.productName || 'منتج'}</span>
                                                            <span className="text-slate-600 italic">× {it.qty} وحدة</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-left flex flex-col justify-center">
                                                <span className="text-xs font-bold text-slate-600 uppercase">المبلغ المرتجع</span>
                                                <span className="text-2xl font-bold text-amber-700">-{ret.totalRefund?.toLocaleString()} <span className="text-sm">ج.م</span></span>
                                            </div>
                                        </div>
                                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="text-xs font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded uppercase border border-amber-200">بواسطة: {ret.createdBy?.name || 'النظام'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }

                {/* Totals */}
                <div className="flex justify-between items-end gap-8">
                    <div className="flex-1">
                        {invoice.notes && (
                            <div className="text-xs p-4 bg-slate-50 rounded-xl border border-slate-200 border-dotted">
                                <p className="font-bold text-slate-700 mb-1">ملاحظات:</p>
                                <p className="text-slate-700 italic">&quot;{invoice.notes}&quot;</p>
                            </div>
                        )}
                    </div>
                    <div className="w-80 bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 shadow-lg">
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between text-slate-700 items-baseline">
                                <span>المجموع الفرعي:</span>
                                <span className="font-bold text-slate-900">{invoice.subtotal.toLocaleString()} ج.م</span>
                            </div>
                            <div className="flex justify-between text-slate-700 items-baseline">
                                <span>الضريبة (٪):</span>
                                <span className="font-semibold text-slate-900">{invoice.tax?.toLocaleString() || '0'} ج.م</span>
                            </div>
                            <div
                                className="pt-4 flex justify-between text-2xl font-bold border-t-2"
                                style={{ color: primaryColor, borderTopColor: primaryColor }}
                            >
                                <span>الإجمالي:</span>
                                <span>{invoice.total.toLocaleString()} <span className="text-xs font-bold">ج.م</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-slate-300 text-center">
                    <p className="font-bold text-xl mb-3" style={{ color: primaryColor }}>
                        {settings?.footerText || 'شكراً لتعاملكم مع شركة الجماز'}
                    </p>
                    <p className="text-xs text-slate-600 mb-1">{settings?.address || 'القاهرة، مصر - العطبة'}</p>
                    <p className="text-xs text-slate-600">تم إصدار هذه الفاتورة إلكترونياً وهي معتمدة وصالحة دون توقيع</p>
                </div>

            <style jsx global>{`
                @media print {
                    @page { size: A4; margin: 0; }
                    body { visibility: hidden; background: white; width: 100%; }
                    #invoice-area {
                        visibility: visible;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 40px;
                        border: none;
                        box-shadow: none;
                        border-radius: 0;
                        color: #1f2937;
                        background: #ffffff;
                    }
                    #invoice-area * {
                        visibility: visible;
                    }
                    /* On paper, override Tailwind's dark-theme tokens so labels,
                       totals, and table cells always read as dark slate. Inline
                       brand-color styles (h1/h3 headings) keep winning because
                       inline styles outrank class selectors. */
                    #invoice-area .text-muted-foreground,
                    #invoice-area .text-foreground,
                    #invoice-area .opacity-60,
                    #invoice-area .opacity-80 {
                        color: #1f2937 !important;
                        opacity: 1 !important;
                    }
                    #invoice-area .bg-muted50 {
                        background-color: #f8fafc !important;
                    }
                    #invoice-area .border-border {
                        border-color: #e2e8f0 !important;
                    }
                    /* White text on the dark thead background */
                    #invoice-area thead,
                    #invoice-area thead * {
                        color: #ffffff !important;
                    }
                    header, aside, .print\\:hidden, nav, .sonner { display: none !important; }
                }
            `}</style>
        </div>
    );
}
