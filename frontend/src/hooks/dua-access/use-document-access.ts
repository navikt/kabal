import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { DocumentAccessEnum } from '@app/hooks/dua-access/document-access';
import { useLazyIsTildelt } from '@app/hooks/oppgavebehandling/use-is-tildelt';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useLazyIsAssignedMedunderskriver, useLazyIsSentToMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useIsAssignedRol, useIsRolUser, useIsSentToRol, useLazyIsReturnedFromRol } from '@app/hooks/use-is-rol';
import { useLazyIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import {
  CreatorRole,
  DocumentTypeEnum,
  type IAttachmentDocument,
  type IDocument,
} from '@app/types/documents/documents';

export interface DocumentAccess {
  /** Read the document */
  read: boolean;
  /** Write to the document */
  write: DocumentAccessEnum;
  /** Delete the document */
  remove: DocumentAccessEnum;
  /** Change the document type */
  changeType: DocumentAccessEnum;
  /** Rename the document */
  rename: DocumentAccessEnum;
  /** Finish the document (archive or send) */
  finish: DocumentAccessEnum;

  // Attachments

  /** Upload attachments */
  uploadAttachments: DocumentAccessEnum;
  /** Refer to archived documents as attachments */
  referAttachments: DocumentAccessEnum;
}

export const useLazyDocumentAccess = (): ((document: IDocument) => DocumentAccess) => {
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();
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

      const isRolQuestions = getIsRolQuestions(document);

      return {
        read: true,
        write: getWriteAccess(document, DocumentAccessEnum.NOT_ASSIGNED),
        remove: DocumentAccessEnum.NOT_ASSIGNED,
        changeType: isRolQuestions ? DocumentAccessEnum.NOT_SUPPORTED : DocumentAccessEnum.NOT_ASSIGNED,
        rename: isRolQuestions ? DocumentAccessEnum.NOT_SUPPORTED : DocumentAccessEnum.NOT_ASSIGNED,
        finish: DocumentAccessEnum.NOT_ASSIGNED,

        // Attachments
        uploadAttachments: getUploadAccess(document, DocumentAccessEnum.NOT_ASSIGNED),
        referAttachments: getReferAttachmentsAccess(document, DocumentAccessEnum.NOT_ASSIGNED),
      };
    }

    // Only ROL-questions check attachments.
    const attachments = getIsRolQuestions(document)
      ? data.filter((d): d is IAttachmentDocument => d.parentId === document.id)
      : [];

    return getDocumentAccess(document, attachments, {
      isFinished,
      isFeilregistrert,
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
  isFinished: boolean;
  isFeilregistrert: boolean;
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
  attachments: IAttachmentDocument[],
  params: DocumentAccessParams,
): DocumentAccess => {
  const { isFinished, isFeilregistrert, isRolUser, isSentToMedunderskriver, isCaseTildelt, isTildeltSaksbehandler } =
    params;

  if (isFinished) {
    // Everyone has full access to documents in finished cases.
    return {
      read: true,
      write: getWriteAccess(document, DocumentAccessEnum.ALLOWED),
      remove: DocumentAccessEnum.ALLOWED,
      changeType: getChangeTypeAccess(document, DocumentAccessEnum.ALLOWED),
      rename: getRenameAccess(document, DocumentAccessEnum.ALLOWED),
      finish: DocumentAccessEnum.ALLOWED,
      uploadAttachments: getUploadAccess(document, DocumentAccessEnum.ALLOWED),
      referAttachments: getReferAttachmentsAccess(document, DocumentAccessEnum.ALLOWED),
    };
  }

  if (isFeilregistrert) {
    // Everyone has read-only access to documents in feilregistrert cases.
    return {
      read: true,
      write: getWriteAccess(document, DocumentAccessEnum.CASE_FEILREGISTRERT),
      remove: DocumentAccessEnum.CASE_FEILREGISTRERT,
      changeType: getChangeTypeAccess(document, DocumentAccessEnum.CASE_FEILREGISTRERT),
      rename: DocumentAccessEnum.CASE_FEILREGISTRERT,
      finish: DocumentAccessEnum.CASE_FEILREGISTRERT,
      uploadAttachments: getUploadAccess(document, DocumentAccessEnum.CASE_FEILREGISTRERT),
      referAttachments: DocumentAccessEnum.CASE_FEILREGISTRERT,
    };
  }

  if (document.isMarkertAvsluttet) {
    // Everyone has read-only access to documents that are marked as avsluttet.
    return {
      read: true,
      write: getWriteAccess(document, DocumentAccessEnum.DOCUMENT_FINISHED),
      remove: DocumentAccessEnum.DOCUMENT_FINISHED,
      changeType: getChangeTypeAccess(document, DocumentAccessEnum.DOCUMENT_FINISHED),
      rename: DocumentAccessEnum.DOCUMENT_FINISHED,
      finish: DocumentAccessEnum.DOCUMENT_FINISHED,
      uploadAttachments: getUploadAccess(document, DocumentAccessEnum.DOCUMENT_FINISHED),
      referAttachments: DocumentAccessEnum.DOCUMENT_FINISHED,
    };
  }

  if (document.type === DocumentTypeEnum.UPLOADED) {
    // Uploaded documents are accessible to all users.
    return {
      read: true,
      write: DocumentAccessEnum.NOT_SUPPORTED,
      remove: DocumentAccessEnum.ALLOWED,
      changeType: DocumentAccessEnum.ALLOWED,
      rename: DocumentAccessEnum.ALLOWED,
      finish: DocumentAccessEnum.ALLOWED,
      uploadAttachments: DocumentAccessEnum.ALLOWED,
      referAttachments: DocumentAccessEnum.NOT_SUPPORTED, // Uploaded documents cannot have archived attachments.
    };
  }

  // ROL questions documents.
  if (getIsRolQuestions(document)) {
    return getRolQuestionsDocumentAccess(attachments, params);
  }

  // Handle all non-ROL-questions documents.
  // ROL has access to attachments to ROL questions documents, but not to other document types.
  if (isRolUser) {
    // ROL users have read-only access to documents, unless they are assigned and the case is sent to ROL.
    // The only document type that ROL users may have access to is the ROL answers attachment. Attachments are handled separately.
    return {
      read: true,
      write: getWriteAccess(document, DocumentAccessEnum.ROL_USER),
      remove: DocumentAccessEnum.ROL_USER,
      changeType: getChangeTypeAccess(document, DocumentAccessEnum.ROL_USER),
      rename: DocumentAccessEnum.ROL_USER,
      finish: DocumentAccessEnum.ROL_USER,
      uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
      referAttachments: getReferAttachmentsAccess(document, DocumentAccessEnum.ROL_USER),
    };
  }

  if (isSentToMedunderskriver()) {
    return getSentToMedunderskriverDocumentAccess(document, params);
  }

  // Non-ROL documents in non-feilregistrert, non-medunderskriver cases.

  if (isTildeltSaksbehandler()) {
    // Only the assigned saksbehandler has full access when the case is assigned.
    return {
      read: true,
      write: getWriteAccess(document, DocumentAccessEnum.ALLOWED),
      remove: DocumentAccessEnum.ALLOWED,
      changeType: getChangeTypeAccess(document, DocumentAccessEnum.ALLOWED),
      rename: DocumentAccessEnum.ALLOWED,
      finish: DocumentAccessEnum.ALLOWED,
      uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
      referAttachments: getReferAttachmentsAccess(document, DocumentAccessEnum.ALLOWED),
    };
  }

  if (isCaseTildelt()) {
    // Everyone else has read-only access to documents.
    return {
      read: true,
      write: getWriteAccess(document, DocumentAccessEnum.NOT_ASSIGNED),
      remove: DocumentAccessEnum.NOT_ASSIGNED,
      changeType: getChangeTypeAccess(document, DocumentAccessEnum.NOT_ASSIGNED),
      rename: DocumentAccessEnum.NOT_ASSIGNED,
      finish: DocumentAccessEnum.NOT_ASSIGNED,
      uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
      referAttachments: getReferAttachmentsAccess(document, DocumentAccessEnum.NOT_ASSIGNED),
    };
  }

  // Non-ROL documents in non-feilregistrert, non-medunderskriver, non-assigned cases.
  return {
    read: true,
    write: getWriteAccess(document, DocumentAccessEnum.ALLOWED),
    remove: DocumentAccessEnum.ALLOWED,
    changeType: getChangeTypeAccess(document, DocumentAccessEnum.ALLOWED),
    rename: DocumentAccessEnum.ALLOWED,
    finish: DocumentAccessEnum.ALLOWED,
    uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED,
    referAttachments: getReferAttachmentsAccess(document, DocumentAccessEnum.ALLOWED),
  };
};

const ROL_QUESTIONS: Pick<DocumentAccess, 'read' | 'changeType' | 'uploadAttachments'> = {
  read: true,
  changeType: DocumentAccessEnum.NOT_SUPPORTED, // ROL questions documents cannot change type.
  uploadAttachments: DocumentAccessEnum.NOT_SUPPORTED, // ROL questions documents cannot have uploaded as attachments.
};

const getRolQuestionsDocumentAccess = (
  attachments: IAttachmentDocument[],
  {
    isRolUser,
    isSentToRol,
    isAssignedRol,
    isReturnedFromRol,
    isSentToMedunderskriver,
    isMedunderskriver,
    isTildeltSaksbehandler,
    isCaseTildelt,
  }: DocumentAccessParams,
): DocumentAccess => {
  if (isRolUser && !isAssignedRol) {
    return {
      ...ROL_QUESTIONS,
      write: DocumentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER,
      remove: DocumentAccessEnum.NOT_ASSIGNED,
      rename: DocumentAccessEnum.NOT_ASSIGNED,
      finish: DocumentAccessEnum.NOT_ASSIGNED,
      referAttachments: DocumentAccessEnum.NOT_ASSIGNED_ROL,
    };
  }

  if (isSentToRol) {
    if (isAssignedRol) {
      return {
        ...ROL_QUESTIONS,
        write: DocumentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER, // ROL can never write in ROL questions documents.
        remove: DocumentAccessEnum.NOT_ASSIGNED,
        rename: DocumentAccessEnum.NOT_ASSIGNED,
        finish: DocumentAccessEnum.NOT_ASSIGNED,
        referAttachments: DocumentAccessEnum.ALLOWED, // ROL can add archived attachments to ROL questions, when the case is sent to ROL.
      };
    }

    if (isTildeltSaksbehandler()) {
      // Assigned saksbehandler must retract the case from ROL or wait for ROL to return the case.
      return {
        ...ROL_QUESTIONS,
        write: DocumentAccessEnum.SENT_TO_ROL,
        remove: DocumentAccessEnum.SENT_TO_ROL,
        rename: DocumentAccessEnum.SENT_TO_ROL,
        finish: DocumentAccessEnum.ROL_REQUIRED,
        referAttachments: DocumentAccessEnum.SENT_TO_ROL,
      };
    }

    // Other users have read-only access to ROL questions documents when sent to ROL.
    return {
      ...ROL_QUESTIONS,
      write: DocumentAccessEnum.NOT_ASSIGNED_OR_ROL,
      remove: DocumentAccessEnum.NOT_ASSIGNED_OR_ROL,
      rename: DocumentAccessEnum.NOT_ASSIGNED_OR_ROL,
      finish: DocumentAccessEnum.NOT_ASSIGNED_OR_ROL,
      referAttachments: DocumentAccessEnum.NOT_ASSIGNED_OR_ROL,
    };
  }

  // Not sent to ROL

  if (isAssignedRol) {
    return {
      ...ROL_QUESTIONS,
      write: DocumentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER,
      remove: DocumentAccessEnum.NOT_ASSIGNED,
      rename: DocumentAccessEnum.NOT_ASSIGNED,
      finish: DocumentAccessEnum.NOT_ASSIGNED,
      referAttachments: DocumentAccessEnum.NOT_ASSIGNED,
    };
  }

  if (isSentToMedunderskriver()) {
    if (isMedunderskriver()) {
      return {
        ...ROL_QUESTIONS,
        write: DocumentAccessEnum.ALLOWED, // Medunderskriver can write in ROL questions documents.
        remove: DocumentAccessEnum.NOT_ASSIGNED, // Medunderskriver cannot remove ROL questions documents.
        rename: DocumentAccessEnum.NOT_ASSIGNED, // Only the assigned saksbehandler can rename ROL questions documents.
        finish: DocumentAccessEnum.NOT_ASSIGNED, // Only the assigned saksbehandler can finish ROL questions documents.
        referAttachments: DocumentAccessEnum.NOT_ASSIGNED, // Only the assigned saksbehandler can add archived attachments to ROL questions documents.
      };
    }

    // No one else has access to ROL questions documents when sent to medunderskriver.
    return {
      ...ROL_QUESTIONS,
      write: DocumentAccessEnum.NOT_ASSIGNED,
      remove: DocumentAccessEnum.NOT_ASSIGNED,
      rename: DocumentAccessEnum.NOT_ASSIGNED,
      finish: DocumentAccessEnum.NOT_ASSIGNED,
      referAttachments: DocumentAccessEnum.NOT_ASSIGNED,
    };
  }

  if (isTildeltSaksbehandler()) {
    // The assigned saksbehandler has full access to ROL questions documents. When it is not sent to ROL or medunderskriver.
    return {
      ...ROL_QUESTIONS,
      write: DocumentAccessEnum.ALLOWED, // The assigned saksbehandler can write in ROL questions documents.
      remove: getRemoveRolQuestionsAccess(attachments, DocumentAccessEnum.ALLOWED),
      rename: DocumentAccessEnum.ALLOWED, // Only the assigned saksbehandler can rename ROL questions documents.
      finish: getFinishRolQuestionsAccess(isReturnedFromRol, DocumentAccessEnum.ALLOWED), // ROL questions documents can only be finished when the case is returned from ROL. Only by the assigned saksbehandler.
      referAttachments: DocumentAccessEnum.ALLOWED, // Saksbehandler can add archived attachments to ROL questions, as long as the case is not sent to ROL.
    };
  }

  if (isCaseTildelt()) {
    // Everyone else has read-only access to ROL questions documents.
    return {
      ...ROL_QUESTIONS,
      write: DocumentAccessEnum.NOT_ASSIGNED,
      remove: getRemoveRolQuestionsAccess(attachments, DocumentAccessEnum.NOT_ASSIGNED),
      rename: DocumentAccessEnum.NOT_ASSIGNED,
      finish: getFinishRolQuestionsAccess(isReturnedFromRol, DocumentAccessEnum.NOT_ASSIGNED),
      referAttachments: DocumentAccessEnum.NOT_ASSIGNED,
    };
  }

  return {
    ...ROL_QUESTIONS,
    write: DocumentAccessEnum.ALLOWED,
    remove: getRemoveRolQuestionsAccess(attachments, DocumentAccessEnum.ALLOWED),
    rename: DocumentAccessEnum.ALLOWED,
    finish: getFinishRolQuestionsAccess(isReturnedFromRol, DocumentAccessEnum.ALLOWED),
    referAttachments: DocumentAccessEnum.ALLOWED,
  };
};

// ROL questions documents can only be removed if there are no attachments owned by ROL.
const getRemoveRolQuestionsAccess = (
  attachments: IAttachmentDocument[],
  supported: DocumentAccessEnum,
): DocumentAccessEnum =>
  attachments.every((a) => a.creator.creatorRole !== CreatorRole.KABAL_ROL)
    ? supported
    : DocumentAccessEnum.HAS_ROL_ATTACHMENTS;

const getFinishRolQuestionsAccess = (
  isReturnedFromRol: () => boolean,
  supported: DocumentAccessEnum,
): DocumentAccessEnum => (isReturnedFromRol() ? supported : DocumentAccessEnum.ROL_REQUIRED);

const getSentToMedunderskriverDocumentAccess = (
  document: IDocument,
  { isMedunderskriver }: DocumentAccessParams,
): DocumentAccess => {
  // ROL-questions documents are handled separately, so we don't need to check for ROL-questions here.

  if (isMedunderskriver()) {
    // Medunderskriver has read and write access to all non-ROL documents.
    return {
      read: true,
      write: getWriteAccess(document, DocumentAccessEnum.ALLOWED), // Tilsendt medunderskriver can write in documents.
      remove: DocumentAccessEnum.NOT_ASSIGNED, // Tilsendt medunderskriver cannot remove documents.
      changeType: DocumentAccessEnum.NOT_ASSIGNED, // Tilsendt medunderskriver cannot change type of documents.
      rename: DocumentAccessEnum.NOT_ASSIGNED, // Tilsendt medunderskriver cannot rename documents.
      finish: DocumentAccessEnum.NOT_ASSIGNED, // Medunderskriver cannot finish documents.
      uploadAttachments: getUploadAccess(document, DocumentAccessEnum.ALLOWED), // Everyone can upload attachments to uploaded documents.
      referAttachments: DocumentAccessEnum.NOT_ASSIGNED, // Medunderskriver cannot add archived attachments to documents.
    };
  }

  // No one else has access to documents when the case is sent to medunderskriver.
  return {
    read: true,
    write: getWriteAccess(document, DocumentAccessEnum.SENT_TO_MU),
    remove: DocumentAccessEnum.SENT_TO_MU,
    changeType: DocumentAccessEnum.SENT_TO_MU,
    rename: DocumentAccessEnum.SENT_TO_MU,
    finish: DocumentAccessEnum.SENT_TO_MU,
    uploadAttachments: getUploadAccess(document, DocumentAccessEnum.ALLOWED),
    referAttachments: DocumentAccessEnum.SENT_TO_MU,
  };
};

// Only smart and uploaded documents can change type.
const getChangeTypeAccess = (document: IDocument, supported: DocumentAccessEnum): DocumentAccessEnum =>
  (document.type === DocumentTypeEnum.SMART || document.type === DocumentTypeEnum.UPLOADED) &&
  !getIsRolQuestions(document)
    ? supported
    : DocumentAccessEnum.NOT_SUPPORTED;

// Only smart documents can be written to.
const getWriteAccess = (document: IDocument, supported: DocumentAccessEnum): DocumentAccessEnum =>
  document.isSmartDokument ? supported : DocumentAccessEnum.NOT_SUPPORTED;

// Journalførte documents cannot be renamed.
const getRenameAccess = (document: IDocument, supported: DocumentAccessEnum): DocumentAccessEnum =>
  document.type === DocumentTypeEnum.JOURNALFOERT ? DocumentAccessEnum.NOT_SUPPORTED : supported;

// Only uploaded documents support uploaded attachments.
const getUploadAccess = (document: IDocument, supported: DocumentAccessEnum): DocumentAccessEnum =>
  document.type === DocumentTypeEnum.UPLOADED ? supported : DocumentAccessEnum.NOT_SUPPORTED;

// Only smart documents can have archived attachments.
const getReferAttachmentsAccess = (document: IDocument, supported: DocumentAccessEnum): DocumentAccessEnum =>
  document.isSmartDokument ? supported : DocumentAccessEnum.NOT_SUPPORTED;
