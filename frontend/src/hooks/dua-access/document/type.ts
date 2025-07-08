import { getIsRolAnswers, getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { DuaAccessDocumentType } from '@app/hooks/dua-access/access';
import { DocumentTypeEnum, type IDocument } from '@app/types/documents/documents';

export const getDocumentType = (document: IDocument): DuaAccessDocumentType | null => {
  if (document.type === DocumentTypeEnum.JOURNALFOERT) {
    return DuaAccessDocumentType.JOURNALFOERT;
  }

  if (getIsRolQuestions(document)) {
    return DuaAccessDocumentType.ROL_QUESTIONS;
  }

  if (getIsRolAnswers(document)) {
    return DuaAccessDocumentType.ROL_ANSWERS;
  }

  if (document.isSmartDokument) {
    return DuaAccessDocumentType.SMART_DOCUMENT;
  }

  if (document.type === DocumentTypeEnum.UPLOADED) {
    return DuaAccessDocumentType.UPLOADED;
  }

  return null;
};
