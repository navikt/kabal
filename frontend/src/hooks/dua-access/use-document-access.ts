import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { useLazyIsTildelt } from '@app/hooks/oppgavebehandling/use-is-tildelt';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useLazyIsAssignedMedunderskriver, useLazyIsSentToMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useIsKrolUser, useIsRolUser, useIsSentToRol, useLazyIsReturnedFromRol } from '@app/hooks/use-is-rol';
import { useLazyIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { CreatorRole, DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';

export enum FinishStateEnum {
  NOT_ALLOWED = 0,
  READY = 1,
  WAIT_FOR_ROL = 2,
  WAIT_FOR_MEDUNDERSKRIVER = 3,
}

export interface DocumentAccess {
  /** Read the document */
  read: boolean;
  /** Write to the document */
  write: boolean;
  /** Delete the document */
  remove: boolean;
  /** Change the document type */
  changeType: boolean;
  /** Rename the document */
  rename: boolean;
  /** Finish the document (archive or send) */
  finish: FinishStateEnum;

  // Attachments

  /** Upload attachments */
  upload: boolean;
  /** Refer to archived documents as attachments */
  refer: boolean;
}

const READ_ONLY_ACCESS: DocumentAccess = {
  read: true,
  write: false,
  remove: false,
  changeType: false,
  rename: false,
  finish: FinishStateEnum.NOT_ALLOWED,

  // Attachments
  upload: false,
  refer: false,
};

const FULL_ACCESS = (document: IMainDocument): DocumentAccess => ({
  read: true,
  write: true,
  remove: true,
  changeType: document.type === DocumentTypeEnum.SMART || document.type === DocumentTypeEnum.UPLOADED,
  rename: document.type === DocumentTypeEnum.SMART || document.type === DocumentTypeEnum.UPLOADED,
  finish: FinishStateEnum.READY,

  // Attachments
  upload: document.type === DocumentTypeEnum.UPLOADED,
  refer: document.isSmartDokument,
});

export const useLazyDocumentAccess = (): ((document: IMainDocument) => DocumentAccess) => {
  const isFeilregistrert = useIsFeilregistrert();
  const isKrolUser = useIsKrolUser();
  const isRolUser = useIsRolUser();
  const isSentToRol = useIsSentToRol();
  const isReturnedFromRol = useLazyIsReturnedFromRol();
  const isSentToMedunderskriver = useLazyIsSentToMedunderskriver();
  const isMedunderskriver = useLazyIsAssignedMedunderskriver();
  const isCaseTildelt = useLazyIsTildelt();
  const isTildeltSaksbehandler = useLazyIsTildeltSaksbehandler();
  const oppgaveId = useOppgaveId();
  const { data = [] } = useGetDocumentsQuery(oppgaveId);

  return (document) => {
    if (document.parentId !== null) {
      console.error('useDocumentAccess should not be used for attachments. Use useAttachmentAccess instead.');

      return READ_ONLY_ACCESS;
    }

    // Only ROL-questions check attachments.
    const attachments = getIsRolQuestions(document) ? data.filter((d) => d.parentId === document.id) : [];

    return getDocumentAccess(document, attachments, {
      isFeilregistrert,
      isKrolUser,
      isRolUser,
      isSentToRol,
      isReturnedFromRol,
      isSentToMedunderskriver,
      isMedunderskriver,
      isCaseTildelt,
      isTildeltSaksbehandler,
    });
  };
};

export const useDocumentAccess = (document: IMainDocument): DocumentAccess => {
  const getDocumentAccess = useLazyDocumentAccess();

  return getDocumentAccess(document);
};

export interface DocumentAccessParams {
  isFeilregistrert: boolean;
  isKrolUser: boolean;
  isRolUser: boolean;
  isSentToRol: boolean;
  isReturnedFromRol: () => boolean;
  isSentToMedunderskriver: () => boolean;
  isMedunderskriver: () => boolean;
  isCaseTildelt: () => boolean;
  isTildeltSaksbehandler: () => boolean;
}

export const getDocumentAccess = (
  document: IMainDocument,
  attachments: IMainDocument[],
  params: DocumentAccessParams,
): DocumentAccess => {
  const { isFeilregistrert, isKrolUser, isRolUser, isSentToMedunderskriver, isCaseTildelt, isTildeltSaksbehandler } =
    params;

  if (isFeilregistrert || isRolUser || isKrolUser || document.isMarkertAvsluttet) {
    // Everyone has read-only access to documents in feilregistrert cases.
    // ROL users have read-only access to documents, unless they are assigned and the case is sent to ROL.
    // The only document type that ROL users may have access to is the ROL answers attachment. Attachments are handled separately.
    // KROL users always have read-only access to documents.
    // Everyone has read-only access to documents that are marked as avsluttet.
    return READ_ONLY_ACCESS;
  }

  if (document.type === DocumentTypeEnum.UPLOADED) {
    // Uploaded documents are accessible to all users.
    return FULL_ACCESS(document);
  }

  // ROL questions documents.
  if (getIsRolQuestions(document)) {
    return getRolQuestionsDocumentAccess(attachments, params);
  }

  if (isSentToMedunderskriver()) {
    return getSentToMedunderskriverDocumentAccess(document, params.isMedunderskriver());
  }

  // Non-ROL documents in non-feilregistrert, non-medunderskriver cases.

  if (isTildeltSaksbehandler()) {
    return FULL_ACCESS(document); // Only the assigned saksbehandler has full access.
  }

  if (isCaseTildelt()) {
    return READ_ONLY_ACCESS; // Everyone else has read-only access to documents.
  }

  // Non-ROL documents in non-feilregistrert, non-medunderskriver, non-assigned cases.
  return FULL_ACCESS(document);
};

const getRolQuestionsDocumentAccess = (
  attachments: IMainDocument[],
  {
    isSentToRol,
    isReturnedFromRol,
    isSentToMedunderskriver,
    isMedunderskriver,
    isTildeltSaksbehandler,
  }: DocumentAccessParams,
): DocumentAccess => {
  // Only the assigned saksbehandler or sent medunderskriver has full access to ROL questions documents.
  if (isSentToRol) {
    return READ_ONLY_ACCESS;
  }

  if (isSentToMedunderskriver()) {
    if (isMedunderskriver()) {
      return {
        read: true,
        write: true,
        upload: false,
        refer: true,
        remove: false, // Medunderskriver cannot remove ROL questions documents.
        changeType: false,
        rename: false,
        finish: FinishStateEnum.NOT_ALLOWED, // Only the assigned saksbehandler can finish ROL questions documents.
      };
    }

    return READ_ONLY_ACCESS; // No one else has access to ROL questions documents when sent to medunderskriver.
  }

  if (isTildeltSaksbehandler()) {
    // The assigned saksbehandler has full access to ROL questions documents. When it is not sent to ROL or medunderskriver.
    return {
      read: true,
      write: true,
      upload: false,
      refer: true,
      remove: attachments.some((a) => a.creator.creatorRole === CreatorRole.KABAL_ROL),
      changeType: false,
      rename: false,
      finish: isReturnedFromRol() ? FinishStateEnum.READY : FinishStateEnum.WAIT_FOR_ROL,
    };
  }

  return READ_ONLY_ACCESS; // Everyone else has read-only access to ROL questions documents.
};

const getSentToMedunderskriverDocumentAccess = (
  document: IMainDocument,
  isMedunderskriver: boolean,
): DocumentAccess => {
  if (isMedunderskriver) {
    if (getIsRolQuestions(document)) {
      // Medunderskriver has read-only access to ROL questions documents.
      return READ_ONLY_ACCESS;
    }

    // Medunderskriver has read and write access to all non-ROL documents.
    return {
      read: true,
      write: true,
      upload: false,
      refer: false,
      remove: false,
      changeType: false,
      rename: false,
      finish: FinishStateEnum.WAIT_FOR_MEDUNDERSKRIVER, // No documents can be finished when the case is sent to medunderskriver.
    };
  }

  return READ_ONLY_ACCESS; // No one else has access to documents when the case is sent to medunderskriver.
};
