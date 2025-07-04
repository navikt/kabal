import { DragAndDropContext } from '@app/components/documents/drag-context';
import { canDistributeAny } from '@app/components/documents/filetype';
import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { useLazyDuaAccess } from '@app/hooks/dua-access/use-dua-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import {
  DistribusjonsType,
  type IAttachmentDocument,
  type IDocument,
  type IParentDocument,
  isAttachmentDocument,
  isParentDocument,
} from '@app/types/documents/documents';
import { useCallback, useContext, useMemo } from 'react';

export const useCanDropOnDocument = (targetDocument: IDocument) => {
  const { draggedDocument, draggedJournalfoertDocuments } = useContext(DragAndDropContext);
  const isFeilregistrert = useIsFeilregistrert();
  const canBeParentOfDocument = useLazyCanBeParentOfDocument();

  if (targetDocument.isMarkertAvsluttet || isFeilregistrert || isAttachmentDocument(targetDocument)) {
    return false;
  }

  // Nye journalførte dokumenter.
  if (draggedJournalfoertDocuments.length > 0) {
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

  return canBeParentOfDocument(targetDocument, draggedDocument, undefined);
};

export const useLazyCanBeParentOfDocument = () => {
  const getDuaAccess = useLazyDuaAccess();

  type Fn = (toParent: IParentDocument, attachment: IAttachmentDocument, fromParent?: IParentDocument) => boolean;

  return useCallback<Fn>(
    (toParent, attachment, fromParent) => {
      if (toParent.id === attachment.parentId) {
        // Vedlegg kan ikke flyttes til samme hoveddokument. Ingen endring.
        return false;
      }

      const removeAccess = getDuaAccess(attachment, DuaActionEnum.REMOVE, fromParent);

      if (removeAccess !== null) {
        return false;
      }

      const createAccess = getDuaAccess(attachment, DuaActionEnum.CREATE, toParent);

      return createAccess === null;
    },
    [getDuaAccess],
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
