import { skipToken } from '@reduxjs/toolkit/query';
import React, { memo, useCallback, useContext, useRef } from 'react';
import { styled } from 'styled-components';
import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import {
  COLLAPSED_NEW_DOCUMENT_FIELDS,
  EXPANDED_NEW_DOCUMENT_FIELDS,
  getFieldNames,
  getFieldSizes,
} from '@app/components/documents/new-documents/grid';
import { ArchivingIcon, OpenModalButton } from '@app/components/documents/new-documents/new-document/open-modal-button';
import { documentCSS } from '@app/components/documents/styled-components/document';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEditDocument } from '@app/hooks/use-can-edit-document';
import { useLazyGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { IMainDocument } from '@app/types/documents/documents';
import { SetDocumentType } from './set-type';
import { DocumentTitle } from './title';

interface Props {
  document: IMainDocument;
  containsRolAttachments: boolean;
}

export const NewDocument = memo(
  ({ document, containsRolAttachments }: Props) => {
    const oppgaveId = useOppgaveId();
    const [getDocuments] = useLazyGetDocumentsQuery();
    const [isExpanded] = useIsExpanded();
    const cleanDragUI = useRef<() => void>(() => undefined);
    const { setDraggedDocument, clearDragState, draggingEnabled } = useContext(DragAndDropContext);
    const canEdit = useCanEditDocument(document);

    const isDraggable = draggingEnabled && canEdit && !containsRolAttachments;

    const onDragStart = useCallback(
      async (e: React.DragEvent<HTMLDivElement>) => {
        if (oppgaveId === skipToken) {
          return;
        }

        if (document.parentId === null) {
          const titles: string[] = [document.tittel];

          const data = await getDocuments(oppgaveId, true).unwrap();

          for (const d of data) {
            if (d.parentId === document.id) {
              titles.push(d.tittel);
            }
          }

          cleanDragUI.current = createDragUI(titles, e);
        } else {
          cleanDragUI.current = createDragUI([document.tittel], e);
        }

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.dropEffect = 'move';
        setDraggedDocument(document);
      },
      [document, getDocuments, oppgaveId, setDraggedDocument],
    );

    return (
      <StyledNewDocument
        $isExpanded={isExpanded}
        data-documentname={document.tittel}
        data-documentid={document.id}
        data-testid="new-document-list-item-content"
        data-documenttype="parent"
        onDragStart={isDraggable ? onDragStart : (e) => e.preventDefault()}
        onDragEnd={() => {
          cleanDragUI.current();
          clearDragState();
        }}
        draggable={isDraggable}
      >
        <DocumentTitle document={document} />
        {isExpanded ? <SetDocumentType document={document} /> : null}
        {document.isMarkertAvsluttet ? (
          <ArchivingIcon dokumentTypeId={document.dokumentTypeId} />
        ) : (
          <OpenModalButton document={document} containsRolAttachments={containsRolAttachments} />
        )}
      </StyledNewDocument>
    );
  },
  (prev, next) =>
    prev.document.id === next.document.id &&
    prev.document.tittel === next.document.tittel &&
    prev.document.dokumentTypeId === next.document.dokumentTypeId &&
    prev.document.isMarkertAvsluttet === next.document.isMarkertAvsluttet &&
    prev.document.parentId === next.document.parentId &&
    prev.containsRolAttachments === next.containsRolAttachments,
);

NewDocument.displayName = 'NewDocument';

const getGridFields = ({ $isExpanded }: StlyedNewDocumentProps) =>
  $isExpanded ? EXPANDED_NEW_DOCUMENT_FIELDS : COLLAPSED_NEW_DOCUMENT_FIELDS;

interface StlyedNewDocumentProps {
  $isExpanded: boolean;
}

const StyledNewDocument = styled.article<StlyedNewDocumentProps>`
  ${documentCSS}
  display: grid;
  grid-column-gap: 8px;
  align-items: center;
  padding-left: 6px;
  padding-right: 0;
  grid-template-columns: ${(props) => getFieldSizes(getGridFields(props))};
  grid-template-areas: '${(props) => getFieldNames(getGridFields(props))}';

  &:hover {
    background-color: var(--a-surface-hover);
  }
`;
