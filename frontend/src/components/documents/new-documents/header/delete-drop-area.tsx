import { DragAndDropContext } from '@app/components/documents/drag-context';
import { DropZone } from '@app/components/documents/new-documents/shared/drop-zone';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEditDocument } from '@app/hooks/use-can-document/use-can-edit-document';
import { useAttachments, useParentDocument } from '@app/hooks/use-parent-document';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useDeleteDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { CreatorRole, DocumentTypeEnum } from '@app/types/documents/documents';
import { TrashIcon } from '@navikt/aksel-icons';
import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext } from 'react';

export const DeleteDropArea = () => {
  const [deleteDocument, { isLoading }] = useDeleteDocumentMutation();
  const oppgaveId = useOppgaveId();
  const { draggedDocument, clearDragState } = useContext(DragAndDropContext);
  const removeSmartDocument = useRemoveDocument();

  const parentDocument = useParentDocument(draggedDocument?.parentId ?? null);
  const { pdfOrSmartDocuments, journalfoerteDocuments } = useAttachments(
    draggedDocument?.parentId ?? draggedDocument?.id,
  );
  const containsRolAttachments =
    pdfOrSmartDocuments.some((d) => d.creator.creatorRole === CreatorRole.KABAL_ROL) ||
    journalfoerteDocuments.some((d) => d.creator.creatorRole === CreatorRole.KABAL_ROL);
  const canEdit = useCanEditDocument(draggedDocument, parentDocument);
  const isAttachment = parentDocument !== undefined;
  const isDropTarget = canEdit && (isAttachment || !containsRolAttachments);

  const onDrop = useCallback(() => {
    if (isDropTarget && oppgaveId !== skipToken && draggedDocument !== null) {
      if (draggedDocument.type === DocumentTypeEnum.SMART) {
        removeSmartDocument(draggedDocument.id, draggedDocument);
      }
      deleteDocument({ oppgaveId, dokumentId: draggedDocument.id });
    }

    clearDragState();
  }, [clearDragState, deleteDocument, draggedDocument, isDropTarget, oppgaveId, removeSmartDocument]);

  return (
    <DropZone
      onDrop={onDrop}
      active={isDropTarget || isLoading}
      label="Slett"
      icon={isLoading ? <Loader size="xsmall" /> : <TrashIcon aria-hidden />}
      danger
      className="h-full w-50 shrink-0"
    />
  );
};
