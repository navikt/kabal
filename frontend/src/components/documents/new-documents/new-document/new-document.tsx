import React, { useCallback, useContext, useRef } from 'react';
import { styled } from 'styled-components';
import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import {
  COLLAPSED_NEW_DOCUMENT_FIELDS,
  EXPANDED_NEW_ATTACHMENT_FIELDS,
  EXPANDED_NEW_DOCUMENT_FIELDS,
  Fields,
  getFieldNames,
  getFieldSizes,
} from '@app/components/documents/new-documents/grid';
import { OpenModalButton } from '@app/components/documents/new-documents/new-document/open-modal-button';
import { DocumentDate } from '@app/components/documents/new-documents/shared/document-date';
import { documentCSS } from '@app/components/documents/styled-components/document';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEditDocument } from '@app/hooks/use-can-edit-document';
import { useContainsRolAttachments } from '@app/hooks/use-contains-rol-attachments';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';
import { SetDocumentType } from './set-type';
import { DocumentTitle } from './title';

interface Props {
  document: IMainDocument;
}

const EMPTY_LIST: IMainDocument[] = [];

export const NewDocument = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data = EMPTY_LIST } = useGetDocumentsQuery(oppgaveId);
  const [isExpanded] = useIsExpanded();
  const isAttachment = document.parentId !== null;
  const cleanDragUI = useRef<() => void>(() => undefined);
  const { setDraggedDocument, clearDragState } = useContext(DragAndDropContext);
  const canEdit = useCanEditDocument(document);
  const containsRolAttachments = useContainsRolAttachments(document);
  const isDraggable = canEdit && !containsRolAttachments;

  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (document.parentId === null) {
        const titles: string[] = [document.tittel];

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
    [data, document, setDraggedDocument],
  );

  return (
    <StyledNewDocument
      $isExpanded={isExpanded}
      $isAttachment={isAttachment}
      data-documentname={document.tittel}
      data-documentid={document.id}
      data-testid="new-document-list-item-content"
      data-documenttype={document.parentId === null ? 'parent' : 'attachment'}
      onDragStart={isDraggable ? onDragStart : (e) => e.preventDefault()}
      onDragEnd={() => {
        cleanDragUI.current();
        clearDragState();
      }}
      draggable={isDraggable}
    >
      <DocumentTitle document={document} />
      {isExpanded && !isAttachment ? <SetDocumentType {...document} templateId={document.templateId} /> : null}
      {isExpanded && document.type === DocumentTypeEnum.JOURNALFOERT ? (
        <StyledDate data-testid="new-document-date" document={document} />
      ) : null}
      <OpenModalButton document={document} />
    </StyledNewDocument>
  );
};

const StyledDate = styled(DocumentDate)`
  grid-area: ${Fields.TypeOrDate};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const getGridFields = ({ $isExpanded, $isAttachment }: StlyedNewDocumentProps) => {
  if (!$isExpanded) {
    return COLLAPSED_NEW_DOCUMENT_FIELDS;
  }

  return $isAttachment ? EXPANDED_NEW_ATTACHMENT_FIELDS : EXPANDED_NEW_DOCUMENT_FIELDS;
};

interface StlyedNewDocumentProps {
  $isExpanded: boolean;
  $isAttachment: boolean;
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
