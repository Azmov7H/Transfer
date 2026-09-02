/**
 * DocumentHeader / DocumentFooter / DocumentPrintStyles smoke tests.
 *
 * These are deliberately shallow — the components are pure render
 * functions; the deeper UX is exercised in Sprint 14 (manual +
 * integration). Here we lock the structural contracts:
 *  - DocumentHeader renders the company name, title, number, date.
 *  - DocumentFooter renders the footer text + filter summary + page info.
 *  - DocumentPrintStyles renders a <style> element with @media print.
 */
import { render, screen } from '@testing-library/react';
import { DocumentHeader } from './DocumentHeader';
import { DocumentFooter } from './DocumentFooter';
import { DocumentPrintStyles } from './DocumentPrintStyles';

const BRANDING = {
    companyName: 'مؤسستي',
    companyLogo: '',
    showLogo: false,
    showQRCode: true,
    primaryColor: '#1B3C73',
    headerBgColor: '#1B3C73',
    address: 'القاهرة - العتبة',
    phone: '01000000000',
    additionalPhones: ['01111111111'],
    email: 'a@b.co',
    website: 'https://example.com',
    footerText: 'شكراً لتعاملكم',
};

describe('DocumentHeader', () => {
    test('renders the company name + title + number + date', () => {
        render(
            <DocumentHeader
                branding={BRANDING}
                title="فاتورة مبيعات"
                meta={{ number: 'INV-001', date: '30/08/2026', time: '14:30' }}
            />
        );
        expect(screen.getByText('مؤسستي')).toBeInTheDocument();
        expect(screen.getByText('فاتورة مبيعات')).toBeInTheDocument();
        expect(screen.getByText('INV-001')).toBeInTheDocument();
        expect(screen.getByText(/30\/08\/2026/)).toBeInTheDocument();
        expect(screen.getByText(/14:30/)).toBeInTheDocument();
    });

    test('renders address, phone, email, website when present', () => {
        render(<DocumentHeader branding={BRANDING} title="X" />);
        expect(screen.getByText('القاهرة - العتبة')).toBeInTheDocument();
        expect(screen.getByText('01000000000')).toBeInTheDocument();
        expect(screen.getByText('01111111111')).toBeInTheDocument();
        expect(screen.getByText('a@b.co')).toBeInTheDocument();
        expect(screen.getByText('https://example.com')).toBeInTheDocument();
    });

    test('falls back to the company initial when there is no logo', () => {
        const { container } = render(
            <DocumentHeader
                branding={{ ...BRANDING, companyLogo: '', showLogo: false }}
                title="X"
            />
        );
        expect(container.textContent).toContain('م');
    });

    test('hides optional contact lines when fields are missing', () => {
        render(
            <DocumentHeader
                branding={{
                    ...BRANDING,
                    address: '', phone: '', additionalPhones: [],
                    email: '', website: '',
                }}
                title="X"
            />
        );
        expect(screen.queryByText('القاهرة - العتبة')).not.toBeInTheDocument();
        expect(screen.queryByText('a@b.co')).not.toBeInTheDocument();
    });

    test('accepts a custom right slot (e.g. QR code)', () => {
        render(
            <DocumentHeader
                branding={BRANDING}
                title="X"
                rightSlot={<div data-testid="qr-slot">QR</div>}
            />
        );
        expect(screen.getByTestId('qr-slot')).toBeInTheDocument();
    });

    test('renders a status badge when meta.status is a string', () => {
        render(
            <DocumentHeader
                branding={BRANDING}
                title="X"
                meta={{ number: 'INV-1', date: '1/1', status: 'مدفوع بالكامل' }}
            />
        );
        expect(screen.getByText('مدفوع بالكامل')).toBeInTheDocument();
    });
});

describe('DocumentFooter', () => {
    test('renders the footer text + generated-by + page info', () => {
        render(
            <DocumentFooter
                branding={BRANDING}
                pageInfo={{ current: 1, total: 3 }}
                generatedBy={{ name: 'علي' }}
            />
        );
        expect(screen.getByText('شكراً لتعاملكم')).toBeInTheDocument();
        expect(screen.getByText(/علي/)).toBeInTheDocument();
        expect(screen.getByText(/صفحة 1 من 3/)).toBeInTheDocument();
    });

    test('renders the applied filter summary', () => {
        render(
            <DocumentFooter
                branding={BRANDING}
                filters={{ from: '2026-01-01', to: '2026-12-31' }}
            />
        );
        expect(screen.getByTestId('document-footer-filters')).toHaveTextContent('from=2026-01-01');
        expect(screen.getByTestId('document-footer-filters')).toHaveTextContent('to=2026-12-31');
    });

    test('skips empty filter values', () => {
        render(
            <DocumentFooter
                branding={BRANDING}
                filters={{ from: '2026-01-01', to: '', unused: null }}
            />
        );
        const node = screen.getByTestId('document-footer-filters');
        expect(node.textContent).toContain('from=2026-01-01');
        expect(node.textContent).not.toContain('to=');
        expect(node.textContent).not.toContain('unused=');
    });

    test('hides the filter strip when hideFilters=true (e.g. receipts)', () => {
        render(
            <DocumentFooter
                branding={BRANDING}
                filters={{ from: '2026-01-01' }}
                hideFilters
            />
        );
        expect(screen.queryByTestId('document-footer-filters')).not.toBeInTheDocument();
    });

    test('falls back to "النظام" when no generatedBy is given', () => {
        render(<DocumentFooter branding={BRANDING} />);
        expect(screen.getByText(/النظام/)).toBeInTheDocument();
    });
});

describe('DocumentPrintStyles', () => {
    test('renders a <style> element with the @media print block', () => {
        const { container } = render(
            <>
                <DocumentPrintStyles />
                <div>body</div>
            </>
        );
        // styled-jsx injects styles into <head> at runtime; in jsdom the
        // textContent is sometimes attached to the body container, sometimes
        // detached. We accept either: any element under root with a
        // <style> node OR any text mentioning @media print.
        const styleTags = container.querySelectorAll('style');
        const headStyles = document.head.querySelectorAll('style');
        const all = Array.from([...styleTags, ...headStyles]);
        const text = all.map((s) => s.textContent || '').join('\n');
        expect(all.length).toBeGreaterThan(0);
        // styled-jsx minifies the CSS; check the key rules survive.
        expect(text).toContain('@media print');
        expect(text).toContain('@page');
        expect(text).toMatch(/size:\s*A4/);
        expect(text).toMatch(/print-color-adjust:\s*exact/);
    });
});
