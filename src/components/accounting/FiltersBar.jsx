'use client';

import { useState } from 'react';
import {
    Search, Filter, Download, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils';

export function FiltersBar({ filters, setFilters, onReset, onExport, totalEntries }) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search */}
                <div className="flex-1 relative group w-full">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="ابحث في الوصف أو رقم القيد..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="pr-12 h-14 glass-card border-white/5 rounded-2xl focus-visible:ring-primary/20 bg-white/[0.02]"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "h-14 px-6 rounded-2xl font-bold text-sm glass-card border-white/10 transition-all",
                            showFilters && "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                        )}
                    >
                        <Filter className="w-4 h-4 ml-2" />
                        تصفية
                    </Button>

                    <Button
                        onClick={onExport}
                        className="h-14 px-6 rounded-2xl font-bold text-sm bg-success hover:bg-success text-white shadow-lg shadow-success/20 gap-2"
                    >
                        <Download className="w-4 h-4" />
                        تصدير ({totalEntries})
                    </Button>

                    {(filters.search || filters.type || filters.dateFrom || filters.dateTo) && (
                        <Button
                            variant="ghost"
                            onClick={onReset}
                            className="h-14 px-4 rounded-2xl font-bold text-sm text-destructive hover:bg-destructive/10"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="glass-card p-4 rounded-xl border border-white/10 bg-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Entry Type Filter */}
                        <div>
                            <label className="text-xs font-bold text-muted-foreground mb-2 block">نوع القيد</label>
                            <Select value={filters.type} onValueChange={(val) => setFilters({ ...filters, type: val })}>
                                <SelectTrigger className="h-10 bg-white/5 border-white/10">
                                    <SelectValue placeholder="جميع الأنواع" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">جميع الأنواع</SelectItem>
                                    <SelectItem value="SALE">مبيعات</SelectItem>
                                    <SelectItem value="PURCHASE">مشتريات</SelectItem>
                                    <SelectItem value="RETURN">مردودات</SelectItem>
                                    <SelectItem value="RETURN_COGS">مردودات تكلفة</SelectItem>
                                    <SelectItem value="PAYMENT">دفع</SelectItem>
                                    <SelectItem value="ADJUSTMENT">تسوية</SelectItem>
                                    <SelectItem value="COGS">تكلفة بضاعة</SelectItem>
                                    <SelectItem value="EXPENSE">مصروف</SelectItem>
                                    <SelectItem value="INCOME">إيراد</SelectItem>
                                    <SelectItem value="TRANSFER">تحويل</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date From */}
                        <div>
                            <label className="text-xs font-bold text-muted-foreground mb-2 block">من تاريخ</label>
                            <Input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                className="h-10 bg-white/5 border-white/10"
                            />
                        </div>

                        {/* Date To */}
                        <div>
                            <label className="text-xs font-bold text-muted-foreground mb-2 block">إلى تاريخ</label>
                            <Input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                className="h-10 bg-white/5 border-white/10"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
