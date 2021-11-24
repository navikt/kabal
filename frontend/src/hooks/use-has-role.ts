import { Role, useGetBrukerQuery } from '../redux-api/bruker';

export const useUserRoles = () => {
  const { data } = useGetBrukerQuery();
  return data?.roller ?? [];
};

export const useHasRole = (role: Role): boolean => {
  const userRoles = useUserRoles();
  return userRoles.includes(role);
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

export const useHasAllOfRoles = (roles: Role[]) => {
  const userRoles = useUserRoles();

  if (roles.length === 0) {
    return true;
  }

  if (userRoles.length === 0) {
    return false;
  }

  return roles.every((role) => userRoles.includes(role));
};

export const useIsLeaderOrAdmin = (): boolean => {
  const userRoles = useUserRoles();

  if (userRoles.length === 0) {
    return false;
  }

  return userRoles.includes(Role.ROLE_KLAGE_LEDER) || userRoles.includes(Role.ROLE_ADMIN);
};
