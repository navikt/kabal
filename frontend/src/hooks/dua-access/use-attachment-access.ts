import { getIsRolAnswers, getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { AttachmentAccessEnum } from '@app/hooks/dua-access/attachment-access';
import { useLazyIsTildelt } from '@app/hooks/oppgavebehandling/use-is-tildelt';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useLazyIsAssignedMedunderskriver, useLazyIsSentToMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useIsAssignedRol, useIsRolUser, useIsSentToRol } from '@app/hooks/use-is-rol';
import { useLazyIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import {
  CreatorRole,
  DocumentTypeEnum,
  type IAttachmentDocument,
  type IDocument,
} from '@app/types/documents/documents';

export interface AttachmentAccess {
  /** Read the attachment */
  read: boolean;
  /** Write in the smart document content */
  write: AttachmentAccessEnum;
  /** Move the attachment to another parent document */
  move: AttachmentAccessEnum;
  /** Delete the attachment */
  remove: AttachmentAccessEnum;
  /** Rename the attachment */
  rename: AttachmentAccessEnum;
}

const FULL_ACCESS = (document: IAttachmentDocument): AttachmentAccess => ({
  read: true,
  write: getWriteAccess(document, AttachmentAccessEnum.ALLOWED),
  move: getMoveAccess(document, AttachmentAccessEnum.ALLOWED),
  remove: AttachmentAccessEnum.ALLOWED,
  rename: getRenameAccess(document, AttachmentAccessEnum.ALLOWED),
});

type UseAttachmentAccess = (document: IAttachmentDocument, parentDocument: IDocument | undefined) => AttachmentAccess;

type UseLazyAttachmentAccess = () => UseAttachmentAccess;

export const useLazyAttachmentAccess: UseLazyAttachmentAccess = () => {
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();
  const isRolUser = useIsRolUser();
  const isAssignedRol = useIsAssignedRol();
  const isSentToRol = useIsSentToRol();
  const isSentToMedunderskriver = useLazyIsSentToMedunderskriver();
  const isMedunderskriver = useLazyIsAssignedMedunderskriver();
  const isCaseTildelt = useLazyIsTildelt();
  const isTildeltSaksbehandler = useLazyIsTildeltSaksbehandler();

  return (document, parentDocument) => {
    if (parentDocument === undefined) {
      // No parent document means no access to attachments.
      return {
        read: true,
        write: getWriteAccess(document, AttachmentAccessEnum.NOT_SUPPORTED),
        move: getMoveAccess(document, AttachmentAccessEnum.NOT_SUPPORTED),
        remove: AttachmentAccessEnum.NOT_SUPPORTED,
        rename: getRenameAccess(document, AttachmentAccessEnum.NOT_SUPPORTED),
      };
    }

    return getAttachmentAccess(document, parentDocument, {
      isFinished,
      isFeilregistrert,
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

export interface AttachmentAccessParams {
  isFinished: boolean;
  isFeilregistrert: boolean;
  isRolUser: boolean;
  isAssignedRol: boolean;
  isSentToRol: boolean;
  isSentToMedunderskriver: () => boolean;
  isMedunderskriver: () => boolean;
  isCaseTildelt: () => boolean;
  isTildeltSaksbehandler: () => boolean;
}

export const getAttachmentAccess = (
  document: IAttachmentDocument,
  parentDocument: IDocument,
  params: AttachmentAccessParams,
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
): AttachmentAccess => {
  const {
    isFinished,
    isFeilregistrert,
    isRolUser,
    isAssignedRol,
    isSentToRol,
    isSentToMedunderskriver,
    isMedunderskriver,
    isCaseTildelt,
    isTildeltSaksbehandler,
  } = params;

  if (isFinished) {
    // Everyone has full access to documents in finished cases.
    return {
      read: true,
      write: getWriteAccess(document, AttachmentAccessEnum.ALLOWED),
      move: getMoveAccess(document, AttachmentAccessEnum.ALLOWED),
      remove: AttachmentAccessEnum.ALLOWED,
      rename: getRenameAccess(document, AttachmentAccessEnum.ALLOWED),
    };
  }

  if (isFeilregistrert) {
    // Everyone has read-only access to documents in feilregistrert cases.
    return {
      read: true,
      write: getWriteAccess(document, AttachmentAccessEnum.FEILREGISTRERT),
      move: getMoveAccess(document, AttachmentAccessEnum.FEILREGISTRERT),
      remove: AttachmentAccessEnum.FEILREGISTRERT,
      rename: getRenameAccess(document, AttachmentAccessEnum.FEILREGISTRERT),
    };
  }

  if (parentDocument.isMarkertAvsluttet) {
    // Everyone has read-only access to documents that are marked as avsluttet.
    return {
      read: true,
      write: getWriteAccess(document, AttachmentAccessEnum.FINISHED),
      move: getMoveAccess(document, AttachmentAccessEnum.FINISHED),
      remove: AttachmentAccessEnum.FINISHED,
      rename: getRenameAccess(document, AttachmentAccessEnum.FINISHED),
    };
  }

  // Attachments to ROL questions documents, other than ROL answers.
  if (getIsRolQuestions(parentDocument)) {
    return getRolQuestionsAttachmentAccess(document, params);
  }

  // The only document type that ROL users may have access to is ROL answers and other attachments to ROL questions.
  if (isRolUser) {
    // ROL users have read-only access to documents, unless they are assigned and the case is sent to ROL.
    return {
      read: true,
      write: getWriteAccess(document, AttachmentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER),
      move: getMoveAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
      remove: AttachmentAccessEnum.NOT_ASSIGNED,
      rename: getRenameAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
    };
  }

  if (document.type === DocumentTypeEnum.UPLOADED) {
    // Uploaded documents are accessible to all users.
    return FULL_ACCESS(document);
  }

  if (isSentToMedunderskriver()) {
    if (isMedunderskriver()) {
      if (document.type === DocumentTypeEnum.JOURNALFOERT && document.creator.creatorRole === CreatorRole.KABAL_ROL) {
        // Medunderskriver has read-only access to ROL questions documents.
        return {
          read: true,
          write: getWriteAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
          move: getMoveAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
          remove: AttachmentAccessEnum.NOT_ASSIGNED,
          rename: getRenameAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
        };
      }

      // Medunderskriver has read and write access to all non-ROL documents.
      // Medunderskriver can write in smart documents, when the case is sent to medunderskriver.
      // Medunderskriver cannot move attachments.
      return {
        read: true,
        write: getWriteAccess(document, AttachmentAccessEnum.ALLOWED),
        move: getMoveAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
        remove: AttachmentAccessEnum.NOT_ASSIGNED,
        rename: getRenameAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
      };
    }

    // No one else has access to documents when the case is sent to medunderskriver.
    return {
      read: true,
      write: getWriteAccess(document, AttachmentAccessEnum.SENT_TO_MEDUNDERSKRIVER),
      move: getMoveAccess(document, AttachmentAccessEnum.SENT_TO_MEDUNDERSKRIVER),
      remove: AttachmentAccessEnum.SENT_TO_MEDUNDERSKRIVER,
      rename: getRenameAccess(document, AttachmentAccessEnum.SENT_TO_MEDUNDERSKRIVER),
    };
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

      // Write access is allowed, but it is impossible to write in journalførte documents.
      // Kun tilsendt ROL og tildelt saksbehandler kan flytte vedlegg
      return {
        read: true,
        write: getWriteAccess(document, AttachmentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER),
        move: getMoveAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
        remove: AttachmentAccessEnum.NOT_ASSIGNED,
        rename: getRenameAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
      };
    }

    if (document.creator.creatorRole === CreatorRole.KABAL_ROL) {
      // Journalfoert documents created by ROL are accessible to ROL, when the case is sent to ROL.
      if (isAssignedRol) {
        return isSentToRol
          ? FULL_ACCESS(document)
          : {
              read: true,
              write: getWriteAccess(document, AttachmentAccessEnum.NOT_SENT_TO_ROL),
              move: getMoveAccess(document, AttachmentAccessEnum.NOT_SENT_TO_ROL),
              remove: AttachmentAccessEnum.NOT_SENT_TO_ROL,
              rename: getRenameAccess(document, AttachmentAccessEnum.NOT_SENT_TO_ROL),
            };
      }

      // Other users have read-only access to journalfoert attachments created by ROL.
      return {
        read: true,
        write: getWriteAccess(document, AttachmentAccessEnum.ROL_OWNED_ATTACHMENT),
        move: getMoveAccess(document, AttachmentAccessEnum.ROL_OWNED_ATTACHMENT),
        remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
        rename: getRenameAccess(document, AttachmentAccessEnum.ROL_OWNED_ATTACHMENT),
      };
    }

    // Journalfoert documents created with CreatorRole.NONE are accessible to the assigned saksbehandler.
    return isTildeltSaksbehandler()
      ? FULL_ACCESS(document)
      : {
          read: true,
          write: getWriteAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
          move: getMoveAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
          remove: AttachmentAccessEnum.NOT_ASSIGNED,
          rename: getRenameAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
        };
  }

  // Non-ROL documents in non-feilregistrert, non-medunderskriver cases.

  if (isTildeltSaksbehandler()) {
    return FULL_ACCESS(document); // Only the assigned saksbehandler has full access.
  }

  if (isCaseTildelt()) {
    // Everyone else has read-only access to documents.
    return {
      read: true,
      write: getWriteAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
      move: getMoveAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
      remove: AttachmentAccessEnum.NOT_ASSIGNED,
      rename: getRenameAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
    };
  }

  // Non-ROL documents in non-feilregistrert, non-medunderskriver, non-assigned cases.
  return FULL_ACCESS(document);
};

const getRolQuestionsAttachmentAccess = (
  document: IAttachmentDocument,
  { isSentToRol, isAssignedRol, isTildeltSaksbehandler, isCaseTildelt, isMedunderskriver }: AttachmentAccessParams,
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
): AttachmentAccess => {
  const { creatorRole } = document.creator;

  if (creatorRole === CreatorRole.KABAL_ROL) {
    if (isAssignedRol) {
      if (!isSentToRol) {
        // ROL has read-only access to attachments to ROL questions documents added by ROL, when the case is not sent to ROL.
        return {
          read: true,
          write: getWriteAccess(document, AttachmentAccessEnum.NOT_SENT_TO_ROL),
          move: getMoveAccess(document, AttachmentAccessEnum.NOT_SENT_TO_ROL),
          remove: AttachmentAccessEnum.NOT_SENT_TO_ROL,
          rename: getRenameAccess(document, AttachmentAccessEnum.NOT_SENT_TO_ROL),
        };
      }
      // ROL has full control over ROL questions attachments added by ROL users.
      return {
        read: true, // Everyone can read attachments to ROL questions documents.
        write: getWriteAccess(document, AttachmentAccessEnum.ALLOWED), // ROL has write access to attachments to ROL questions documents. Only ROL answers are editable, but if there were other attachments, ROL would have write access to them.
        move: getMoveAccess(document, AttachmentAccessEnum.ALLOWED), // ROL can move ROL questions attachments added by ROL users.
        remove: AttachmentAccessEnum.ALLOWED, // ROL can remove attachments to the ROL questions document added by ROL users.
        rename: getRenameAccess(document, AttachmentAccessEnum.ALLOWED), // ROL can rename attachments to ROL questions documents. None are possible to rename, but if they were, ROL would have access.
      };
    }

    // Other users have read-only access to attachments to ROL questions documents added by ROL users.
    return {
      read: true,
      write: getWriteAccess(document, AttachmentAccessEnum.ROL_OWNED_ATTACHMENT),
      move: getMoveAccess(document, AttachmentAccessEnum.ROL_OWNED_ATTACHMENT),
      remove: AttachmentAccessEnum.ROL_OWNED_ATTACHMENT,
      rename: getRenameAccess(document, AttachmentAccessEnum.ROL_OWNED_ATTACHMENT),
    };
  }

  // If the attachment was added by a saksbehandler or medunderskriver, only they have access to it.
  if (creatorRole === CreatorRole.KABAL_SAKSBEHANDLING || creatorRole === CreatorRole.KABAL_MEDUNDERSKRIVER) {
    // Saksbehandler has full access to attachments to ROL questions attachments added by saksbehandler or medunderskriver.
    // Medunderskriver is no longer allowed to add attachments to ROL questions documents. This is here to handle existing documents.

    if (isMedunderskriver()) {
      return {
        read: true,
        write: getWriteAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
        move: getMoveAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
        remove: AttachmentAccessEnum.NOT_ASSIGNED,
        rename: getRenameAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
      };
    }

    if (isAssignedRol) {
      return {
        read: true,
        write: getWriteAccess(document, AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT),
        move: getMoveAccess(document, AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT),
        remove: AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT,
        rename: getRenameAccess(document, AttachmentAccessEnum.SAKSBEHANDLER_OWNED_ATTACHMENT),
      };
    }

    if (isTildeltSaksbehandler()) {
      if (isSentToRol) {
        return {
          read: true,
          write: getWriteAccess(document, AttachmentAccessEnum.SENT_TO_ROL),
          move: getMoveAccess(document, AttachmentAccessEnum.SENT_TO_ROL),
          remove: AttachmentAccessEnum.SENT_TO_ROL,
          rename: getRenameAccess(document, AttachmentAccessEnum.SENT_TO_ROL),
        };
      }

      return FULL_ACCESS(document);
    }

    return {
      read: true,
      write: getWriteAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
      move: getMoveAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
      remove: AttachmentAccessEnum.NOT_ASSIGNED,
      rename: getRenameAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
    };
  }

  if (document.type === DocumentTypeEnum.UPLOADED) {
    // Uploaded documents in ROL questions are accessible to all users.
    // It is no longer possible to upload attachments to ROL questions documents. This is here to handle existing documents.
    return (isAssignedRol && isSentToRol) || isTildeltSaksbehandler()
      ? FULL_ACCESS(document)
      : {
          read: true,
          write: getWriteAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
          move: getMoveAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
          remove: AttachmentAccessEnum.NOT_ASSIGNED,
          rename: getRenameAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
        };
  }

  // All other non-uploaded attachments with creatorRole === CreatorRole.NONE.
  // This is not supposed to happen, but if it does, someone must have access.

  if (isAssignedRol) {
    // ROL has full access when the case is sent to ROL.
    // Otherwise ROL has read-only access.
    return isSentToRol
      ? FULL_ACCESS(document)
      : {
          read: true,
          write: getWriteAccess(document, AttachmentAccessEnum.NOT_SENT_TO_ROL),
          move: getMoveAccess(document, AttachmentAccessEnum.NOT_SENT_TO_ROL),
          remove: AttachmentAccessEnum.NOT_SENT_TO_ROL,
          rename: getRenameAccess(document, AttachmentAccessEnum.NOT_SENT_TO_ROL),
        };
  }

  if (isSentToRol) {
    // Other users have read-only access when the case is sent to ROL.
    return {
      read: true,
      write: getWriteAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
      move: getMoveAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
      remove: AttachmentAccessEnum.NOT_ASSIGNED,
      rename: getRenameAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
    };
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

  // In all other cases, everyone has read-only access to attachments to ROL questions documents.
  return {
    read: true,
    write: getWriteAccess(document, AttachmentAccessEnum.NOT_ASSIGNED_OR_MEDUNDERSKRIVER),
    move: getMoveAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
    remove: AttachmentAccessEnum.NOT_ASSIGNED,
    rename: getRenameAccess(document, AttachmentAccessEnum.NOT_ASSIGNED),
  };
};

// Only smart documents can be written to.
const getWriteAccess = (document: IDocument, supported: AttachmentAccessEnum): AttachmentAccessEnum =>
  document.isSmartDokument ? supported : AttachmentAccessEnum.NOT_SUPPORTED;

// Only smart and uploaded documents can be renamed. Archived documents must be renamed in the journalførte documents list.
const getRenameAccess = (document: IDocument, supported: AttachmentAccessEnum): AttachmentAccessEnum =>
  document.type === DocumentTypeEnum.SMART || document.type === DocumentTypeEnum.UPLOADED
    ? supported
    : AttachmentAccessEnum.NOT_SUPPORTED;

const getMoveAccess = (document: IAttachmentDocument, supported: AttachmentAccessEnum): AttachmentAccessEnum => {
  if (
    document.type === DocumentTypeEnum.UPLOADED ||
    document.type === DocumentTypeEnum.JOURNALFOERT ||
    getIsRolAnswers(document)
  ) {
    return supported;
  }

  return AttachmentAccessEnum.NOT_SUPPORTED;
};
