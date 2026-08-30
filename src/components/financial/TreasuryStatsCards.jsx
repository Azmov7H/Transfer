'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, AlertTriangle } from 'lucide-react';

export function TreasuryStatsCards({ balance, treasuryData, periodStats }) {
    return (
        <>
                        <TooltipProvider>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                    {/* Total Balance Card */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Card className="bg-primary text-primary-foreground border-none shadow-md cursor-help">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm opacity-90">الرصيد الكلي</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{balance.toLocaleString()} ج.م</div>
                                    <div className="flex flex-col gap-0.5 mt-2 opacity-80 text-xs">
                                        <div className="flex justify-between">
                                            <span>كاش:</span>
                                            <span>{(treasuryData?.breakdown?.cash || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>بنك:</span>
                                            <span>{(treasuryData?.breakdown?.bank || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>محفظة:</span>
                                            <span>{(treasuryData?.breakdown?.wallet || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>انستا باي:</span>
                                            <span>{(treasuryData?.breakdown?.instapay || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TooltipTrigger>
                        <TooltipContent>المبلغ المتوفر حالياً في الصندوق والبنك والمحافظ</TooltipContent>
                    </Tooltip>

                    {/* Sales Profit Card */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Card className="border-none shadow-sm bg-info/10 dark:bg-info/20 cursor-help">
                                <CardHeader className="pb-1 pt-4 px-4">
                                    <CardTitle className="text-xs text-info dark:text-info flex items-center gap-1">
                                        <TrendingUp size={12} />
                                        أرباح المبيعات
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-xl font-bold text-info dark:text-info">
                                        {periodStats.salesProfit.toLocaleString()}
                                    </div>
                                </CardContent>
                            </Card>
                        </TooltipTrigger>
                        <TooltipContent>إجمالي الربح من الفواتير خلال الفترة المختارة</TooltipContent>
                    </Tooltip>

                    {/* Total Outstanding Debt */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Card className="border-none shadow-sm bg-warning/10 dark:bg-warning/20 cursor-help">
                                <CardHeader className="pb-1 pt-4 px-4">
                                    <CardTitle className="text-xs text-warning dark:text-warning flex items-center gap-1">
                                        <AlertTriangle size={12} />
                                        إجمالي المديونيات
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-xl font-bold text-warning dark:text-warning">
                                        {periodStats.totalDebt.toLocaleString()}
                                    </div>
                                </CardContent>
                            </Card>
                        </TooltipTrigger>
                        <TooltipContent>إجمالي المستحقات المتبقية عند العملاء (ديون نشطة)</TooltipContent>
                    </Tooltip>

                    {/* Period Income */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Card className="border-none shadow-sm bg-success/10 dark:bg-success/20 cursor-help">
                                <CardHeader className="pb-1 pt-4 px-4">
                                    <CardTitle className="text-xs text-success dark:text-success">إجمالي الإيرادات</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-xl font-bold text-success dark:text-success">
                                        +{periodStats.income.toLocaleString()}
                                    </div>
                                </CardContent>
                            </Card>
                        </TooltipTrigger>
                        <TooltipContent>إجمالي المداخيل المالية خلال الفترة</TooltipContent>
                    </Tooltip>

                    {/* Supplier Payments */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Card className="border-none shadow-sm bg-warning/10 dark:bg-warning/20 cursor-help">
                                <CardHeader className="pb-1 pt-4 px-4">
                                    <CardTitle className="text-xs text-warning dark:text-warning">دفعات موردين</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-xl font-bold text-warning dark:text-warning">
                                        -{periodStats.supplierPayments.toLocaleString()}
                                    </div>
                                </CardContent>
                            </Card>
                        </TooltipTrigger>
                        <TooltipContent>إجمالي المبالغ المدفوعة للموردين</TooltipContent>
                    </Tooltip>

                    {/* Period Shop Expense */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Card className="border-none shadow-sm bg-destructive/10 dark:bg-destructive/20 cursor-help">
                                <CardHeader className="pb-1 pt-4 px-4">
                                    <CardTitle className="text-xs text-destructive dark:text-destructive">مصروفات عامة</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-xl font-bold text-destructive dark:text-destructive">
                                        -{periodStats.shopExpenses.toLocaleString()}
                                    </div>
                                </CardContent>
                            </Card>
                        </TooltipTrigger>
                        <TooltipContent>إجمالي المصاريف التشغيلية والرواتب وغيرها</TooltipContent>
                    </Tooltip>

                    {/* Period Net */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Card className="border-none shadow-sm bg-info/10 dark:bg-info/20 cursor-help">
                                <CardHeader className="pb-1 pt-4 px-4">
                                    <CardTitle className="text-xs text-info dark:text-info">صافي الفترة</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className={`text-xl font-bold ${periodStats.net >= 0 ? 'text-info dark:text-info' : 'text-destructive dark:text-destructive'}`}>
                                        {periodStats.net.toLocaleString()}
                                    </div>
                                </CardContent>
                            </Card>
                        </TooltipTrigger>
                        <TooltipContent>صافي السيولة النقدية المحققة خلال الفترة</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </>
    );
}
