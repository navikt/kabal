import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useCallback, useRef, useState } from 'react';
import { parseJSON } from '@app/functions/parse-json';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import {
  useCreateVedleggFromJournalfoertDocumentMutation,
  useSetParentMutation,
} from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { IMainDocument } from '@app/types/documents/documents';
import { DragAndDropTypesEnum } from '@app/types/drag-and-drop';
import { StyledDocumentListItem } from '../styled-components/document-list';
import { AttachmentList } from './attachment-list';
import { NewDocument } from './new-document';

interface Props {
  document: IMainDocument;
}

export const NewParentDocument = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const [createVedlegg] = useCreateVedleggFromJournalfoertDocumentMutation();
  const [setParent] = useSetParentMutation();
  const { data: documentList } = useGetDocumentsQuery(oppgaveId);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragEnterCount = useRef(0);

  const isSelfOrVedlegg = useCallback(
    (droppedId: string) => {
      if (document.id === droppedId) {
        return true;
      }

      for (const d of documentList ?? []) {
        if (d.id === droppedId && d.parentId === document.id) {
          return true;
        }
      }

      return false;
    },
    [document.id, documentList]
  );

  const onDropDocument = useCallback(
    (droppedId: string) => {
      if (oppgaveId === skipToken || isSelfOrVedlegg(droppedId)) {
        return;
      }

      setParent({ dokumentId: droppedId, oppgaveId, parentId: document.id });
    },
    [document.id, isSelfOrVedlegg, oppgaveId, setParent]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLIElement>) => {
      e.preventDefault();

      dragEnterCount.current = 0;

      setIsDragOver(false);

      if (oppgaveId === skipToken) {
        return;
      }

      const { types } = e.dataTransfer;

      if (types.includes(DragAndDropTypesEnum.DOCUMENT)) {
        const dokumentId = e.dataTransfer.getData(DragAndDropTypesEnum.DOCUMENT);
        onDropDocument(dokumentId);

        return;
      }

      if (types.includes(DragAndDropTypesEnum.JOURNALFOERT_DOCUMENT_REFERENCE)) {
        const dokumentId = e.dataTransfer.getData(DragAndDropTypesEnum.JOURNALFOERT_DOCUMENT_REFERENCE);
        onDropDocument(dokumentId);

        return;
      }

      if (types.includes(DragAndDropTypesEnum.JOURNALFOERT_DOCUMENT)) {
        const json = e.dataTransfer.getData(DragAndDropTypesEnum.JOURNALFOERT_DOCUMENT);
        const journalfoerteDokumenter = parseJSON<IArkivertDocument[]>(json);

        if (journalfoerteDokumenter === null) {
          return;
        }

        createVedlegg({ oppgaveId, parentId: document.id, journalfoerteDokumenter });
      }
    },
    [createVedlegg, document.id, onDropDocument, oppgaveId]
  );

  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLLIElement>) => {
      e.preventDefault();
      e.stopPropagation();

      dragEnterCount.current += 1;

      const { types } = e.dataTransfer;

      if (types.includes(DragAndDropTypesEnum.DOCUMENT)) {
        const dokumentId = e.dataTransfer.getData(DragAndDropTypesEnum.DOCUMENT);
        setIsDragOver(!isSelfOrVedlegg(dokumentId));

        return;
      }

      if (types.includes(DragAndDropTypesEnum.JOURNALFOERT_DOCUMENT_REFERENCE)) {
        const dokumentId = e.dataTransfer.getData(DragAndDropTypesEnum.JOURNALFOERT_DOCUMENT_REFERENCE);
        setIsDragOver(!isSelfOrVedlegg(dokumentId));

        return;
      }

      if (types.includes(DragAndDropTypesEnum.JOURNALFOERT_DOCUMENT)) {
        const json = e.dataTransfer.getData(DragAndDropTypesEnum.JOURNALFOERT_DOCUMENT);
        const archivedDocuments = parseJSON<IArkivertDocument[]>(json);
        setIsDragOver(archivedDocuments !== null);
      }
    },
    [isSelfOrVedlegg]
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
    <StyledDocumentListItem
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
      $isActive={isDragOver}
    >
      <NewDocument document={document} />
      <AttachmentList parentId={document.id} />
    </StyledDocumentListItem>
  );
};
