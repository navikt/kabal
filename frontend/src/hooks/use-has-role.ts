import { useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import type { Role } from '@/types/bruker';

export const useHasAnyOfRoles = (roles?: Role[]) => {
  const { user } = useContext(StaticDataContext);

  if (typeof roles === 'undefined' || roles.length === 0) {
    return true;
  }

  if (user.roller.length === 0) {
    return false;
  }

  return roles.some((role) => user.roller.includes(role));
};

export const useHasRole = (role: Role) => {
  const { user } = useContext(StaticDataContext);

  return user.roller.includes(role);
};
