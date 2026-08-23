import { RoleGate } from '@/components/auth/RoleGate';

export const metadata = {
  title: 'المخزون والمشتريات',
};

export default function OperationsLayout({ children }) {
  return <RoleGate permission="products:view">{children}</RoleGate>;
}
