import { RoleGate } from '@/components/auth/RoleGate';
import { ROLES } from '@/lib/permissions';

export const metadata = {
  title: 'المالية',
};

export default function FinancialLayout({ children }) {
  return <RoleGate roles={[ROLES.OWNER, ROLES.MANAGER]}>{children}</RoleGate>;
}
