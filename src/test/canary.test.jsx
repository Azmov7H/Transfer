import { describe, it, expect } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { renderWithProviders } from './utils';

/**
 * Canary (FE-TEST-001): proves the harness renders components that consume
 * the query cache. Envelope fixtures (`envelopeOk`) belong to fetch-level
 * mocks (see src/lib/api-utils.test.js); queryFn returns unwrapped data.
 */
function Probe({ queryFn }) {
    const { data, isLoading } = useQuery({ queryKey: ['probe'], queryFn });
    if (isLoading) return <p>loading</p>;
    return <p>value:{data?.label}</p>;
}

describe('test harness canary', () => {
    it('renders through QueryClientProvider with a fresh client', async () => {
        renderWithProviders(
            <Probe queryFn={async () => ({ label: 'canary' })} />
        );

        expect(screen.getByText('loading')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('value:canary')).toBeInTheDocument();
        });
    });
});
