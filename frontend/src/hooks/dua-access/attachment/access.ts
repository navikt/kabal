import { isNotNull } from '@app/functions/is-not-type-guards';
import {
  type DuaAccessCaseStatus,
  type DuaAccessCreator,
  type DuaAccessDocumentType,
  type DuaAccessParent,
  type DuaAccessUser,
  DuaActionEnum,
  getDuaAccessError,
} from '@app/hooks/dua-access/access';
import type { DuaAccessMap } from '@app/hooks/dua-access/access-map';
import { type DetermineParentDocumentType, getParentDocumentType } from '@app/hooks/dua-access/attachment/parent';
import { type DetermineDocumentType, getDocumentType } from '@app/hooks/dua-access/document/type';
import { getCaseStatus } from '@app/hooks/dua-access/shared/case-status';
import { CREATOR_ROLE_TO_DUA_ACCESS_CREATOR } from '@app/hooks/dua-access/shared/creator';
import type { DocumentAccessParams } from '@app/hooks/dua-access/shared/params';
import { getUser } from '@app/hooks/dua-access/shared/user';
import type { IAttachmentDocument } from '@app/types/documents/documents';

export type AttachmentAccessDocument = DetermineDocumentType & {
  creatorRole: IAttachmentDocument['creator']['creatorRole'];
};

export const getAttachmentAccess = (
  attachment: AttachmentAccessDocument,
  parentDocument: DetermineParentDocumentType,
  params: DocumentAccessParams,
  action: DuaActionEnum,
): string | null => {
  const {
    isCaseFinished,
    isRolUser,
    isSentToMedunderskriver,
    isCaseTildelt,
    isTildeltSaksbehandler,
    isSaksbehandlerUser,
    isAssignedRol,
    isSentToRol,
    isReturnedFromRol,
    isMedunderskriver,
  } = params;

  const user = getUser(
    isTildeltSaksbehandler,
    isSentToMedunderskriver,
    isMedunderskriver,
    isAssignedRol,
    isRolUser,
    isSaksbehandlerUser,
  );

  if (user === null) {
    return 'Ukjent bruker';
  }

  const caseStatus = getCaseStatus(
    isCaseFinished,
    isReturnedFromRol,
    isSentToRol,
    isSentToMedunderskriver,
    isCaseTildelt,
  );

  const parent = getParentDocumentType(parentDocument);

  if (parent === null) {
    return 'Ukjent type for dokument';
  }

  return getAttachmentAccessError(action, attachment, user, caseStatus, parent);
};

export const getAttachmentAccessError = (
  action: DuaActionEnum,
  attachment: AttachmentAccessDocument,
  user: DuaAccessUser,
  caseStatus: DuaAccessCaseStatus,
  parent: DuaAccessParent,
): string | null => {
  const attachmentType: DuaAccessDocumentType | null = getDocumentType(attachment);

  if (attachmentType === null) {
    return 'Ukjent type for vedlegg';
  }

  const creator: DuaAccessCreator = CREATOR_ROLE_TO_DUA_ACCESS_CREATOR[attachment.creatorRole];

  return getDuaAccessError(user, caseStatus, attachmentType, parent, creator, action);
};

export const getAttachmentAccessList = (
  attachment: AttachmentAccessDocument,
  parentDocument: DetermineParentDocumentType,
  params: DocumentAccessParams,
  ...actions: DuaActionEnum[]
): string[] =>
  actions.map((action) => getAttachmentAccess(attachment, parentDocument, params, action)).filter(isNotNull);

export const getAttachmentAccessMap = (
  attachment: AttachmentAccessDocument,
  parentDocument: DetermineParentDocumentType,
  params: DocumentAccessParams,
): DuaAccessMap => ({
  [DuaActionEnum.CREATE]: getAttachmentAccess(attachment, parentDocument, params, DuaActionEnum.CREATE),
  [DuaActionEnum.WRITE]: getAttachmentAccess(attachment, parentDocument, params, DuaActionEnum.WRITE),
  [DuaActionEnum.RENAME]: getAttachmentAccess(attachment, parentDocument, params, DuaActionEnum.RENAME),
  [DuaActionEnum.CHANGE_TYPE]: getAttachmentAccess(attachment, parentDocument, params, DuaActionEnum.CHANGE_TYPE),
  [DuaActionEnum.REMOVE]: getAttachmentAccess(attachment, parentDocument, params, DuaActionEnum.REMOVE),
  [DuaActionEnum.FINISH]: getAttachmentAccess(attachment, parentDocument, params, DuaActionEnum.FINISH),
});
