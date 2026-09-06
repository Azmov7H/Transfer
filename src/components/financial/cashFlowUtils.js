'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const safeNumber = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);

function bucketKey(date, granularity) {
    const d = new Date(date);
    if (granularity === 'month') return format(d, 'yyyy-MM');
    return format(d, 'yyyy-MM-dd');
}

function bucketLabel(key, granularity) {
    const d = new Date(key.length === 7 ? `${key}-01` : key);
    return granularity === 'month'
        ? format(d, 'MMM', { locale: ar })
        : format(d, 'dd MMM', { locale: ar });
}

/**
 * Aggregate transactions into chronological cash-flow buckets.
 * Daily buckets for short ranges, monthly once the span exceeds ~60 days.
 */
export function bucketCashFlow(transactions = []) {
    if (!transactions.length) return [];

    const dates = transactions.map(t => new Date(t.date).getTime()).filter(Number.isFinite);
    const spanDays = dates.length
        ? (Math.max(...dates) - Math.min(...dates)) / 86400000
        : 0;
    const granularity = spanDays > 60 ? 'month' : 'day';

    const buckets = new Map();
    for (const tx of transactions) {
        if (!tx.date) continue;
        const key = bucketKey(tx.date, granularity);
        if (!buckets.has(key)) buckets.set(key, { key, label: bucketLabel(key, granularity), income: 0, expense: 0 });
        const b = buckets.get(key);
        const amt = safeNumber(tx.amount);
        if (tx.type === 'INCOME') b.income += amt;
        else b.expense += amt;
    }

    return [...buckets.values()].sort((a, b) => (a.key < b.key ? -1 : 1));
}

export function useCashFlowData(transactions) {
    return useMemo(() => bucketCashFlow(transactions), [transactions]);
}

/**
 * Attach display labels to server-aggregated cash-flow buckets
 * ({ key, income, expense } with a day/month granularity, as returned by
 * GET /api/treasury/cashflow).
 */
export function labelCashFlowBuckets(buckets = [], granularity = 'day') {
    return buckets.map((b) => ({ ...b, label: bucketLabel(b.key, granularity) }));
}
