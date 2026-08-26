'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, EyeOff, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/utils';

export function CountItemsTable({ search, setSearch, filteredItems, isBlind, isCompleted, movementsSinceSnapshot, onQuantityChange }) {
    return (
        <Card className="glass-card border-0 shadow-custom-xl overflow-hidden rounded-[2.5rem]">
            <CardHeader className="p-8 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <CardTitle className="text-2xl font-black">قائمة المواد</CardTitle>
                        <div className="relative flex-1 min-w-64 lg:min-w-96">
                            <Search className="absolute right-4 top-3.5 h-4 w-4 text-muted-foreground/40" />
                            <Input
                                placeholder="بحث سريع باسم المنتج أو الكود..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-11 rounded-xl bg-muted/30 border-0 pr-10 font-bold text-right"
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    {isBlind && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning/10 border border-warning/20 text-warning font-bold text-xs">
                            <EyeOff className="w-4 h-4" /> وضع الجرد الأعمى نشط: الفروقات مخفية حتى يتم الاعتماد.
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table aria-label="أصناف الجرد">
                        <TableHeader className="bg-muted/30">
                            <TableRow className="border-0 hover:bg-transparent">
                                <TableHead className="w-[350px] font-black py-6 pr-8 text-primary text-right">المنتج والتفاصيل</TableHead>
                                <TableHead className="font-black text-center">الكمية المقررة</TableHead>
                                <TableHead className="w-[200px] font-black text-center text-primary">الكمية الفعلية (جرد)</TableHead>
                                <TableHead className="font-black text-center">حالة المطابقة</TableHead>
                                {!isBlind && <TableHead className="font-black text-left pl-8">الأثر المالي</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence mode="popLayout">
                                {filteredItems.map((item, index) => {
                                    const prodId = item.productId?._id || item.productId;
                                    return (
                                        <motion.tr
                                            key={index}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "border-b border-muted/20 hover:bg-muted/5 transition-colors group",
                                                !isBlind && item.difference !== 0 ? 'bg-destructive/[0.02]' : '',
                                                (prodId && movementsSinceSnapshot?.[prodId]) ? 'bg-warning/[0.03]' : ''
                                            )}
                                        >
                                            <TableCell className="py-6 pr-8 text-right">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center font-black text-xs text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-black text-base">{item.productName}</div>
                                                            {movementsSinceSnapshot?.[prodId] && (
                                                                <Badge className="bg-warning text-white text-xs px-1.5 py-0 border-0 flex items-center gap-1">
                                                                    <RefreshCw size={8} className="animate-spin" />
                                                                    حركة مؤخراً
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-xs font-bold text-muted-foreground flex items-center gap-2 mt-1">
                                                            <Badge variant="secondary" className="px-2 py-0 h-4 text-xs font-black rounded-sm">{item.productCode}</Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <span className={cn(
                                                    "text-lg font-black tracking-tight",
                                                    isBlind ? "blur-md select-none opacity-20" : "text-muted-foreground"
                                                )}>
                                                    {isBlind ? '888' : item.systemQty}
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    {isCompleted ? (
                                                        <Badge className="h-10 px-6 rounded-xl bg-muted text-muted-foreground border-0 font-black text-lg">
                                                            {item.actualQty}
                                                        </Badge>
                                                    ) : (
                                                        <div className="relative group/input flex items-center">
                                                            <Input
                                                                type="number"
                                                                value={item.actualQty}
                                                                onChange={(e) => onQuantityChange(prodId, e.target.value)}
                                                                className={cn(
                                                                    "w-32 h-14 rounded-2xl text-center text-xl font-black border-2 transition-all",
                                                                    !isBlind && item.difference !== 0
                                                                        ? 'border-destructive/30 bg-destructive/5 text-destructive'
                                                                        : 'border-transparent bg-muted/40'
                                                                )}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    {isBlind ? (
                                                        item.actualQty > 0 ? (
                                                            <Badge className="bg-primary/10 text-primary border-0 font-black rounded-lg">
                                                                تم الجرد
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-muted text-muted-foreground border-0 font-black rounded-lg">
                                                                بانتظار العد
                                                            </Badge>
                                                        )
                                                    ) : (
                                                        <>
                                                            {item.difference > 0 ? (
                                                                <Badge className="bg-success/10 text-success border-0 font-black rounded-lg">
                                                                    زيادة {item.difference}+
                                                                </Badge>
                                                            ) : item.difference < 0 ? (
                                                                <Badge className="bg-destructive/10 text-destructive border-0 font-black rounded-lg">
                                                                    عجز {item.difference}
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-muted text-muted-foreground border-0 font-black rounded-lg">
                                                                    مطابق
                                                                </Badge>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {!isBlind && (
                                                <TableCell className="text-left pl-8">
                                                    <div className={cn(
                                                        "text-lg font-black tracking-tighter",
                                                        item.value > 0 ? "text-success" : item.value < 0 ? "text-destructive" : "text-muted-foreground/30"
                                                    )} dir="ltr">
                                                        {item.value === 0 ? '-' : (item.value > 0 ? `+${item.value.toLocaleString()}` : item.value.toLocaleString())}
                                                    </div>
                                                </TableCell>
                                            )}
                                        </motion.tr>
                                    )
                                })}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
