'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, History, ArrowUpRight, ArrowDownRight, RefreshCcw, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ReportService } from '@/services/reportService';

export default function PriceHistoryPage() {
    const [search, setSearch] = useState('');

    const { data: history = [], isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ['price-history'],
        queryFn: ({ signal }) => ReportService.getAllPriceHistory({ signal })
    });

    // Client-side filtering
    const filteredHistory = history.filter(item => {
        const name = item.productId?.name?.toLowerCase() || '';
        const code = item.productId?.code?.toLowerCase() || '';
        return name.includes(search.toLowerCase()) || code.includes(search.toLowerCase());
    });

    const getPriceTypeLabel = (type) => {
        const types = {
            'retail': 'قطاعي',
            'wholesale': 'جملة',
            'special': 'خاص',
            'buy': 'شراء'
        };
        return types[type] || type;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">سجل تغيرات الأسعار</h1>
                <p className="text-muted-foreground mt-2">
                    تتبع تاريخ تعديلات أسعار المنتجات (شراء وبيع)
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="بحث باسم المنتج أو الكود..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pr-9"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            aria-label="تحديث السجل"
                            title="تحديث السجل"
                        >
                            <RefreshCcw className={isFetching ? "animate-spin" : ""} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isError ? (
                        <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                            <AlertCircle className="w-12 h-12 text-destructive" />
                            <div>
                                <h3 className="font-bold text-destructive text-lg">تعذر تحميل السجل</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {error?.message || 'حدث خطأ أثناء جلب البيانات'}
                                </p>
                            </div>
                            <Button onClick={() => refetch()} variant="outline" className="gap-2">
                                <RefreshCcw className="h-4 w-4" /> إعادة المحاولة
                            </Button>
                        </div>
                    ) : isLoading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="animate-spin w-10 h-10 text-primary" />
                        </div>
                    ) : (
                        <div className="border rounded-md">
                            <Table aria-label="سجل الأسعار">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>التاريخ</TableHead>
                                        <TableHead>المنتج</TableHead>
                                        <TableHead>نوع السعر</TableHead>
                                        <TableHead>السعر القديم</TableHead>
                                        <TableHead>السعر الجديد</TableHead>
                                        <TableHead>التغيير</TableHead>
                                        <TableHead>بواسطة</TableHead>
                                        <TableHead>السبب</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredHistory.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                                {history.length === 0
                                                    ? 'لا توجد سجلات لتغيرات الأسعار بعد'
                                                    : 'لا توجد نتائج تطابق البحث'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredHistory.map((item) => (
                                            <TableRow key={item._id}>
                                                <TableCell className="text-xs">
                                                    {format(new Date(item.date), 'dd MMMM yyyy - hh:mm a', { locale: ar })}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{item.productId?.name || item.productName || 'منتج محذوف'}</div>
                                                    <div className="text-xs text-muted-foreground">{item.productId?.code || item.productCode}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{getPriceTypeLabel(item.priceType)}</Badge>
                                                </TableCell>
                                                <TableCell>{Number(item.oldPrice || 0).toLocaleString()}</TableCell>
                                                <TableCell className="font-bold">{Number(item.newPrice || 0).toLocaleString()}</TableCell>
                                                <TableCell dir="ltr" className="text-right">
                                                    {(item.changeAmount || 0) > 0 ? (
                                                        <span className="text-success flex items-center justify-end gap-1">
                                                            {Number(item.changePercentage || 0).toFixed(1)}% <ArrowUpRight className="h-3 w-3" />
                                                        </span>
                                                    ) : (
                                                        <span className="text-destructive flex items-center justify-end gap-1">
                                                            {Number(item.changePercentage || 0).toFixed(1)}% <ArrowDownRight className="h-3 w-3" />
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-xs">{item.changedBy?.name || 'النظام'}</TableCell>
                                                <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate" title={item.changeReason}>
                                                    {item.changeReason || '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
