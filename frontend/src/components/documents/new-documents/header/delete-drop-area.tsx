import { DragAndDropContext } from '@app/components/documents/drag-context';
import { DropZone } from '@app/components/documents/new-documents/shared/drop-zone';
import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { useAttachmentAccess, useLazyAttachmentAccess } from '@app/hooks/dua-access/use-attachment-access';
import { useLazyDocumentAccess } from '@app/hooks/dua-access/use-document-access';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useLazyParentDocument, useParentDocument } from '@app/hooks/use-parent-document';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useDeleteDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import {
  DocumentTypeEnum,
  type IAttachmentDocument,
  type IDocument,
  isAttachmentDocument,
  isParentDocument,
} from '@app/types/documents/documents';
import { TrashIcon } from '@navikt/aksel-icons';
import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext } from 'react';

export const DeleteDropArea = () => {
  const oppgaveId = useOppgaveId();
  const [deleteDocument, { isLoading }] = useDeleteDocumentMutation();
  const removeSmartDocument = useRemoveDocument();
  const { draggedDocument, clearDragState } = useContext(DragAndDropContext);

  const onDrop = useCallback(
    (document: IDocument) => {
      if (oppgaveId === skipToken) {
        return clearDragState();
      }

      if (document.type === DocumentTypeEnum.SMART) {
        removeSmartDocument(document.id, document);
      }
      deleteDocument({ oppgaveId, dokumentId: document.id });
      clearDragState();
    },
    [clearDragState, deleteDocument, oppgaveId, removeSmartDocument],
  );

  if (draggedDocument === null) {
    return null;
  }

  if (isAttachmentDocument(draggedDocument)) {
    return <AttachmentDeleteDropArea draggedDocument={draggedDocument} onDrop={onDrop} isLoading={isLoading} />;
  }

  return <DocumentDeleteDropArea draggedDocument={draggedDocument} onDrop={onDrop} isLoading={isLoading} />;
};

interface DocumentProps {
  draggedDocument: IDocument;
  onDrop: (document: IDocument) => void;
  isLoading: boolean;
}

const DocumentDeleteDropArea = ({ draggedDocument, onDrop, isLoading }: DocumentProps) => {
  const getDocumentAccess = useLazyDocumentAccess();
  const getAttachmentAccess = useLazyAttachmentAccess();
  const getParent = useLazyParentDocument();

  const creatorRole = draggedDocument.creator.creatorRole;
  const { id, isSmartDokument, templateId, isMarkertAvsluttet } = draggedDocument;

  const access = isParentDocument(draggedDocument)
    ? getDocumentAccess(
        { id, creatorRole, isSmartDokument, type: draggedDocument.type, templateId, isMarkertAvsluttet },
        DuaActionEnum.REMOVE,
      )
    : getAttachmentAccess(
        DuaActionEnum.REMOVE,
        {
          isSmartDokument,
          creatorRole,
          type: draggedDocument.type,
          templateId,
        },
        getParent(draggedDocument.parentId),
      );

  return (
    <DropZone
      onDrop={() => onDrop(draggedDocument)}
      active={access === null || isLoading}
      label="Slett"
      icon={isLoading ? <Loader size="xsmall" /> : <TrashIcon aria-hidden />}
      danger
      className="h-full w-50 shrink-0"
    />
  );
};

interface AttachmentProps {
  draggedDocument: IAttachmentDocument;
  onDrop: (document: IAttachmentDocument) => void;
  isLoading: boolean;
}

const AttachmentDeleteDropArea = ({ draggedDocument, onDrop, isLoading }: AttachmentProps) => {
  const parentDocument = useParentDocument(draggedDocument.parentId);
  const removeAccessError = useAttachmentAccess(
    {
      creatorRole: draggedDocument.creator.creatorRole,
      isSmartDokument: draggedDocument.isSmartDokument,
      type: draggedDocument.type,
      templateId: draggedDocument.templateId,
    },
    parentDocument,
    DuaActionEnum.REMOVE,
  );

  return (
    <DropZone
      onDrop={() => onDrop(draggedDocument)}
      active={removeAccessError === null || isLoading}
      label="Slett"
      icon={isLoading ? <Loader size="xsmall" /> : <TrashIcon aria-hidden />}
      danger
      className="h-full w-50 shrink-0"
    />
  );
};
