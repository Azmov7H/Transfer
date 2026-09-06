'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useTheme } from 'next-themes';

const tooltipStyle = (isDark) => ({
    backgroundColor: isDark ? 'rgba(15, 15, 20, 0.9)' : 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    border: '1px solid hsla(var(--primary) / 0.2)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    fontWeight: 'bold',
    direction: 'rtl'
});

export function CashFlowChartContent({ data }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const gridStroke = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    const tick = { fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="cfIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cfExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={tick} dy={10} minTickGap={24} />
                <YAxis axisLine={false} tickLine={false} tick={tick} width={56} tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}k` : v} />
                <Tooltip contentStyle={tooltipStyle(isDark)} formatter={(value, name) => [Number(value).toLocaleString(), name === 'income' ? 'إيرادات' : 'مصروفات']} labelStyle={{ fontWeight: 'bold' }} />
                <Legend formatter={(v) => (v === 'income' ? 'إيرادات' : 'مصروفات')} wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
                <Area type="monotone" dataKey="income" stroke="hsl(var(--success))" strokeWidth={2.5} fillOpacity={1} fill="url(#cfIncome)" />
                <Area type="monotone" dataKey="expense" stroke="hsl(var(--destructive))" strokeWidth={2.5} fillOpacity={1} fill="url(#cfExpense)" />
            </AreaChart>
        </ResponsiveContainer>
    );
}
