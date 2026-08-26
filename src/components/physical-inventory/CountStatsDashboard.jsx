'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Activity, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/utils';

export function CountStatsDashboard({ localItems, discrepancies, isBlind }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                {
                    label: 'تقدم الجرد',
                    value: `${Math.round(localItems.filter(i => i.actualQty > 0).length / localItems.length * 100)}%`,
                    icon: Activity,
                    color: 'primary'
                },
                {
                    label: 'معدل المطابقة',
                    value: isBlind ? '---' : `${Math.round((localItems.length - discrepancies.count) / localItems.length * 100)}%`,
                    icon: Zap,
                    color: isBlind ? 'primary' : (discrepancies.count > 0 ? 'amber' : 'emerald'),
                    sub: isBlind ? 'مخفي في وضع الجرد الأعمى' : `${discrepancies.count} صنف غير مطابق`
                },
                {
                    label: 'الأصناف المتأثرة',
                    value: isBlind ? '---' : discrepancies.count,
                    icon: AlertTriangle,
                    color: isBlind ? 'primary' : 'rose',
                    sub: 'بحاجة لتبرير أو مراجعة'
                },
                {
                    label: 'الأثر المالي المتوقع',
                    value: isBlind ? '---' : discrepancies.valueImpact.toLocaleString(),
                    symbol: isBlind ? '' : 'ج.م',
                    icon: TrendingUp,
                    color: isBlind ? 'primary' : (discrepancies.valueImpact >= 0 ? 'emerald' : 'rose')
                },
            ].map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Card className="glass-card border-0 shadow-custom-xl overflow-hidden rounded-3xl h-full">
                        <CardContent className="p-6 relative">
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn("p-3 rounded-2xl", `bg-${stat.color}-500/10`)}>
                                    <stat.icon className={cn("w-6 h-6", `text-${stat.color}-500`)} />
                                </div>
                                <Badge variant="outline" className="text-xs font-bold uppercase opacity-60">Insight</Badge>
                            </div>
                            <h3 className="text-sm font-bold text-muted-foreground">{stat.label}</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-3xl font-bold tracking-tighter">{stat.value}</span>
                                {stat.symbol && <span className="text-sm font-bold text-muted-foreground">{stat.symbol}</span>}
                            </div>
                            {stat.sub && <p className="text-xs font-bold mt-2 text-muted-foreground/60">{stat.sub}</p>}
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
