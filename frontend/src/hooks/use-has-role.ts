import { useUser } from '@app/simple-api-state/use-user';
import { Role } from '@app/types/bruker';

const useUserRoles = () => {
  const { data } = useUser();

  return data?.roller ?? [];
};

export const useHasAnyOfRoles = (roles?: Role[]) => {
  const userRoles = useUserRoles();

  if (typeof roles === 'undefined' || roles.length === 0) {
    return true;
  }

  if (userRoles.length === 0) {
    return false;
  }

  return roles.some((role) => userRoles.includes(role));
};
