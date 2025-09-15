import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { type DuaParentDocument, useDuaAccess, useLazyDuaAccess } from '@app/hooks/dua-access/use-dua-access';
import { useAttachments } from '@app/hooks/use-parent-document';
import type { IParentDocument } from '@app/types/documents/documents';

interface Result {
  removeDocumentAccessError: string | null;
  removeAttachmentsAccessErrors: string[];
}

export const useRemoveDocumentAccessErrors = ({ id, type, templateId, creator }: IParentDocument): Result => {
  const removeDocumentAccessError = useDuaAccess({ creator, type, templateId }, DuaActionEnum.REMOVE);

  const { pdfOrSmartDocuments, journalfoerteDocuments } = useAttachments(id);

  const getAccessError = useLazyDuaAccess();

  const parent: DuaParentDocument = { type, templateId };

  const removeAttachmentsAccessErrors: string[] = [];

  for (const { creator, type, templateId } of pdfOrSmartDocuments) {
    const error = getAccessError({ creator, type, templateId }, DuaActionEnum.REMOVE, parent);
    if (error !== null && !removeAttachmentsAccessErrors.includes(error)) {
      removeAttachmentsAccessErrors.push(error);
    }
  }

  for (const { creator, type, templateId } of journalfoerteDocuments) {
    const error = getAccessError({ creator, type, templateId }, DuaActionEnum.REMOVE, parent);
    if (error !== null && !removeAttachmentsAccessErrors.includes(error)) {
      removeAttachmentsAccessErrors.push(error);
    }
  }

  return { removeDocumentAccessError, removeAttachmentsAccessErrors };
};
