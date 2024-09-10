import { NoAccessPage } from '@app/components/app/no-access-page';
import { StaticDataContext } from '@app/components/app/static-data-context';
import type { Role } from '@app/types/bruker';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';

interface Props {
  roles: Role[];
}

export const ProtectedRoute = ({ roles }: Props) => {
  const { user } = useContext(StaticDataContext);
  const hasRole = user.roller.some((r) => roles.includes(r));

  if (hasRole) {
    return <Outlet />;
  }

  return <NoAccessPage requiredRoles={roles} />;
};
