'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Barcode,
    Tag,
    Eye,
    FileEdit,
    Trash2,
    XCircle,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/utils';

/**
 * Mobile card fallback for the products list (FE-RWD-001).
 * Mirrors ProductRow fields with one-handed inline actions (≥44px targets).
 */
export const ProductCard = React.memo(({
    product,
    canManage,
    onView,
    onEdit,
    onDelete
}) => {
    const stockStatus = product.stockQty === 0 ? 'out' :
        product.stockQty <= (product.minLevel || 5) ? 'low' : 'available';

    return (
        <div className="glass-card border border-white/10 rounded-3xl p-4 bg-white/[0.02] transition-all duration-300 cursor-default">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                        <Barcode className="h-6 w-6 opacity-60" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-black text-base leading-tight text-foreground truncate">
                            {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="font-black text-xs tracking-widest border-white/10 bg-white/5 px-2 py-0.5 rounded-md text-muted-foreground">
                                {product.code}
                            </Badge>
                            {product.unit && (
                                <span className="text-xs text-muted-foreground/40 font-black uppercase tracking-tighter">وحدة: {product.unit}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className={cn(
                    "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-black uppercase tracking-widest",
                    stockStatus === 'out' ? "bg-destructive/10 text-destructive border-destructive/20" :
                        stockStatus === 'low' ? "bg-warning/10 text-warning border-warning/20" :
                            "bg-success/10 text-success border-success/20"
                )}>
                    {stockStatus === 'out' ? (
                        <><XCircle size={11} /> نفذت</>
                    ) : stockStatus === 'low' ? (
                        <><AlertTriangle size={11} /> منخفض</>
                    ) : (
                        <><CheckCircle2 size={11} /> متوفر</>
                    )}
                </div>
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs font-black text-muted-foreground/50 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Tag className="h-3 w-3 text-primary/60" />{product.brand || 'عام'}</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>{product.category || '-'}</span>
            </div>

            <div className="mt-3 flex items-end justify-between gap-2">
                <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black tabular-nums tracking-tighter text-primary">
                        {(product.retailPrice || product.sellPrice || 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground font-black uppercase opacity-40">ج.م</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                        <div className={cn(
                            "h-8 px-4 rounded-xl border flex items-center justify-center font-black tabular-nums",
                            stockStatus === 'out' ? "bg-destructive/10 text-destructive border-destructive/20" :
                                stockStatus === 'low' ? "bg-warning/10 text-warning border-warning/20" :
                                    "bg-success/10 text-success border-success/20"
                        )}>
                            {product.stockQty}
                        </div>
                        <div className="flex gap-2 mt-1 text-xs font-black text-muted-foreground/40 uppercase tracking-widest">
                            <span>م: {product.warehouseQty || 0}</span>
                            <span>ح: {product.shopQty || 0}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 -m-1.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView(product)}
                            className="h-11 w-11 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary text-white/40 border border-white/5 transition-all"
                            aria-label="عرض المنتج"
                            title="عرض المنتج"
                        >
                            <Eye size={16} />
                        </Button>
                        {canManage && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(product)}
                                    className="h-11 w-11 rounded-xl bg-white/5 hover:bg-warning/20 hover:text-warning text-white/40 border border-white/5 transition-all"
                                    aria-label="تعديل الصنف"
                                    title="تعديل الصنف"
                                >
                                    <FileEdit size={16} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete(product._id)}
                                    className="h-11 w-11 rounded-xl bg-white/5 hover:bg-destructive/20 hover:text-destructive text-white/40 border border-white/5 transition-all"
                                    aria-label="حذف نهائي"
                                    title="حذف نهائي"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';
