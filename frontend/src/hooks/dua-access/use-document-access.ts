import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { useLazyIsTildelt } from '@app/hooks/oppgavebehandling/use-is-tildelt';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useLazyIsAssignedMedunderskriver, useLazyIsSentToMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import {
  useIsAssignedRol,
  useIsKrolUser,
  useIsRolUser,
  useIsSentToRol,
  useLazyIsReturnedFromRol,
} from '@app/hooks/use-is-rol';
import { useLazyIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { CreatorRole, DocumentTypeEnum, type IDocument } from '@app/types/documents/documents';

export enum FinishStateEnum {
  /** This document can be finished. */
  ALLOWED = 0,
  /** This document can only be finished by the assigned user. */
  NOT_ASSIGNED = 1,
  /** This document is marked as finished. No changes are allowed. */
  FINISHED = 2,
  /** This document requires that ROL return the case. */
  ROL_REQUIRED = 3,
  /** This document cannot be finished when the case is sent to medunderskriver. */
  SENT_TO_MU = 4,
  /** The case is feilregistrert. Documents cannot be finished. */
  FEILREGISTRERT = 5,
  /** This document cannot be finished by ROL and KROL users. */
  ROL_KROL = 6,
}

export enum ChangeTypeStateEnum {
  /** This document's type can be changed. */
  ALLOWED = 0,
  /** This document's type can only be changed by the assigned user. */
  NOT_ASSIGNED = 1,
  /** This document is marked as finished. No changes are allowed. */
  FINISHED = 2,
  /** This document is for ROL questions. No other type may be set. */
  ROL_QUESTIONS = 3,
  /** This document's type can not be changed as long as the case is sent to MU */
  SENT_TO_MU = 4,
  /** This document's type cannot be changed when the case is feilregistrert. */
  FEILREGISTRERT = 5,
  /** This document's type cannot be changed by ROL and KROL users. */
  ROL_KROL = 6,
}

export interface DocumentAccess {
  /** Read the document */
  read: boolean;
  /** Write to the document */
  write: boolean;
  /** Delete the document */
  remove: boolean;
  /** Change the document type */
  changeType: ChangeTypeStateEnum;
  /** Rename the document */
  rename: boolean;
  /** Finish the document (archive or send) */
  finish: FinishStateEnum;

  // Attachments

  /** Upload attachments */
  uploadAttachments: boolean;
  /** Refer to archived documents as attachments */
  referAttachments: boolean;
}

const NO_ACCESS: DocumentAccess = {
  read: false,
  write: false,
  remove: false,
  changeType: ChangeTypeStateEnum.NOT_ASSIGNED,
  rename: false,
  finish: FinishStateEnum.NOT_ASSIGNED,

  // Attachments
  uploadAttachments: false,
  referAttachments: false,
};

const READ_ONLY_ACCESS = (changeType: ChangeTypeStateEnum, finish: FinishStateEnum): DocumentAccess => ({
  read: true,
  write: false,
  remove: false,
  rename: false,
  changeType,
  finish,

  // Attachments
  uploadAttachments: false,
  referAttachments: false,
});

const FULL_ACCESS = (document: IDocument): DocumentAccess => ({
  read: true,
  write: document.isSmartDokument, // Only smart documents can be written to.
  remove: true,
  changeType: getChangeTypeState(document),
  rename: document.type === DocumentTypeEnum.SMART || document.type === DocumentTypeEnum.UPLOADED,
  finish: FinishStateEnum.ALLOWED,

  // Attachments
  uploadAttachments: document.type === DocumentTypeEnum.UPLOADED, // Only uploaded documents can have uploaded attachments.
  referAttachments: document.isSmartDokument, // Only smart documents can have archived attachments.
});

export const useLazyDocumentAccess = (): ((document: IDocument) => DocumentAccess) => {
  const isFeilregistrert = useIsFeilregistrert();
  const isKrolUser = useIsKrolUser();
  const isRolUser = useIsRolUser();
  const isAssignedRol = useIsAssignedRol();
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
      console.warn('useDocumentAccess should not be used for attachments. Use useAttachmentAccess instead.');

      return NO_ACCESS;
    }

    // Only ROL-questions check attachments.
    const attachments = getIsRolQuestions(document) ? data.filter((d) => d.parentId === document.id) : [];

    return getDocumentAccess(document, attachments, {
      isFeilregistrert,
      isKrolUser,
      isRolUser,
      isAssignedRol,
      isSentToRol,
      isReturnedFromRol,
      isSentToMedunderskriver,
      isMedunderskriver,
      isCaseTildelt,
      isTildeltSaksbehandler,
    });
  };
};

