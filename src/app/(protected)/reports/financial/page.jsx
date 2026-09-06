'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Calendar, Download, Printer, RefreshCcw, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ReportService } from '@/services/reportService';

export default function FinancialReportPage() {
    const [startDate, setStartDate] = useState(format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const { data: response = {}, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ['financial-report', startDate, endDate],
        queryFn: ({ signal }) => ReportService.getFinancialReport(startDate, endDate, { signal })
    });

    const financials = response?.financials || {};
    const hasAnyData = (financials?.revenue?.total || 0) > 0
        || (financials?.operatingExpenses?.total || 0) > 0
        || (financials?.cogs || 0) > 0;

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin" /></div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto print:max-w-none">
            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 print:hidden">
                <div className="flex gap-4 items-end flex-wrap">
                    <div>
                        <Label>من تاريخ</Label>
                        <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <Label>إلى تاريخ</Label>
                        <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                    <Button
                        onClick={() => refetch()}
                        variant="outline"
                        size="icon"
                        disabled={isFetching}
                        aria-label="تحديث التقرير"
                        title="تحديث التقرير"
                    >
                        <RefreshCcw className={isFetching ? "animate-spin" : ""} />
                    </Button>
                </div>
                <Button onClick={handlePrint} className="gap-2">
                    <Printer className="w-4 h-4" /> طباعة التقرير
                </Button>
            </div>

            {/* Report Paper */}
            <Card className="border shadow-lg print:shadow-none print:border-none">
                <CardHeader className="text-center border-b pb-8">
                    <CardTitle className="text-3xl font-bold text-foreground">قائمة الدخل</CardTitle>
                    <CardDescription className="text-lg mt-2">
                        عن الفترة من {format(new Date(startDate), 'dd MMM yyyy', { locale: ar })} إلى {format(new Date(endDate), 'dd MMM yyyy', { locale: ar })}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">

                    {isError ? (
                        <div className="flex flex-col items-center gap-4 p-12 text-center">
                            <AlertCircle className="w-12 h-12 text-destructive" />
                            <div>
                                <h3 className="font-bold text-destructive text-lg">تعذر تحميل التقرير</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {error?.message || 'حدث خطأ أثناء جلب البيانات من الخادم'}
                                </p>
                            </div>
                            <Button onClick={() => refetch()} variant="outline" className="gap-2">
                                <RefreshCcw className="w-4 h-4" /> إعادة المحاولة
                            </Button>
                        </div>
                    ) : !hasAnyData ? (
                        <div className="flex flex-col items-center gap-3 p-12 text-center">
                            <AlertCircle className="w-10 h-10 text-muted-foreground/40" />
                            <h3 className="font-bold text-lg">لا توجد بيانات محاسبية لهذه الفترة</h3>
                            <p className="text-sm text-muted-foreground max-w-md">
                                لم يتم تسجيل أي قيود محاسبية (مبيعات، مصروفات، أو تكاليف بضاعة) في الفترة المختارة. جرّب توسيع النطاق الزمني أو تحقق من تسجيل الفواتير بشكل صحيح.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* 1. Revenue */}
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-4 border-b pb-2">الإيرادات</h3>
                                <div className="space-y-2">
                                    {Object.entries(financials?.revenue?.breakdown || {}).map(([name, val]) => (
                                        <div key={name} className="flex justify-between text-muted-foreground">
                                            <span>{name}</span>
                                            <span>{Number(val || 0).toLocaleString()} ج.م</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between font-bold text-black text-lg pt-2 mt-2 border-t border-dashed">
                                        <span>إجمالي الإيرادات</span>
                                        <span>{Number(financials?.revenue?.total || 0).toLocaleString()} ج.م</span>
                                    </div>
                                </div>
                            </section>

                            {/* 2. COGS */}
                            <section>
                                <div className="flex justify-between text-destructive mb-2">
                                    <span>تكلفة البضاعة المباعة</span>
                                    <span>({Number(financials?.cogs || 0).toLocaleString()}) ج.م</span>
                                </div>
                                <div className="flex justify-between font-bold text-xl bg-muted50 p-4 rounded-lg mt-4 border">
                                    <span>مجمل الربح (Gross Profit)</span>
                                    <span>{Number(financials?.grossProfit || 0).toLocaleString()} ج.م</span>
                                </div>
                            </section>

                            {/* 3. Expenses */}
                            <section>
                                <h3 className="text-lg font-bold text-foreground mb-4 border-b pb-2">المصروفات التشغيلية</h3>
                                <div className="space-y-2">
                                    {Object.entries(financials?.operatingExpenses?.breakdown || {}).map(([name, val]) => (
                                        <div key={name} className="flex justify-between text-muted-foreground">
                                            <span>{name}</span>
                                            <span>({Number(val || 0).toLocaleString()}) ج.م</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between font-bold text-black pt-2 mt-2 border-t border-dashed">
                                        <span>إجمالي المصروفات</span>
                                        <span className="text-destructive">({Number(financials?.operatingExpenses?.total || 0).toLocaleString()}) ج.م</span>
                                    </div>
                                </div>
                            </section>

                            {/* 4. Net Profit */}
                            <section className="mt-8 pt-8 border-t-2 border-black">
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold">صافي الربح (Net Profit)</span>
                                    <span className={`text-3xl font-bold ${financials?.netProfit >= 0 ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10'} px-6 py-2 rounded-xl`}>
                                        {Number(financials?.netProfit || 0).toLocaleString()} ج.م
                                    </span>
                                </div>
                            </section>
                        </>
                    )}

                </CardContent>
            </Card>
        </div>
    );
}
