import { DuaAccessCaseStatus } from '@app/hooks/dua-access/access';

export const getCaseStatus = (
  isCaseFinished: boolean,
  isReturnedFromRol: () => boolean,
  isSentToRol: boolean,
  isSentToMedunderskriver: () => boolean,
  isCaseTildelt: () => boolean,
): DuaAccessCaseStatus => {
  if (isCaseFinished) {
    return DuaAccessCaseStatus.FULLFOERT;
  }

  if (isReturnedFromRol()) {
    return DuaAccessCaseStatus.RETURNED_FROM_ROL;
  }

  if (isSentToRol) {
    return DuaAccessCaseStatus.WITH_ROL;
  }

  if (isSentToMedunderskriver()) {
    return DuaAccessCaseStatus.WITH_MU;
  }

  return isCaseTildelt() ? DuaAccessCaseStatus.RETURNED_FROM_ROL : DuaAccessCaseStatus.LEDIG;
};
