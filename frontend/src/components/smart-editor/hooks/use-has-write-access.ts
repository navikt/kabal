import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { useLazyAttachmentAccess } from '@app/hooks/dua-access/use-attachment-access';
import { useLazyDocumentAccess } from '@app/hooks/dua-access/use-document-access';
import { useLazyParentDocument } from '@app/hooks/use-parent-document';
import { type ISmartDocumentOrAttachment, isParentDocument } from '@app/types/documents/documents';
import { useMemo } from 'react';

export const useHasWriteAccess = (smartDocument: ISmartDocumentOrAttachment): boolean => {
  const getDocumentAccess = useLazyDocumentAccess();
  const getAttachmentAccess = useLazyAttachmentAccess();
  const getParentDocument = useLazyParentDocument();

  return useMemo(() => {
    if (isParentDocument(smartDocument)) {
      const writeAccess = getDocumentAccess(smartDocument, DuaActionEnum.WRITE);

      return writeAccess === null;
    }

    const parentDocument = getParentDocument(smartDocument.parentId);

    if (parentDocument === undefined) {
      return false;
    }

    const writeAccess = getAttachmentAccess(DuaActionEnum.WRITE, smartDocument, parentDocument);

    return writeAccess === null;
  }, [getDocumentAccess, getAttachmentAccess, getParentDocument, smartDocument]);
};
