import { RoleGate } from '@/components/auth/RoleGate';
import { ROLES } from '@/lib/permissions';

export const metadata = {
  title: 'المستحقات',
};

export default function FinanceLayout({ children }) {
  return <RoleGate roles={[ROLES.OWNER, ROLES.MANAGER]}>{children}</RoleGate>;
}
