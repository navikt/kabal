import type { DuaActionEnum } from '@app/hooks/dua-access/access';
import { useLazyAttachmentAccess } from '@app/hooks/dua-access/use-attachment-access';
import { useLazyDocumentAccess } from '@app/hooks/dua-access/use-document-access';
import { useLazyParentDocument } from '@app/hooks/use-parent-document';
import { type IDocument, isParentDocument } from '@app/types/documents/documents';

export const useLazyDuaAccess = () => {
  const getParent = useLazyParentDocument();
  const getDocumentAccess = useLazyDocumentAccess();
  const getAttachmentAccess = useLazyAttachmentAccess();

  return (document: IDocument, action: DuaActionEnum) => {
    const { creator, isSmartDokument, templateId, isMarkertAvsluttet, id } = document;

    if (isParentDocument(document)) {
      return getDocumentAccess(
        { creatorRole: creator.creatorRole, isSmartDokument, type: document.type, templateId, isMarkertAvsluttet, id },
        action,
      );
    }

    return getAttachmentAccess(
      action,
      { creatorRole: creator.creatorRole, isSmartDokument, type: document.type, templateId },
      getParent(document.parentId),
    );
  };
};

export const useDuaAccess = (document: IDocument, action: DuaActionEnum) => {
  const getDuaAccess = useLazyDuaAccess();

  return getDuaAccess(document, action);
};