export const useDocumentAccess = (document: IDocument): DocumentAccess => {
  const getDocumentAccess = useLazyDocumentAccess();

  return getDocumentAccess(document);
};

export interface DocumentAccessParams {
  isFeilregistrert: boolean;
  isKrolUser: boolean;
  isRolUser: boolean;
  isAssignedRol: boolean;
  isSentToRol: boolean;
  isReturnedFromRol: () => boolean;
  isSentToMedunderskriver: () => boolean;
  isMedunderskriver: () => boolean;
  isCaseTildelt: () => boolean;
  isTildeltSaksbehandler: () => boolean;
}

export const getDocumentAccess = (
  document: IDocument,
  attachments: IDocument[],
  params: DocumentAccessParams,
): DocumentAccess => {
  const { isFeilregistrert, isKrolUser, isRolUser, isSentToMedunderskriver, isCaseTildelt, isTildeltSaksbehandler } =
    params;

  if (isFeilregistrert) {
    return READ_ONLY_ACCESS(ChangeTypeStateEnum.FEILREGISTRERT, FinishStateEnum.FEILREGISTRERT); // Everyone has read-only access to documents in feilregistrert cases.
  }

  if (document.isMarkertAvsluttet) {
    return READ_ONLY_ACCESS(ChangeTypeStateEnum.FINISHED, FinishStateEnum.FINISHED); // Everyone has read-only access to documents that are marked as avsluttet.
  }

  if (document.type === DocumentTypeEnum.UPLOADED) {
    return FULL_ACCESS(document); // Uploaded documents are accessible to all users.
  }

  // ROL questions documents.
  if (getIsRolQuestions(document)) {
    return getRolQuestionsDocumentAccess(attachments, params);
  }

  if (isRolUser || isKrolUser) {
    // ROL users have read-only access to documents, unless they are assigned and the case is sent to ROL.
    // The only document type that ROL users may have access to is the ROL answers attachment. Attachments are handled separately.
    // KROL users always have read-only access to documents.
    return READ_ONLY_ACCESS(ChangeTypeStateEnum.ROL_KROL, FinishStateEnum.ROL_KROL);
  }

  if (isSentToMedunderskriver()) {
    return getSentToMedunderskriverDocumentAccess(document, params.isMedunderskriver());
  }

  // Non-ROL documents in non-feilregistrert, non-medunderskriver cases.

  if (isTildeltSaksbehandler()) {
    return FULL_ACCESS(document); // Only the assigned saksbehandler has full access when the case is assigned.
  }

  if (isCaseTildelt()) {
    return READ_ONLY_ACCESS(ChangeTypeStateEnum.NOT_ASSIGNED, FinishStateEnum.NOT_ASSIGNED); // Everyone else has read-only access to documents.
  }

  // Non-ROL documents in non-feilregistrert, non-medunderskriver, non-assigned cases.
  return FULL_ACCESS(document);
};

