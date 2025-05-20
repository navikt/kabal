import { getIsRolAnswers, getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { useLazyIsTildelt } from '@app/hooks/oppgavebehandling/use-is-tildelt';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useLazyIsAssignedMedunderskriver, useLazyIsSentToMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useIsAssignedRol, useIsKrolUser, useIsRolUser, useIsSentToRol } from '@app/hooks/use-is-rol';
import { useLazyIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { CreatorRole, DocumentTypeEnum, type IDocument } from '@app/types/documents/documents';

export interface AttachmentAccess {
  /** Read the attachment */
  read: boolean;
  /** Write in the smart document content */
  write: boolean;
  /** Move the attachment to another parent document */
  move: boolean;
  /** Delete the attachment */
  remove: boolean;
  /** Rename the attachment */
  rename: boolean;
}

const READ_ONLY_ACCESS: AttachmentAccess = {
  read: true,
  write: false,
  move: false,
  remove: false,
  rename: false,
};

const FULL_ACCESS = (document: IDocument): AttachmentAccess => ({
  read: true,
  write: document.isSmartDokument, // Only smart documents can be edited.
  move:
    document.type === DocumentTypeEnum.UPLOADED ||
    document.type === DocumentTypeEnum.JOURNALFOERT ||
    getIsRolAnswers(document), // Only uploaded, journalførte and ROL answers attachments can be moved.
  remove: true,
  rename: document.type === DocumentTypeEnum.SMART || document.type === DocumentTypeEnum.UPLOADED, // Only smart and uploaded documents can be renamed.
});

type UseAttachmentAccess = (document: IDocument, parentDocument: IDocument | undefined) => AttachmentAccess;

type UseLazyAttachmentAccess = () => UseAttachmentAccess;

export const useLazyAttachmentAccess: UseLazyAttachmentAccess = () => {
  const isFeilregistrert = useIsFeilregistrert();
  const isKrolUser = useIsKrolUser();
  const isRolUser = useIsRolUser();
  const isAssignedRol = useIsAssignedRol();
  const isSentToRol = useIsSentToRol();
  const isSentToMedunderskriver = useLazyIsSentToMedunderskriver();
  const isMedunderskriver = useLazyIsAssignedMedunderskriver();
  const isCaseTildelt = useLazyIsTildelt();
  const isTildeltSaksbehandler = useLazyIsTildeltSaksbehandler();

  return (document, parentDocument) => {
    if (parentDocument === undefined) {
      return READ_ONLY_ACCESS; // No parent document means no access to attachments.
    }

    return getAttachmentAccess(document, parentDocument, {
      isFeilregistrert,
      isKrolUser,
      isRolUser,
      isAssignedRol,
      isSentToRol,
      isSentToMedunderskriver,
      isMedunderskriver,
      isCaseTildelt,
      isTildeltSaksbehandler,
    });
  };
};

export const useAttachmentAccess: UseAttachmentAccess = (document, parentDocument) => {
  const getAttachmentAccess = useLazyAttachmentAccess();

  return getAttachmentAccess(document, parentDocument);
};

interface AttachmentAccessParams {
  isFeilregistrert: boolean;
  isKrolUser: boolean;
  isRolUser: boolean;
  isAssignedRol: boolean;
  isSentToRol: boolean;
  isSentToMedunderskriver: () => boolean;
  isMedunderskriver: () => boolean;
  isCaseTildelt: () => boolean;
  isTildeltSaksbehandler: () => boolean;
}

export const getAttachmentAccess = (
  document: IDocument,
  parentDocument: IDocument,
  params: AttachmentAccessParams,
): AttachmentAccess => {
  const {
    isFeilregistrert,
    isKrolUser,
    isRolUser,
    isAssignedRol,
    isSentToRol,
    isSentToMedunderskriver,
    isMedunderskriver,
    isCaseTildelt,
    isTildeltSaksbehandler,
  } = params;

  if (isFeilregistrert || isKrolUser || parentDocument.isMarkertAvsluttet) {
    // Everyone has read-only access to documents in feilregistrert cases.
    // KROL users always have read-only access to documents.
    // Everyone has read-only access to documents that are marked as avsluttet.
    return READ_ONLY_ACCESS;
  }

  // ROL answers documents.
  if (getIsRolAnswers(document)) {
    if (isAssignedRol && isSentToRol) {
      // ROL has full control over ROL answers documents.
      // ROL can never upload attachments.
      // ROL can never rename documents.
      return {
        read: true, // Everyone can read ROL answers documents.
        write: true, // ROL is the only one who can write in ROL answers documents.
        move: true, // ROL can move ROL answers attachments between ROL questions documents.
        remove: true, // ROL is the only one who can remove ROL answers attachments.
        rename: false, // ROL cannot rename ROL answers documents.
      };
    }

    return READ_ONLY_ACCESS; // Other users have read-only access to ROL answers documents.
  }

  // Attachments to ROL questions documents, other than ROL answers.
  if (getIsRolQuestions(parentDocument)) {
    return getRolQuestionsAttachmentAccess(document, params);
  }

  // The only document type that ROL users may have access to is ROL answers and other attachments to ROL questions.
  if (isRolUser) {
    return READ_ONLY_ACCESS; // ROL users have read-only access to documents, unless they are assigned and the case is sent to ROL.
  }

  if (document.type === DocumentTypeEnum.UPLOADED) {
    // Uploaded documents are accessible to all users.
    return FULL_ACCESS(document);
  }

  if (isSentToMedunderskriver()) {
    if (isMedunderskriver()) {
      // Medunderskriver has read and write access to all non-ROL documents.
      return {
        read: true,
        write: true,
        move: false, // Medunderskriver cannot move attachments.
        remove: false,
        rename: false,
      };
    }

    return READ_ONLY_ACCESS; // No one else has access to documents when the case is sent to medunderskriver.
  }

  if (document.type === DocumentTypeEnum.JOURNALFOERT) {
    if (
      document.creator.creatorRole === CreatorRole.KABAL_SAKSBEHANDLING ||
      document.creator.creatorRole === CreatorRole.KABAL_MEDUNDERSKRIVER // Medunderskriver is no longer allowed to create journalfoert attachments to ROL questions.
    ) {
      // Journalfoert documents created by saksbehandler or merkantil are accessible to the assigned saksbehandler.
      if (isTildeltSaksbehandler()) {
        return FULL_ACCESS(document);
      }

      return READ_ONLY_ACCESS;
    }

    if (document.creator.creatorRole === CreatorRole.KABAL_ROL) {
      // Journalfoert documents created by medunderskriver are accessible to the assigned saksbehandler.
      if (isAssignedRol && isSentToRol) {
        return FULL_ACCESS(document);
      }

      return READ_ONLY_ACCESS;
    }

    return READ_ONLY_ACCESS;
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

const getRolQuestionsAttachmentAccess = (
  document: IDocument,
  { isSentToRol, isAssignedRol, isTildeltSaksbehandler, isCaseTildelt }: AttachmentAccessParams,
): AttachmentAccess => {
  const { creatorRole } = document.creator;

  if (creatorRole === CreatorRole.KABAL_ROL) {
    if (isAssignedRol && isSentToRol) {
      // ROL has full control over ROL questions attachments added by ROL users.
      return {
        read: true, // Everyone can read attachments to ROL questions documents.
        write: true, // ROL has write access to attachments to ROL questions documents. Only ROL answers are editable, but if there were other attachments, ROL would have write access to them.
        move: document.type === DocumentTypeEnum.JOURNALFOERT || getIsRolAnswers(document), // ROL can move ROL questions attachments added by ROL users.
        remove: true, // ROL can remove attachments to the ROL questions document added by ROL users.
        rename: true, // ROL can rename attachments to ROL questions documents. None are possible to rename, but if they were, ROL would have access.
      };
    }

    return READ_ONLY_ACCESS; // Other users have read-only access to attachments to ROL questions documents added by ROL users.
  }

  // If the attachment was added by a saksbehandler or medunderskriver, only they have access to it.
  if (creatorRole === CreatorRole.KABAL_SAKSBEHANDLING || creatorRole === CreatorRole.KABAL_MEDUNDERSKRIVER) {
    // Saksbehandler has full access to attachments to ROL questions attachments added by saksbehandler or medunderskriver.
    // Medunderskriver is no longer allowed to add attachments to ROL questions documents. This is here to handle existing documents.
    return isTildeltSaksbehandler() && !isSentToRol ? FULL_ACCESS(document) : READ_ONLY_ACCESS;
  }

  if (document.type === DocumentTypeEnum.UPLOADED) {
    // Uploaded documents in ROL questions are accessible to all users.
    // It is no longer possible to upload attachments to ROL questions documents. This is here to handle existing documents.
    return (isAssignedRol && isSentToRol) || isTildeltSaksbehandler() ? FULL_ACCESS(document) : READ_ONLY_ACCESS;
  }

  // All other non-uploaded attachments with creatorRole === CreatorRole.NONE.
  // This is not supposed to happen, but if it does, someone must have access.

  if (isAssignedRol) {
    return isSentToRol ? FULL_ACCESS(document) : READ_ONLY_ACCESS; // ROL has full access when the case is sent to ROL.
  }

  if (isSentToRol) {
    return READ_ONLY_ACCESS; // Other users have read-only access when the case is sent to ROL.
  }

  if (!isCaseTildelt()) {
    // If the case is not assigned, everyone has full access to attachments to ROL questions documents.
    return FULL_ACCESS(document);
  }

  if (isTildeltSaksbehandler()) {
    // If the case is assigned to a saksbehandler, only the assigned saksbehandler has full access to attachments to ROL questions documents.
    // As long as the case is not sent to ROL.
    return FULL_ACCESS(document);
  }

  return READ_ONLY_ACCESS; // In all other cases, everyone has read-only access to attachments to ROL questions documents.
};
