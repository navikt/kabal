import { getIsRolQuestions } from '@/components/documents/new-documents/helpers';
import type { IDocument } from '@/types/documents/documents';

export const getHasUploadOrRolAnswersButton = (
  document: IDocument | undefined,
  isAssignedRolAndSent: boolean,
  isFeilregistrert: boolean,
  hasUploadAccess: boolean,
) => {
  if (document === undefined) {
    return false;
  }

  if (getIsRolQuestions(document)) {
    return isAssignedRolAndSent;
  }

  return (
    !isAssignedRolAndSent && // ROL users cannot upload documents.
    !isFeilregistrert && // Feilregistrert cases cannot get new documents.
    document.parentId === null && // Only main documents can have attachments.
    hasUploadAccess &&
    !document.isSmartDokument
  );
};
