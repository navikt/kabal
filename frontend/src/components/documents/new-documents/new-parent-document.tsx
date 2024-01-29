import { skipToken } from '@reduxjs/toolkit/query';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { UserContext } from '@app/components/app/user';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanDropOnDocument } from '@app/hooks/use-can-document/use-can-drop-on-document';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import {
  useCreateVedleggFromJournalfoertDocumentMutation,
  useSetParentMutation,
} from '@app/redux-api/oppgaver/mutations/documents';
import { CreatorRole, IMainDocument } from '@app/types/documents/documents';
import { AttachmentList, ListProps } from './attachment-list';
import { NewDocument } from './new-document/new-document';

interface Props extends ListProps {
  document: IMainDocument;
  style: React.CSSProperties;
}

export const NewParentDocument = ({ document, style, ...listProps }: Props) => {
  const user = useContext(UserContext);
  const isRol = useIsRol();
  const oppgaveId = useOppgaveId();
  const [createVedlegg] = useCreateVedleggFromJournalfoertDocumentMutation({
    fixedCacheKey: `createVedlegg-${document.id}`,
  });
  const [setParent] = useSetParentMutation();
  const [isDragOver, setIsDragOver] = useState(false);
  const dragEnterCount = useRef(0);
  const { draggedDocument, draggedJournalfoertDocuments, clearDragState } = useContext(DragAndDropContext);
  const isDropTarget = useCanDropOnDocument(document);
  const isFinished = useIsFullfoert();

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLIElement>) => {
      e.preventDefault();

      dragEnterCount.current = 0;

      setIsDragOver(false);

      if (oppgaveId !== skipToken && isDropTarget) {
        if (isDroppableNewDocument(draggedDocument, document.id)) {
          setParent({ dokumentId: draggedDocument.id, oppgaveId, parentId: document.id });
        } else if (draggedJournalfoertDocuments.length !== 0) {
          createVedlegg({
            oppgaveId,
            parentId: document.id,
            journalfoerteDokumenter: draggedJournalfoertDocuments,
            creatorIdent: user.navIdent,
            creatorRole: isRol ? CreatorRole.KABAL_ROL : CreatorRole.KABAL_SAKSBEHANDLING,
            isFinished,
          });
        }
      }

      clearDragState();
    },
    [
      oppgaveId,
      isDropTarget,
      clearDragState,
      draggedDocument,
      document.id,
      draggedJournalfoertDocuments,
      setParent,
      createVedlegg,
      user.navIdent,
      isRol,
      isFinished,
    ],
  );

  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLLIElement>) => {
      e.preventDefault();
      e.stopPropagation();

      dragEnterCount.current += 1;

      setIsDragOver(isDropTarget);
    },
    [isDropTarget],
  );

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dragEnterCount.current -= 1;

    if (dragEnterCount.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  return (
    <StyledParentDocumentListItem
      data-testid="new-documents-list-item"
      data-documentname={document.tittel}
      data-documentid={document.id}
      data-documenttype="parent"
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      $isDropTarget={isDropTarget}
      $isDragOver={isDragOver}
      style={style}
    >
      <NewDocument
        document={document}
        containsRolAttachments={listProps.containsRolAttachments}
        hasAttachments={listProps.hasAttachments}
      />

      <AttachmentList parentDocument={document} {...listProps} />
    </StyledParentDocumentListItem>
  );
};

const isDroppableNewDocument = (dragged: IMainDocument | null, documentId: string): dragged is IMainDocument =>
  dragged !== null && !dragged.isMarkertAvsluttet && dragged.id !== documentId && dragged.parentId !== documentId;

const StyledDocumentListItem = styled.li`
  display: block;
  margin-left: 2px;
  margin-right: 2px;
  border-radius: var(--a-border-radius-medium);
`;

interface IDragOver {
  $isDropTarget: boolean;
  $isDragOver: boolean;
}

const StyledParentDocumentListItem = styled(StyledDocumentListItem)<IDragOver>`
  position: absolute;
  left: 0;
  right: 0;

  &::after {
    display: ${({ $isDropTarget }) => ($isDropTarget ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
    padding: 16px;
    content: 'Vedlegg for «' attr(data-documentname) '»';
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: var(--a-border-radius-medium);
    outline: 2px dashed var(--a-border-action);
    font-size: 18px;
    font-weight: bold;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ $isDragOver }) => ($isDragOver ? 'rgba(153, 195, 255, 0.5)' : 'rgba(230, 240, 255, 0.5)')};
    text-shadow:
      1px 1px white,
      -1px -1px white;
    backdrop-filter: blur(2px);
  }
`;
