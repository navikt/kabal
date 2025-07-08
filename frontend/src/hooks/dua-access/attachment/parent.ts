import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { DuaAccessParent } from '@app/hooks/dua-access/access';
import { DocumentTypeEnum, type IDocument } from '@app/types/documents/documents';

export const getParentDocumentType = (document: IDocument | undefined): DuaAccessParent | null => {
  if (document === undefined) {
    return DuaAccessParent.NONE;
  }

  if (getIsRolQuestions(document)) {
    return DuaAccessParent.ROL_QUESTIONS;
  }

  if (document.type === DocumentTypeEnum.UPLOADED) {
    return DuaAccessParent.UPLOADED;
  }

  if (document.isSmartDokument) {
    return DuaAccessParent.SMART_DOCUMENT;
  }

  return null;
};
