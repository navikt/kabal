import { DragAndDropContext } from '@app/components/documents/drag-context';
import { DropZone } from '@app/components/documents/new-documents/shared/drop-zone';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanDropOnDocument } from '@app/hooks/use-can-document/use-can-drop-on-document';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import {
  useCreateVedleggFromJournalfoertDocumentMutation,
  useSetParentMutation,
} from '@app/redux-api/oppgaver/mutations/documents';
import type { IDocument, IParentDocument } from '@app/types/documents/documents';
import { PaperclipIcon } from '@navikt/aksel-icons';
import { BoxNew } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext } from 'react';
import { AttachmentList, type ListProps } from './attachment-list';
import { NewDocument } from './new-document/new-document';

interface Props extends ListProps {
  document: IParentDocument;
  style: React.CSSProperties;
}

export const NewParentDocument = ({ document, style, ...listProps }: Props) => {
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
    <BoxNew
      as="li"
      position="absolute"
      marginInline="05"
      borderRadius="medium"
      left="0"
      right="0"
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
    </BoxNew>
  );
};

const isDroppableNewDocument = (dragged: IDocument | null, documentId: string): dragged is IDocument =>
  dragged !== null && !dragged.isMarkertAvsluttet && dragged.id !== documentId && dragged.parentId !== documentId;
