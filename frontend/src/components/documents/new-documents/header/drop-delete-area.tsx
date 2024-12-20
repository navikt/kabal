import { DragAndDropContext } from '@app/components/documents/drag-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEditDocument } from '@app/hooks/use-can-document/use-can-edit-document';
import { useAttachments, useParentDocument } from '@app/hooks/use-parent-document';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useDeleteDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { CreatorRole, DocumentTypeEnum } from '@app/types/documents/documents';
import { TrashIcon } from '@navikt/aksel-icons';
import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext, useRef, useState } from 'react';
import { styled } from 'styled-components';

export const DeleteDropArea = () => {
  const dragEnterCount = useRef(0);
  const [isDropOver, setIsDropOver] = useState(false);
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

  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragEnterCount.current += 1;

      setIsDropOver(isDropTarget);
    },
    [isDropTarget],
  );

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragEnterCount.current -= 1;

    if (dragEnterCount.current === 0) {
      setIsDropOver(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      dragEnterCount.current = 0;
      setIsDropOver(false);

      if (isDropTarget && oppgaveId !== skipToken && draggedDocument !== null) {
        if (draggedDocument.type === DocumentTypeEnum.SMART) {
          removeSmartDocument(draggedDocument.id, draggedDocument);
        }
        deleteDocument({ oppgaveId, dokumentId: draggedDocument.id });
      }

      clearDragState();
    },
    [clearDragState, deleteDocument, draggedDocument, isDropTarget, oppgaveId, removeSmartDocument],
  );

  return (
    <DeleteDropAreaContainer
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={onDrop}
      $isDropTarget={isDropTarget}
      $isDragOver={isDropOver}
    >
      <TrashIcon aria-hidden />
      <span>Slett</span>
      {isLoading ? <Loader /> : null}
    </DeleteDropAreaContainer>
  );
};

const DeleteDropAreaContainer = styled.div<{ $isDropTarget: boolean; $isDragOver: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: var(--a-spacing-2);
  flex-grow: 0;
  flex-shrink: 0;
  padding-left: var(--a-spacing-12);
  padding-right: var(--a-spacing-12);
  margin-right: var(--a-spacing-2);
  white-space: nowrap;
  height: 100%;
  transition-property: opacity;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  border-radius: var(--a-border-radius-medium);
  outline: var(--a-spacing-05) dashed var(--a-surface-danger);
  font-size: 18px;
  font-weight: bold;

  opacity: ${({ $isDropTarget }) => ($isDropTarget ? 1 : 0)};

  color: ${({ $isDragOver }) => ($isDragOver ? 'var(--a-text-on-danger)' : 'var(--a-text-default)')};
  background-color: ${({ $isDragOver }) => ($isDragOver ? 'var(--a-surface-danger)' : 'var(--a-surface-danger-subtle)')};
`;
