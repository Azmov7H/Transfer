'use client';

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

/**
 * Daily sales/profit bar chart — recharts implementation (FE-PERF-002).
 * Faithful recreation of the previous chart.js version: gradient bars,
 * RTL legend, currency tooltips.
 */
export function SalesChart({ dailyBreakdown }) {
    const formatCurrency = (val) => Number(val || 0).toLocaleString() + ' ج.م';

    const data = (dailyBreakdown || [])
        .map(d => ({
            date: new Date(d.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
            'المبيعات': d.totalRevenue || 0,
            'الأرباح': d.grossProfit || 0,
        }))
        .reverse();

    return (
        <div className="h-[400px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barSize="26%" margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                    <defs>
                        <linearGradient id="salesBarGradient" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="5%" stopColor="rgba(59, 130, 246, 0.1)" />
                            <stop offset="95%" stopColor="rgba(59, 130, 246, 0.8)" />
                        </linearGradient>
                        <linearGradient id="profitBarGradient" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="5%" stopColor="rgba(16, 185, 129, 0.1)" />
                            <stop offset="95%" stopColor="rgba(16, 185, 129, 0.8)" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255, 255, 255, 0.2)', fontSize: 10, fontWeight: 'bold', fontFamily: 'mono' }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        width={60}
                        tick={{ fill: 'rgba(255, 255, 255, 0.2)', fontSize: 10, fontFamily: 'mono' }}
                        tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 16,
                            padding: 16,
                            direction: 'rtl',
                        }}
                        labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}
                        itemStyle={{ fontFamily: 'mono', fontSize: 12 }}
                        formatter={(value, name) => [formatCurrency(value), name]}
                    />
                    <Legend
                        iconType="circle"
                        wrapperStyle={{
                            direction: 'rtl',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 12,
                            fontWeight: 900,
                            color: 'rgba(255, 255, 255, 0.4)',
                            paddingBottom: 12,
                        }}
                    />
                    <Bar dataKey="المبيعات" fill="url(#salesBarGradient)" stroke="hsl(var(--info))" strokeWidth={2} radius={[12, 12, 0, 0]} />
                    <Bar dataKey="الأرباح" fill="url(#profitBarGradient)" stroke="hsl(var(--success))" strokeWidth={2} radius={[12, 12, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
