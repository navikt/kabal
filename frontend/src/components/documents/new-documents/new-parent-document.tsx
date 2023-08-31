import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsRol } from '@app/hooks/use-is-rol';
import {
  useCreateVedleggFromJournalfoertDocumentMutation,
  useSetParentMutation,
} from '@app/redux-api/oppgaver/mutations/documents';
import { IMainDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { AttachmentList } from './attachment-list';
import { NewDocument } from './new-document/new-document';

interface Props {
  document: IMainDocument;
}

export const NewParentDocument = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const [createVedlegg] = useCreateVedleggFromJournalfoertDocumentMutation();
  const [setParent] = useSetParentMutation();
  const [isDragOver, setIsDragOver] = useState(false);
  const dragEnterCount = useRef(0);
  const { draggedDocument, draggedJournalfoertDocuments, clearDragState } = useContext(DragAndDropContext);
  const isRol = useIsRol();

  const isAllowedToDrop = useCallback(
    (dragged: IMainDocument | null): dragged is IMainDocument => {
      if (dragged === null || dragged.id === document.id || dragged.parentId === document.id) {
        return false;
      }

      return true;
    },
    [document.id],
  );

  const isDropTarget = useMemo(() => {
    const isAllowed = draggedJournalfoertDocuments.length !== 0 || isAllowedToDrop(draggedDocument);

    if (!isRol) {
      return isAllowed;
    }

    return (
      isAllowed &&
      document.isSmartDokument &&
      document.templateId === TemplateIdEnum.ROL_NOTAT &&
      !document.isMarkertAvsluttet
    );
  }, [isRol, document, draggedJournalfoertDocuments.length, isAllowedToDrop, draggedDocument]);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLIElement>) => {
      e.preventDefault();

      dragEnterCount.current = 0;

      setIsDragOver(false);

      if (oppgaveId !== skipToken && isDropTarget) {
        if (isAllowedToDrop(draggedDocument)) {
          setParent({ dokumentId: draggedDocument.id, oppgaveId, parentId: document.id });
        } else if (draggedJournalfoertDocuments.length !== 0) {
          createVedlegg({ oppgaveId, parentId: document.id, journalfoerteDokumenter: draggedJournalfoertDocuments });
        }
      }

      clearDragState();
    },
    [
      oppgaveId,
      isDropTarget,
      clearDragState,
      isAllowedToDrop,
      draggedDocument,
      draggedJournalfoertDocuments,
      setParent,
      document.id,
      createVedlegg,
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
    >
      <NewDocument document={document} rolCanDrag={false} />
      <AttachmentList parentDocument={document} />
    </StyledParentDocumentListItem>
  );
};

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
  position: relative;

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
