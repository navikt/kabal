import { DuaActionEnum } from '@app/hooks/dua-access/access';
import type { DuaAccessMap } from '@app/hooks/dua-access/access-map';
import { type AttachmentAccessDocument, getAttachmentAccess } from '@app/hooks/dua-access/attachment/access';
import { useLazyIsTildelt } from '@app/hooks/oppgavebehandling/use-is-tildelt';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useLazyIsAssignedMedunderskriver, useLazyIsSentToMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useIsAssignedRol, useIsRolUser, useIsSentToRol, useLazyIsReturnedFromRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler, useLazyIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import type { IParentDocument } from '@app/types/documents/documents';

type UseAttachmentAccess = (
  attachment: AttachmentAccessDocument,
  parentDocument: IParentDocument | undefined,
  action: DuaActionEnum,
) => string | null;

type UseAttachmentAccessList = (
  attachment: AttachmentAccessDocument,
  parentDocument: IParentDocument,
  action: DuaActionEnum,
  ...actions: DuaActionEnum[]
) => DuaAccessMap;

type GetAttachmentAccess = (
  actions: DuaActionEnum,
  attachment: AttachmentAccessDocument,
  parentDocument: IParentDocument | undefined,
) => string | null;

type UseLazyAttachmentAccess = () => GetAttachmentAccess;

export const useLazyAttachmentAccess: UseLazyAttachmentAccess = () => {
  const isCaseFinished = useIsFullfoert();
  const isCaseFeilregistrert = useIsFeilregistrert();
  const isRolUser = useIsRolUser();
  const isAssignedRol = useIsAssignedRol();
  const isSentToRol = useIsSentToRol();
  const isSentToMedunderskriver = useLazyIsSentToMedunderskriver();
  const isMedunderskriver = useLazyIsAssignedMedunderskriver();
  const isCaseTildelt = useLazyIsTildelt();
  const isTildeltSaksbehandler = useLazyIsTildeltSaksbehandler();
  const isSaksbehandlerUser = useIsSaksbehandler();
  const isReturnedFromRol = useLazyIsReturnedFromRol();

  return (action, attachment, parentDocument) => {
    if (isCaseFeilregistrert) {
      return 'Feilregistrert sak har ikke tilgang til dokumenter';
    }

    if (parentDocument === undefined) {
      return 'Ukjent hoveddokument';
    }

    return getAttachmentAccess(
      attachment,
      parentDocument,
      {
        isCaseFinished,
        isRolUser,
        isAssignedRol,
        isSentToRol,
        isSentToMedunderskriver,
        isMedunderskriver,
        isCaseTildelt,
        isTildeltSaksbehandler,
        isReturnedFromRol,
        isSaksbehandlerUser,
      },
      action,
    );
  };
};

export const useAttachmentAccess: UseAttachmentAccess = (document, parentDocument, action) => {
  const getAttachmentAccess = useLazyAttachmentAccess();

  return getAttachmentAccess(action, document, parentDocument);
};

export const useLazyAttachmentAccessList = () => {
  const getAttachmentAccess = useLazyAttachmentAccess();

  return (
    attachment: AttachmentAccessDocument,
    parentDocument: IParentDocument | undefined,
    ...actions: DuaActionEnum[]
  ) => actions.map((action) => getAttachmentAccess(action, attachment, parentDocument));
};

export const useAttachmentAccessPartialMap: UseAttachmentAccessList = (document, parentDocument, ...actions) => {
  const getAttachmentAccess = useLazyAttachmentAccess();

  const accessMap: DuaAccessMap = {
    [DuaActionEnum.CREATE]: null,
    [DuaActionEnum.WRITE]: null,
    [DuaActionEnum.RENAME]: null,
    [DuaActionEnum.CHANGE_TYPE]: null,
    [DuaActionEnum.REMOVE]: null,
    [DuaActionEnum.FINISH]: null,
  };

  const enties = actions.map<[DuaActionEnum, string | null]>((action) => [
    action,
    getAttachmentAccess(action, document, parentDocument),
  ]);

  for (const [action, access] of enties) {
    accessMap[action] = access;
  }

  return accessMap;
};

export const useAttachmentAccessMap = (
  attachment: AttachmentAccessDocument,
  parentDocument: IParentDocument,
): DuaAccessMap => {
  const getAttachmentAccess = useLazyAttachmentAccess();

  return {
    [DuaActionEnum.CREATE]: getAttachmentAccess(DuaActionEnum.CREATE, attachment, parentDocument),
    [DuaActionEnum.WRITE]: getAttachmentAccess(DuaActionEnum.WRITE, attachment, parentDocument),
    [DuaActionEnum.RENAME]: getAttachmentAccess(DuaActionEnum.RENAME, attachment, parentDocument),
    [DuaActionEnum.CHANGE_TYPE]: getAttachmentAccess(DuaActionEnum.CHANGE_TYPE, attachment, parentDocument),
    [DuaActionEnum.REMOVE]: getAttachmentAccess(DuaActionEnum.REMOVE, attachment, parentDocument),
    [DuaActionEnum.FINISH]: getAttachmentAccess(DuaActionEnum.FINISH, attachment, parentDocument),
  };
};
