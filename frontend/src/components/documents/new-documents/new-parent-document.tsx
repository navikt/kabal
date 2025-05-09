import { StaticDataContext } from '@app/components/app/static-data-context';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { DropZone } from '@app/components/documents/new-documents/shared/drop-zone';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanDropOnDocument } from '@app/hooks/use-can-document/use-can-drop-on-document';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import {
  useCreateVedleggFromJournalfoertDocumentMutation,
  useSetParentMutation,
} from '@app/redux-api/oppgaver/mutations/documents';
import { CreatorRole, type IMainDocument } from '@app/types/documents/documents';
import { PaperclipIcon } from '@navikt/aksel-icons';
import { Box } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext } from 'react';
import { AttachmentList, type ListProps } from './attachment-list';
import { NewDocument } from './new-document/new-document';

interface Props extends ListProps {
  document: IMainDocument;
  style: React.CSSProperties;
}

export const NewParentDocument = ({ document, style, ...listProps }: Props) => {
  const { user } = useContext(StaticDataContext);
  const isRol = useIsRol();
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
          creator: {
            employee: {
              navIdent: user.navIdent,
              navn: user.navn,
            },
            creatorRole: isRol ? CreatorRole.KABAL_ROL : CreatorRole.KABAL_SAKSBEHANDLING,
          },
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
    user.navIdent,
    user.navn,
    isRol,
    isFinished,
  ]);

  return (
    <Box
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
        <NewDocument
          document={document}
          containsRolAttachments={listProps.containsRolAttachments}
          hasAttachments={listProps.hasAttachments}
        />

        <AttachmentList parentDocument={document} {...listProps} />
      </DropZone>
    </Box>
  );
};

const isDroppableNewDocument = (dragged: IMainDocument | null, documentId: string): dragged is IMainDocument =>
  dragged !== null && !dragged.isMarkertAvsluttet && dragged.id !== documentId && dragged.parentId !== documentId;
