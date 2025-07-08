import { isNotNull } from '@app/functions/is-not-type-guards';
import {
  type DuaAccessCreator,
  type DuaAccessDocumentType,
  DuaAccessParent,
  DuaActionEnum,
  getDuaAccessError,
} from '@app/hooks/dua-access/access';
import type { DuaAccessMap } from '@app/hooks/dua-access/access-map';
import { getAttachmentAccessError } from '@app/hooks/dua-access/attachment/access';
import { getParentDocumentType } from '@app/hooks/dua-access/attachment/parent';
import { getDocumentType } from '@app/hooks/dua-access/document/type';
import { getCaseStatus } from '@app/hooks/dua-access/shared/case-status';
import { CREATOR_ROLE_TO_DUA_ACCESS_CREATOR } from '@app/hooks/dua-access/shared/creator';
import type { DocumentAccessParams } from '@app/hooks/dua-access/shared/params';
import { getUser } from '@app/hooks/dua-access/shared/user';
import type { IAttachmentDocument, IParentDocument } from '@app/types/documents/documents';

export const getDocumentAccess = (
  document: IParentDocument,
  getAttachments: (parentId: string | null) => IAttachmentDocument[],
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

  const documentType: DuaAccessDocumentType | null = getDocumentType(document);

  if (documentType === null) {
    return `Ukjent type for dokument "${document.tittel}"`;
  }

  const caseStatus = getCaseStatus(
    isCaseFinished,
    isReturnedFromRol,
    isSentToRol,
    isSentToMedunderskriver,
    isCaseTildelt,
  );

  const creator: DuaAccessCreator = CREATOR_ROLE_TO_DUA_ACCESS_CREATOR[document.creator.creatorRole];

  const parent = DuaAccessParent.NONE;

  const documentAccess = getDuaAccessError(user, caseStatus, documentType, parent, creator, action);

  // If the action is not allowed for the document, return the error immediately.
  if (documentAccess !== null) {
    return documentAccess;
  }

  // If the action is to remove, we need to check attachments as well.
  // If the action is not to remove, we can return the document access immediately.
  // This is because attachments are only relevant for removal actions.
  if (action !== DuaActionEnum.REMOVE) {
    return documentAccess;
  }

  const attachmentParent: DuaAccessParent | null = getParentDocumentType(document);

  if (attachmentParent === null) {
    return `Ukjent type for dokument "${document.tittel}"`;
  }

  // Check attachments for the document.
  // If any attachment has an error, return that error.
  for (const attachment of getAttachments(document.parentId)) {
    const attachmentAccess = getAttachmentAccessError(action, attachment, user, caseStatus, attachmentParent);

    if (attachmentAccess !== null) {
      return attachmentAccess;
    }
  }

  // If no attachments have errors, return null.
  // This means the action is allowed for the document and its attachments.
  return null;
};

export const getDocumentAccessList = (
  document: IParentDocument,
  getAttachments: (parentId: string | null) => IAttachmentDocument[],
  params: DocumentAccessParams,
  ...actions: DuaActionEnum[]
): string[] => actions.map((action) => getDocumentAccess(document, getAttachments, params, action)).filter(isNotNull);

export const getDocumentAccessMap = (
  document: IParentDocument,
  getAttachments: (parentId: string | null) => IAttachmentDocument[],
  params: DocumentAccessParams,
): DuaAccessMap => ({
  [DuaActionEnum.CREATE]: getDocumentAccess(document, getAttachments, params, DuaActionEnum.CREATE),
  [DuaActionEnum.WRITE]: getDocumentAccess(document, getAttachments, params, DuaActionEnum.WRITE),
  [DuaActionEnum.RENAME]: getDocumentAccess(document, getAttachments, params, DuaActionEnum.RENAME),
  [DuaActionEnum.CHANGE_TYPE]: getDocumentAccess(document, getAttachments, params, DuaActionEnum.CHANGE_TYPE),
  [DuaActionEnum.REMOVE]: getDocumentAccess(document, getAttachments, params, DuaActionEnum.REMOVE),
  [DuaActionEnum.FINISH]: getDocumentAccess(document, getAttachments, params, DuaActionEnum.FINISH),
});
