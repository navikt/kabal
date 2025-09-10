import { DragAndDropContext } from '@app/components/documents/drag-context';
import { canDistributeAny } from '@app/components/documents/filetype';
import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { useCreatorRole } from '@app/hooks/dua-access/use-creator-role';
import { useLazyDuaAccess } from '@app/hooks/dua-access/use-dua-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { Journalstatus } from '@app/types/arkiverte-documents';
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

export const useCanDropOnDocument = (targetDocument: IDocument): boolean => {
  const { draggedDocument, draggedJournalfoertDocuments } = useContext(DragAndDropContext);
  const isFeilregistrert = useIsFeilregistrert();
  const canBeParentOfDocument = useLazyCanBeParentOfDocument();
  const creatorRole = useCreatorRole();
  const getAccess = useLazyDuaAccess();

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

    if (draggedJournalfoertDocuments.some((d) => !d.hasAccess || d.journalstatus === Journalstatus.MOTTATT)) {
      // Journalførte dokumenter som ikke har tilgang eller har status MOTTATT kan ikke legges til som vedlegg.
      return false;
    }

    const access = getAccess(
      { creator: { creatorRole }, type: DocumentTypeEnum.JOURNALFOERT },
      DuaActionEnum.CREATE,
      targetDocument,
    );

    return access === null;
  }

  // Eksisterende dokumenter.
  if (draggedDocument === null) {
    return false;
  }

  if (isParentDocument(draggedDocument)) {
    // Hoveddokumenter kan ikke gjøres om til vedlegg.
    return false;
  }

  const access = getAccess({ ...draggedDocument, creator: { creatorRole } }, DuaActionEnum.CREATE, targetDocument);

  if (access !== null) {
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
