import { AttachmentAccessEnum } from '@app/hooks/dua-access/attachment-access';
import { DocumentAccessEnum } from '@app/hooks/dua-access/document-access';
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
      const { write } = getDocumentAccess(smartDocument);

      return write === DocumentAccessEnum.ALLOWED;
    }

    const parentDocument = getParentDocument(smartDocument.parentId);

    if (parentDocument === undefined) {
      return false;
    }

    const { write } = getAttachmentAccess(smartDocument, parentDocument);

    return write === AttachmentAccessEnum.ALLOWED;
  }, [getDocumentAccess, getAttachmentAccess, getParentDocument, smartDocument]);
};
