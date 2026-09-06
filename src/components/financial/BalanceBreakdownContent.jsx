'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';

const SEGMENTS = [
    { key: 'cash', label: 'كاش', color: 'hsl(var(--success))' },
    { key: 'bank', label: 'بنك', color: 'hsl(var(--info))' },
    { key: 'wallet', label: 'محفظة', color: 'hsl(var(--warning))' },
    { key: 'instapay', label: 'انستا باي', color: 'hsl(var(--primary))' },
    { key: 'check', label: 'شيك', color: 'hsl(var(--secondary))' },
];

export function BalanceBreakdownContent({ breakdown = {} }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const data = SEGMENTS
        .map(s => ({ name: s.label, value: Number(breakdown[s.key]) || 0, color: s.color }))
        .filter(s => s.value > 0);

    if (!data.length) {
        return (
            <div className="h-full w-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                لا توجد أرصدة موزعة بعد
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={3} strokeWidth={0}>
                    {data.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: isDark ? 'rgba(15, 15, 20, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '12px',
                        border: '1px solid hsla(var(--primary) / 0.2)',
                        fontWeight: 'bold',
                        direction: 'rtl'
                    }}
                    formatter={(value, name) => [Number(value).toLocaleString(), name]}
                />
                <Legend formatter={(v) => v} wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
            </PieChart>
        </ResponsiveContainer>
    );
}