const getRolQuestionsDocumentAccess = (
  attachments: IDocument[],
  {
    isSentToRol,
    isAssignedRol,
    isReturnedFromRol,
    isSentToMedunderskriver,
    isMedunderskriver,
    isTildeltSaksbehandler,
  }: DocumentAccessParams,
): DocumentAccess => {
  if (isSentToRol) {
    if (isAssignedRol) {
      return {
        read: true, // ROL can always read ROL questions documents.
        write: false, // ROL can never write in ROL questions documents.
        remove: false, // ROL can never remove ROL questions documents.
        changeType: ChangeTypeStateEnum.ROL_QUESTIONS,
        rename: false, // ROL questions documents cannot be renamed.
        finish: FinishStateEnum.ROL_KROL, // Only the assigned saksbehandler can finish ROL questions documents.
        // Attachments
        uploadAttachments: false, // ROL questions documents cannot have uploaded as attachments.
        referAttachments: true, // ROL can add archived attachments to ROL questions, when the case is sent to ROL.
      };
    }

    return READ_ONLY_ACCESS(ChangeTypeStateEnum.ROL_QUESTIONS, FinishStateEnum.ROL_REQUIRED); // ROL questions documents are read-only for everyone else when sent to ROL.
  }

  if (isSentToMedunderskriver()) {
    if (isMedunderskriver()) {
      return {
        read: true,
        write: true,
        uploadAttachments: false, // ROL questions documents cannot have uploaded as attachments.
        referAttachments: false, // Medunderskriver can never add archived attachments to ROL questions.
        remove: false, // Medunderskriver cannot remove ROL questions documents.
        changeType: ChangeTypeStateEnum.ROL_QUESTIONS, // ROL questions documents can never change type.
        rename: false, // ROL questions documents cannot be renamed.
        finish: FinishStateEnum.NOT_ASSIGNED, // Only the assigned saksbehandler can finish ROL questions documents.
      };
    }

    // No one else has access to ROL questions documents when sent to medunderskriver.
    // ROL question can never change type.
    return READ_ONLY_ACCESS(ChangeTypeStateEnum.ROL_QUESTIONS, FinishStateEnum.ROL_KROL);
  }

  if (isTildeltSaksbehandler()) {
    // The assigned saksbehandler has full access to ROL questions documents. When it is not sent to ROL or medunderskriver.
    return {
      read: true,
      write: true,
      uploadAttachments: false, // ROL questions documents cannot have uploaded as attachments.
      referAttachments: true, // Saksbehandler can add archived attachments to ROL questions, as long as the case is not sent to ROL.
      remove: attachments.every((a) => a.creator.creatorRole !== CreatorRole.KABAL_ROL), // ROL questions documents can only be removed by the assigned saksbehandler and only of there are no attachments owned by ROL.
      changeType: ChangeTypeStateEnum.ROL_QUESTIONS, // ROL questions documents cannot change type.
      rename: true, // Only the assigned saksbehandler can rename ROL questions documents.
      finish: isReturnedFromRol() ? FinishStateEnum.ALLOWED : FinishStateEnum.ROL_REQUIRED, // ROL questions documents can only be finished when the case is returned from ROL. Only by the assigned saksbehandler.
    };
  }

  return READ_ONLY_ACCESS(ChangeTypeStateEnum.ROL_QUESTIONS, FinishStateEnum.NOT_ASSIGNED); // Everyone else has read-only access to ROL questions documents.
};

const getSentToMedunderskriverDocumentAccess = (document: IDocument, isMedunderskriver: boolean): DocumentAccess => {
  if (isMedunderskriver) {
    if (getIsRolQuestions(document)) {
      return READ_ONLY_ACCESS(ChangeTypeStateEnum.SENT_TO_MU, FinishStateEnum.SENT_TO_MU); // Medunderskriver has read-only access to ROL questions documents.
    }

    // Medunderskriver has read and write access to all non-ROL documents.
    return {
      read: true,
      write: true,
      uploadAttachments: false,
      referAttachments: false,
      remove: false,
      changeType: ChangeTypeStateEnum.SENT_TO_MU, // Medunderskriver cannot change type of documents.
      rename: false,
      finish: FinishStateEnum.SENT_TO_MU, // No documents can be finished when the case is sent to medunderskriver.
    };
  }

  return READ_ONLY_ACCESS(ChangeTypeStateEnum.SENT_TO_MU, FinishStateEnum.SENT_TO_MU); // No one else has access to documents when the case is sent to medunderskriver.
};

const getChangeTypeState = (document: IDocument): ChangeTypeStateEnum => {
  if (document.isMarkertAvsluttet) {
    return ChangeTypeStateEnum.FINISHED; // Cannot change type of finished documents.
  }

  if (document.type === DocumentTypeEnum.SMART || document.type === DocumentTypeEnum.UPLOADED) {
    return ChangeTypeStateEnum.ALLOWED; // Can change type of smart or uploaded documents.
  }

  return ChangeTypeStateEnum.NOT_ASSIGNED; // Cannot change type of other documents.
};
