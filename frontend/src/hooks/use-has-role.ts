import { StaticDataContext } from '@app/components/app/static-data-context';
import type { Role } from '@app/types/bruker';
import { useContext } from 'react';

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
