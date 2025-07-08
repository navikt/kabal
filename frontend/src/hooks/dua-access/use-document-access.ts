import { DuaActionEnum, FINISHED_ERROR } from '@app/hooks/dua-access/access';
import type { DuaAccessMap } from '@app/hooks/dua-access/access-map';
import { getAttachmentAccess } from '@app/hooks/dua-access/attachment/access';
import { getDocumentAccess } from '@app/hooks/dua-access/document/access';
import { useLazyIsTildelt } from '@app/hooks/oppgavebehandling/use-is-tildelt';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useLazyIsAssignedMedunderskriver, useLazyIsSentToMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useIsAssignedRol, useIsRolUser, useIsSentToRol, useLazyIsReturnedFromRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler, useLazyIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useLazyAttachments, useLazyParentDocument } from '@app/hooks/use-parent-document';
import { type IDocument, type IParentDocument, isParentDocument } from '@app/types/documents/documents';

type ValidateDocumentAccessFn = (document: IDocument, action: DuaActionEnum) => string | null;

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
  const getParentDocument = useLazyParentDocument();

  return (document, action) => {
    if (isCaseFeilregistrert) {
      return 'Feilregistrert sak har ikke tilgang til dokumenter';
    }

    if (document.isMarkertAvsluttet) {
      return FINISHED_ERROR;
    }

    if (isParentDocument(document)) {
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
    }

    const parentDocument = getParentDocument(document.parentId);

    if (parentDocument === undefined) {
      return 'Ukjent hoveddokument';
    }

    return getAttachmentAccess(
      document,
      parentDocument,
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

export const useDocumentAccess = (document: IDocument, action: DuaActionEnum): string | null => {
  const getDocumentAccess = useLazyDocumentAccess();

  return getDocumentAccess(document, action);
};

export const useDocumentAccessMap = (document: IParentDocument): DuaAccessMap => {
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
