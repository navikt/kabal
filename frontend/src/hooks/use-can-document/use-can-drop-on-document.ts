import { DragAndDropContext } from '@app/components/documents/drag-context';
import { canDistributeAny } from '@app/components/documents/filetype';
import { getIsRolAnswers, getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { AttachmentAccessEnum } from '@app/hooks/dua-access/attachment-access';
import { DocumentAccessEnum } from '@app/hooks/dua-access/document-access';
import { useLazyAttachmentAccess } from '@app/hooks/dua-access/use-attachment-access';
import { type DocumentAccess, useLazyDocumentAccess } from '@app/hooks/dua-access/use-document-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useLazyParentDocument } from '@app/hooks/use-parent-document';
import {
  DistribusjonsType,
  DocumentTypeEnum,
  type IAttachmentDocument,
  type IDocument,
  type IParentDocument,
  isAttachmentDocument,
  isParentDocument,
} from '@app/types/documents/documents';
import { useCallback, useContext, useMemo } from 'react';

export const useCanDropOnDocument = (targetDocument: IDocument, targetAccess: DocumentAccess) => {
  const { draggedDocument, draggedJournalfoertDocuments } = useContext(DragAndDropContext);
  const isFeilregistrert = useIsFeilregistrert();
  const canBeParentOfDocument = useLazyCanBeParentOfDocument();

  if (targetDocument.isMarkertAvsluttet || isFeilregistrert || isAttachmentDocument(targetDocument)) {
    return false;
  }

  // Nye journalførte dokumenter.
  if (draggedJournalfoertDocuments.length > 0) {
    if (targetAccess.referAttachments !== DocumentAccessEnum.ALLOWED) {
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
    targetDocument: IParentDocument,
    attachment: IAttachmentDocument,
    parentDocument?: IParentDocument,
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

      if (access.move !== AttachmentAccessEnum.ALLOWED) {
        // Dratt dokument kan ikke flyttes.
        return false;
      }

      // Target allows uploaded attachments.
      if (
        targetAccess.uploadAttachments === DocumentAccessEnum.ALLOWED &&
        attachment.type === DocumentTypeEnum.UPLOADED
      ) {
        return true;
      }

      // Target allows archived attachments.
      if (
        targetAccess.referAttachments === DocumentAccessEnum.ALLOWED &&
        attachment.type === DocumentTypeEnum.JOURNALFOERT
      ) {
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
  targetDocument: IParentDocument,
  attachment: IAttachmentDocument,
  parentDocument?: IParentDocument,
): boolean => {
  const canBeParentOfDocument = useLazyCanBeParentOfDocument();

  return useMemo(
    () => canBeParentOfDocument(targetDocument, attachment, parentDocument),
    [targetDocument, attachment, parentDocument, canBeParentOfDocument],
  );
};
