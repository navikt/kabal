import { DragAndDropContext } from '@app/components/documents/drag-context';
import { canDistributeAny } from '@app/components/documents/filetype';
import { getIsRolAnswers, getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { useLazyAttachmentAccess } from '@app/hooks/dua-access/use-attachment-access';
import { type DocumentAccess, useLazyDocumentAccess } from '@app/hooks/dua-access/use-document-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useLazyParentDocument } from '@app/hooks/use-parent-document';
import {
  DistribusjonsType,
  DocumentTypeEnum,
  type IAttachmentDocument,
  type IDocument,
  isParentDocument,
} from '@app/types/documents/documents';
import { useCallback, useContext, useMemo } from 'react';

export const useCanDropOnDocument = (targetDocument: IDocument, targetAccess: DocumentAccess) => {
  const { draggedDocument, draggedJournalfoertDocuments } = useContext(DragAndDropContext);
  const isFeilregistrert = useIsFeilregistrert();
  const canBeParentOfDocument = useLazyCanBeParentOfDocument();

  if (targetDocument.isMarkertAvsluttet || isFeilregistrert) {
    return false;
  }

  // Nye journalførte dokumenter.
  if (draggedJournalfoertDocuments.length > 0) {
    if (!targetAccess.referAttachments) {
      return false;
    }

    if (
      draggedJournalfoertDocuments.some((d) => !canDistributeAny(d.varianter)) &&
      targetDocument.dokumentTypeId !== DistribusjonsType.NOTAT
    ) {
      // Journalførte dokumenter med varianter som ikke kan distribueres, kan kun legges som vedlegg til dokumenter av typen NOTAT.
      return false;
    }

    return true;
  }

  // Eksisterende dokumenter.
  if (draggedDocument === null) {
    return false;
  }

  if (isParentDocument(draggedDocument)) {
    // Hoveddokumenter kan ikke gjøres om til vedlegg.
    return false;
  }

  return canBeParentOfDocument(targetDocument, draggedDocument, undefined, targetAccess);
};

export const useLazyCanBeParentOfDocument = () => {
  const getDocumentAccess = useLazyDocumentAccess();
  const getAttachmentAccess = useLazyAttachmentAccess();
  const getParentDocument = useLazyParentDocument();

  type Fn = (
    targetDocument: IDocument,
    attachment: IAttachmentDocument,
    parentDocument?: IDocument,
    targetAccess?: DocumentAccess,
  ) => boolean;

  return useCallback<Fn>(
    (
      targetDocument,
      attachment,
      parentDocument = getParentDocument(attachment.parentId),
      targetAccess = getDocumentAccess(targetDocument),
    ) => {
      if (targetDocument.id === attachment.parentId) {
        // Vedlegg kan ikke flyttes til samme hoveddokument. Ingen endring.
        return false;
      }

      const access = getAttachmentAccess(attachment, parentDocument);

      if (!access.move) {
        // Dratt dokument kan ikke flyttes.
        return false;
      }

      // Target allows uploaded attachments.
      if (targetAccess.uploadAttachments && attachment.type === DocumentTypeEnum.UPLOADED) {
        return true;
      }

      // Target allows archived attachments.
      if (targetAccess.referAttachments && attachment.type === DocumentTypeEnum.JOURNALFOERT) {
        return true;
      }

      // ROL-spørsmål
      if (getIsRolQuestions(targetDocument)) {
        // ROL-svar kan bare være vedlegg til ROL-spørsmål.
        // ROL-svar kan flyttes mellom ROL-spørsmål.
        return attachment.type === DocumentTypeEnum.JOURNALFOERT || getIsRolAnswers(attachment);
      }

      return false;
    },
    [getDocumentAccess, getAttachmentAccess, getParentDocument],
  );
};

export const useCanBeParentOfDocument = (
  targetDocument: IDocument,
  attachment: IAttachmentDocument,
  parentDocument?: IDocument,
): boolean => {
  const canBeParentOfDocument = useLazyCanBeParentOfDocument();

  return useMemo(
    () => canBeParentOfDocument(targetDocument, attachment, parentDocument),
    [targetDocument, attachment, parentDocument, canBeParentOfDocument],
  );
};
