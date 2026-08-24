'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

/**
 * Test harness helpers (FE-TEST-001).
 *
 * - `createTestQueryClient()` — fresh QueryClient per test: retries off so
 *   failures surface immediately, gc disabled so data survives within a test.
 * - `renderWithProviders(ui)` — wraps RTL render with the query provider.
 */

export function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: Infinity,
            },
            mutations: {
                retry: false,
            },
        },
    });
}

export function renderWithProviders(ui, { client = createTestQueryClient(), ...options } = {}) {
    function Wrapper({ children }) {
        return (
            <QueryClientProvider client={client}>
                {children}
            </QueryClientProvider>
        );
    }
    return { ...render(ui, { wrapper: Wrapper, ...options }), queryClient: client };
}

/**
 * Envelope-shaped fetch response fixtures matching api-utils' contract:
 * the fetcher unwraps `{ success, data }` and throws JammazApiError otherwise.
 */
export function envelopeOk(data) {
    return { success: true, data };
}

export function envelopeFail(message = 'API Error', status = 400) {
    return { success: false, message };
}

/** jsdom Response-like object for mocked global fetch. */
export function jsonResponse(body, { status = 200, ok = status >= 200 && status < 300 } = {}) {
    return {
        ok,
        status,
        json: async () => body,
    };
}
