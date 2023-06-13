import { TrashIcon } from '@navikt/aksel-icons';
import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useDeleteDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { DragAndDropTypesEnum } from '@app/types/drag-and-drop';

interface DeleteDropAreaProps {
  isDragOver: boolean;
}

export const DeleteDropArea = ({ isDragOver }: DeleteDropAreaProps) => {
  const dragEnterCount = useRef(0);
  const [isActive, setIsActive] = useState(false);
  const [deleteDocument, { isLoading }] = useDeleteDocumentMutation();
  const oppgaveId = useOppgaveId();
  const { data: documentList = [] } = useGetDocumentsQuery(oppgaveId);
  const removeSmartDocument = useRemoveDocument();

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragEnterCount.current += 1;

    setIsActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragEnterCount.current -= 1;

    if (dragEnterCount.current === 0) {
      setIsActive(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      dragEnterCount.current = 0;
      setIsActive(false);

      if (oppgaveId === skipToken) {
        return;
      }

      const [dokumentId, type] = getDocumentId(e);

      if (dokumentId.length === 0) {
        return;
      }

      if (type === DragAndDropTypesEnum.DOCUMENT) {
        const smartDocument = documentList.find((d) => d.id === dokumentId && d.type === DocumentTypeEnum.SMART);

        if (smartDocument !== undefined) {
          removeSmartDocument(dokumentId, smartDocument);
        }
      }
      deleteDocument({ oppgaveId, dokumentId });
    },
    [deleteDocument, documentList, oppgaveId, removeSmartDocument]
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
      $isDragOver={isDragOver}
      $isActive={isActive}
    >
      <TrashIcon aria-hidden />
      <span>Slipp her for å slette</span>
      {isLoading ? <Loader /> : null}
    </DeleteDropAreaContainer>
  );
};

const getDocumentId = (e: React.DragEvent<HTMLDivElement>): [string, DragAndDropTypesEnum] | ['', null] => {
  if (e.dataTransfer.types.includes(DragAndDropTypesEnum.JOURNALFOERT_DOCUMENT_REFERENCE)) {
    return [
      e.dataTransfer.getData(DragAndDropTypesEnum.JOURNALFOERT_DOCUMENT_REFERENCE),
      DragAndDropTypesEnum.JOURNALFOERT_DOCUMENT_REFERENCE,
    ];
  }

  if (e.dataTransfer.types.includes(DragAndDropTypesEnum.DOCUMENT)) {
    return [e.dataTransfer.getData(DragAndDropTypesEnum.DOCUMENT), DragAndDropTypesEnum.DOCUMENT];
  }

  return ['', null];
};

const DeleteDropAreaContainer = styled.div<{ $isDragOver: boolean; $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 8px;
  flex-grow: 0;
  flex-shrink: 0;
  padding-left: 48px;
  padding-right: 48px;
  white-space: nowrap;
  height: 100%;
  border-radius: 4px;
  color: ${({ $isActive }) => ($isActive ? 'var(--a-text-on-danger)' : 'var(--a-text-default)')};
  background-color: ${({ $isActive }) => ($isActive ? 'var(--a-surface-danger)' : 'transparent')};
  border: 2px dashed var(--a-surface-danger);
  transition: opacity 0.2s ease-in-out;
  opacity: ${({ $isDragOver }) => ($isDragOver ? 1 : 0)};
`;
