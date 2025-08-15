import { DragAndDropContext } from '@app/components/documents/drag-context';
import { DropZone } from '@app/components/documents/new-documents/shared/drop-zone';
import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { useDuaAccess } from '@app/hooks/dua-access/use-dua-access';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useDeleteDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import {
  DocumentTypeEnum,
  type IAttachmentDocument,
  type IDocument,
  isAttachmentDocument,
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
  const removeAccess = useDuaAccess(draggedDocument, DuaActionEnum.REMOVE);

  return (
    <DropZone
      onDrop={() => onDrop(draggedDocument)}
      active={removeAccess === null || isLoading}
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
  const removeAccessError = useDuaAccess(draggedDocument, DuaActionEnum.REMOVE);

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
