import { isNotNull } from '@app/functions/is-not-type-guards';
import { DuaActionEnum, FINISHED_ERROR } from '@app/hooks/dua-access/access';
import type { DuaAccessMap } from '@app/hooks/dua-access/access-map';
import { type DuaDocumentAccessDocument, getDocumentAccess } from '@app/hooks/dua-access/document/access';
import { useLazyIsTildelt } from '@app/hooks/oppgavebehandling/use-is-tildelt';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useLazyIsAssignedMedunderskriver, useLazyIsSentToMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useIsAssignedRol, useIsRolUser, useIsSentToRol, useLazyIsReturnedFromRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler, useLazyIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useLazyAttachments } from '@app/hooks/use-parent-document';

type ValidateDocumentAccessFn = (document: DuaDocumentAccessDocument, action: DuaActionEnum) => string | null;

export const useLazyDocumentAccess = (): ValidateDocumentAccessFn => {
  const isCaseFinished = useIsFullfoert();
  const isCaseFeilregistrert = useIsFeilregistrert();
  const isSaksbehandlerUser = useIsSaksbehandler();
  const isRolUser = useIsRolUser();
  const isAssignedRol = useIsAssignedRol();
  const isSentToRol = useIsSentToRol();
  const isReturnedFromRol = useLazyIsReturnedFromRol();
  const isSentToMedunderskriver = useLazyIsSentToMedunderskriver();
  const isMedunderskriver = useLazyIsAssignedMedunderskriver();
  const isCaseTildelt = useLazyIsTildelt();
  const isTildeltSaksbehandler = useLazyIsTildeltSaksbehandler();
  const getAttachments = useLazyAttachments();

  return (document, action) => {
    if (isCaseFeilregistrert) {
      return 'Feilregistrert sak har ikke tilgang til dokumenter';
    }

    if (document.isMarkertAvsluttet) {
      return FINISHED_ERROR;
    }

    return getDocumentAccess(
      document,
      getAttachments,
      {
        isCaseFinished,
        isRolUser,
        isAssignedRol,
        isSentToRol,
        isReturnedFromRol,
        isSentToMedunderskriver,
        isMedunderskriver,
        isCaseTildelt,
        isTildeltSaksbehandler,
        isSaksbehandlerUser,
      },
      action,
    );
  };
};

export const useDocumentAccess = (document: DuaDocumentAccessDocument, action: DuaActionEnum): string | null => {
  const getDocumentAccess = useLazyDocumentAccess();

  return getDocumentAccess(document, action);
};

export const useDOcumentAccessList = (document: DuaDocumentAccessDocument, ...actions: DuaActionEnum[]): string[] => {
  const getDocumentAccess = useLazyDocumentAccess();

  return actions.map((action) => getDocumentAccess(document, action)).filter(isNotNull);
};

export const useDocumentAccessPartialMap = (
  document: DuaDocumentAccessDocument,
  ...actions: DuaActionEnum[]
): DuaAccessMap => {
  const getDocumentAccess = useLazyDocumentAccess();

  const accessMap: DuaAccessMap = {
    [DuaActionEnum.CREATE]: null,
    [DuaActionEnum.WRITE]: null,
    [DuaActionEnum.RENAME]: null,
    [DuaActionEnum.CHANGE_TYPE]: null,
    [DuaActionEnum.REMOVE]: null,
    [DuaActionEnum.FINISH]: null,
  };

  for (const action of actions) {
    accessMap[action] = getDocumentAccess(document, action);
  }

  return accessMap;
};

export const useDocumentAccessMap = (document: DuaDocumentAccessDocument): DuaAccessMap => {
  const getDocumentAccess = useLazyDocumentAccess();

  const accessMap: DuaAccessMap = {
    [DuaActionEnum.CREATE]: getDocumentAccess(document, DuaActionEnum.CREATE),
    [DuaActionEnum.WRITE]: getDocumentAccess(document, DuaActionEnum.WRITE),
    [DuaActionEnum.RENAME]: getDocumentAccess(document, DuaActionEnum.RENAME),
    [DuaActionEnum.CHANGE_TYPE]: getDocumentAccess(document, DuaActionEnum.CHANGE_TYPE),
    [DuaActionEnum.REMOVE]: getDocumentAccess(document, DuaActionEnum.REMOVE),
    [DuaActionEnum.FINISH]: getDocumentAccess(document, DuaActionEnum.FINISH),
  };

  return accessMap;
};
