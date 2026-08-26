'use client';

import * as React from 'react';
import { cn } from '@/utils';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

export function StatCard({
    title,
    value,
    unit,
    icon: Icon,
    subtitle,
    trend,
    trendValue,
    variant = 'primary',
    className
}) {
    const variants = {
        primary: 'from-primary/20 to-primary/5 border-primary/20 text-primary shadow-primary/10',
        success: 'from-success/20 to-success/5 border-success/20 text-success shadow-success/10',
        info: 'from-info/20 to-info/5 border-info/20 text-info shadow-blue-500/10',
        warning: 'from-warning/20 to-warning/5 border-warning/20 text-warning shadow-warning/10',
        destructive: 'from-destructive/20 to-destructive/5 border-destructive/20 text-destructive shadow-destructive/10',
        slate: 'from-foreground/20 to-foreground/5 border-border/20 text-muted-foreground shadow-slate-500/10',
    };

    return (
        <div
            className={cn(
                "glass-card p-6 rounded-[2.5rem] border overflow-hidden relative group transition-all duration-500",
                "bg-gradient-to-br shadow-2xl hover:scale-[1.02] hover:-translate-y-2",
                variants[variant],
                className
            )}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />

            <div className="flex justify-between items-start relative z-10 mb-6">
                <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">
                        {title}
                    </p>
                    {subtitle && <p className="text-sm font-bold opacity-40">{subtitle}</p>}
                </div>
                {Icon && (
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner group-hover:rotate-12 transition-transform">
                        <Icon size={24} />
                    </div>
                )}
            </div>

            <div className="relative z-10 flex items-baseline gap-2">
                <h3 className="text-4xl font-black tabular-nums tracking-tighter">
                    {value}
                </h3>
                {unit && <span className="text-lg font-black opacity-40">{unit}</span>}
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black opacity-40 group-hover:opacity-100 transition-opacity">
                    {trend ? (
                        <>
                            <TrendingUp size={12} className={trend === 'up' ? 'text-success' : 'text-destructive'} />
                            <span className={trend === 'up' ? 'text-success' : 'text-destructive'}>{trendValue}</span>
                        </>
                    ) : (
                        <>
                            <TrendingUp size={12} />
                            <span>تحديث حيّ</span>
                        </>
                    )}
                </div>
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </div>
        </div>
    );
}
