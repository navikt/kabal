import { useUser } from '../simple-api-state/use-user';
import { Role } from '../types/bruker';

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

export const useIsLeader = (): boolean => {
  const userRoles = useUserRoles();

  if (userRoles.length === 0) {
    return false;
  }

  return userRoles.includes(Role.ROLE_KLAGE_LEDER) || userRoles.includes(Role.ROLE_KLAGE_FAGANSVARLIG);
};
