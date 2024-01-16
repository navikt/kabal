import { useContext } from 'react';
import { UserContext } from '@app/components/app/user';
import { Role } from '@app/types/bruker';

export const useHasAnyOfRoles = (roles?: Role[]) => {
  const { roller } = useContext(UserContext);

  if (typeof roles === 'undefined' || roles.length === 0) {
    return true;
  }

  if (roller.length === 0) {
    return false;
  }

  return roles.some((role) => roller.includes(role));
};

export const useHasRole = (role: Role) => {
  const { roller } = useContext(UserContext);

  return roller.includes(role);
};
