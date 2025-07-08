import { DuaAccessUser } from '@app/hooks/dua-access/access';

export const getUser = (
  isTildeltSaksbehandler: () => boolean,
  isSentToMedunderskriver: () => boolean,
  isMedunderskriver: () => boolean,
  isAssignedRol: boolean,
  isRolUser: boolean,
  isSaksbehandlerUser: boolean,
): DuaAccessUser | null => {
  if (isTildeltSaksbehandler()) {
    return DuaAccessUser.TILDELT_SAKSBEHANDLER;
  }

  if (isSentToMedunderskriver() && isMedunderskriver()) {
    return DuaAccessUser.TILDELT_MEDUNDERSKRIVER;
  }

  if (isAssignedRol) {
    return DuaAccessUser.TILDELT_ROL;
  }

  if (isRolUser) {
    return DuaAccessUser.ROL;
  }

  if (isSaksbehandlerUser) {
    return DuaAccessUser.SAKSBEHANDLER;
  }

  return null;
};
