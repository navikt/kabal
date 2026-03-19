import { PaperclipIcon } from '@navikt/aksel-icons';
import { Box } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext } from 'react';
import { DragAndDropContext } from '@/components/documents/drag-context';
import { AttachmentList, type ListProps } from '@/components/documents/new-documents/attachment-list';
import { NewDocument } from '@/components/documents/new-documents/new-document/new-document';
import { DropZone } from '@/components/documents/new-documents/shared/drop-zone';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useCanDropOnDocument } from '@/hooks/use-can-document/use-can-drop-on-document';
import { useIsFullfoert } from '@/hooks/use-is-fullfoert';
import {
  useCreateVedleggFromJournalfoertDocumentMutation,
  useSetParentMutation,
} from '@/redux-api/oppgaver/mutations/documents';
import type { IDocument, IParentDocument } from '@/types/documents/documents';

interface Props extends ListProps {
  document: IParentDocument;
  style: React.CSSProperties;
  setSize: number;
  posInSet: number;
}

export const NewParentDocument = ({ document, style, setSize, posInSet, ...listProps }: Props) => {
  const oppgaveId = useOppgaveId();
  const [createVedlegg] = useCreateVedleggFromJournalfoertDocumentMutation({
    fixedCacheKey: `createVedlegg-${document.id}`,
  });
  const [setParent] = useSetParentMutation();
  const { draggedDocument, draggedJournalfoertDocuments, clearDragState } = useContext(DragAndDropContext);
  const isDropTarget = useCanDropOnDocument(document);
  const isFinished = useIsFullfoert();

  const onDrop = useCallback(() => {
    if (oppgaveId !== skipToken && isDropTarget) {
      if (isDroppableNewDocument(draggedDocument, document.id)) {
        setParent({ dokumentId: draggedDocument.id, oppgaveId, parentId: document.id });
      } else if (draggedJournalfoertDocuments.length > 0) {
        createVedlegg({
          oppgaveId,
          parentId: document.id,
          journalfoerteDokumenter: draggedJournalfoertDocuments,
          isFinished,
        });
      }
    }

    clearDragState();
  }, [
    oppgaveId,
    isDropTarget,
    clearDragState,
    draggedDocument,
    document.id,
    draggedJournalfoertDocuments,
    setParent,
    createVedlegg,
    isFinished,
  ]);

  return (
    <Box
      as="li"
      aria-setsize={setSize}
      aria-posinset={posInSet}
      position="absolute"
      marginInline="space-2"
      borderRadius="4"
      left="space-0"
      right="space-0"
      data-testid="new-documents-list-item"
      data-documentname={document.tittel}
      data-documentid={document.id}
      data-documenttype="parent"
      style={style}
    >
      <DropZone
        active={isDropTarget}
        icon={<PaperclipIcon aria-hidden />}
        label={`Vedlegg for «${document.tittel}»`}
        onDrop={onDrop}
      >
        <NewDocument document={document} />

        <AttachmentList parentDocument={document} {...listProps} />
      </DropZone>
    </Box>
  );
};

const isDroppableNewDocument = (dragged: IDocument | null, documentId: string): dragged is IDocument =>
  dragged !== null && !dragged.isMarkertAvsluttet && dragged.id !== documentId && dragged.parentId !== documentId;
