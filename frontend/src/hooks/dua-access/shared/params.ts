export interface DocumentAccessParams {
  isCaseFinished: boolean;
  isRolUser: boolean;
  isAssignedRol: boolean;
  isSentToRol: boolean;
  isReturnedFromRol: () => boolean;
  isSentToMedunderskriver: () => boolean;
  isMedunderskriver: () => boolean;
  isCaseTildelt: () => boolean;
  isTildeltSaksbehandler: () => boolean;
  isSaksbehandlerUser: boolean;
}
