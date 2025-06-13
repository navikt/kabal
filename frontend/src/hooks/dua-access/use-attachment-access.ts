import { getIsRolAnswers } from '@app/components/documents/new-documents/helpers';
import { useLazyIsTildelt } from '@app/hooks/oppgavebehandling/use-is-tildelt';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useLazyIsAssignedMedunderskriver, useLazyIsSentToMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useIsAssignedRol, useIsKrolUser, useIsRolUser, useIsSentToRol } from '@app/hooks/use-is-rol';
import { useLazyIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { DocumentTypeEnum, type IMainDocument, type JournalfoertDokument } from '@app/types/documents/documents';

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

const FULL_ACCESS = (document: IMainDocument): AttachmentAccess => ({
  read: true,
  write: true,
  move: true,
  remove: true,
  rename: document.type === DocumentTypeEnum.SMART || document.type === DocumentTypeEnum.UPLOADED,
});

export const useAttachmentAccess = (
  document: IMainDocument,
  parentDocument: IMainDocument | undefined,
): AttachmentAccess => {
  const isFeilregistrert = useIsFeilregistrert();
  const isKrolUser = useIsKrolUser();
  const isRolUser = useIsRolUser();
  const isAssignedRol = useIsAssignedRol();
  const isSentToRol = useIsSentToRol();
  const isSentToMedunderskriver = useLazyIsSentToMedunderskriver();
  const isMedunderskriver = useLazyIsAssignedMedunderskriver();
  const isCaseTildelt = useLazyIsTildelt();
  const isTildeltSaksbehandler = useLazyIsTildeltSaksbehandler();

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
  document: IMainDocument,
  parentDocument: IMainDocument,
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
        read: true,
        write: true,
        move: false, // ROL cannot move ROL answers attachments.
        remove: true,
        rename: false,
      };
    }

    return READ_ONLY_ACCESS; // Other users have read-only access to ROL answers documents.
  }

  // The only document type that ROL users may have access to is ROL answers.
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

  if (document.type === DocumentTypeEnum.JOURNALFOERT && !hasAccessToArchivedDocument(document)) {
    return {
      read: false,
      write: false,
      move: false,
      remove: false,
      rename: false,
    };
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

const hasAccessToArchivedDocument = (document: IMainDocument): document is JournalfoertDokument =>
  document.type === DocumentTypeEnum.JOURNALFOERT && document.journalfoertDokumentReference.hasAccess;
