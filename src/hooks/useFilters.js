'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebounce } from './useDebounce';

/**
 * Standard hook for managing search, pagination, and basic filtering.
 * Automates common patterns like resetting page on search change.
 *
 * Filters are URL-backed (STATE-003): search/filter/page sync to query
 * params via replace so refresh and share links preserve state. Param
 * names (`q`, `filter`, `page`) match the legacy useSearchParams usage.
 */
export function useFilters(initialLimit = 50, { urlSync = true } = {}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [search, setSearch] = useState(() => searchParams.get('q') || '');
    const [filter, setFilter] = useState(() => searchParams.get('filter') || 'all');
    const [page, setPage] = useState(() => parseInt(searchParams.get('page')) || 1);
    const [limit, setLimit] = useState(initialLimit);

    const debouncedSearch = useDebounce(search, 500);

    // Reset page to 1 when search or filter changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filter]);

    // URL sync: replace (not push) so typing doesn't pollute history
    useEffect(() => {
        if (!urlSync) return;
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('q', debouncedSearch);
        if (filter && filter !== 'all') params.set('filter', filter);
        if (page > 1) params.set('page', String(page));

        const qs = params.toString();
        const target = qs ? `${pathname}?${qs}` : pathname;
        if (target !== `${pathname}${window.location.search}`) {
            router.replace(target, { scroll: false });
        }
    }, [debouncedSearch, filter, page, urlSync, pathname, router]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    return {
        search, setSearch,
        filter, setFilter,
        page, setPage,
        limit, setLimit,
        debouncedSearch,
        handleSearch,
        // Common param object for queries
        queryContext: {
            page,
            limit,
            ...(debouncedSearch ? { search: debouncedSearch } : {})
        }
    };
}
