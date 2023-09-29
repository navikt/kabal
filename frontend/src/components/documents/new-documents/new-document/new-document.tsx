import React, { useCallback, useContext, useRef } from 'react';
import { styled } from 'styled-components';
import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import {
  Fields,
  collapsedNewDocumentsGridCSS,
  expandedNewDocumentsGridCSS,
} from '@app/components/documents/new-documents/grid';
import { useCanDragNewDocument } from '@app/components/documents/new-documents/hooks/use-can-drag-new-document';
import { OpenModalButton } from '@app/components/documents/new-documents/new-document/open-modal-button';
import { DocumentDate } from '@app/components/documents/new-documents/shared/document-date';
import { documentCSS } from '@app/components/documents/styled-components/document';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useContainsRolAttachments } from '@app/hooks/use-contains-rol-attachments';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';
import { SetDocumentType } from './set-type';
import { DocumentTitle } from './title';

interface Props {
  document: IMainDocument;
  parentDocument?: IMainDocument;
}

const EMPTY_LIST: IMainDocument[] = [];

export const NewDocument = ({ document, parentDocument }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data = EMPTY_LIST } = useGetDocumentsQuery(oppgaveId);
  const [isExpanded] = useIsExpanded();
  const cleanDragUI = useRef<() => void>(() => undefined);
  const { setDraggedDocument, clearDragState } = useContext(DragAndDropContext);
  const canDragDocument = useCanDragNewDocument(document, parentDocument);
  const containsRolAttachments = useContainsRolAttachments(document);
  const isDraggable = canDragDocument && !containsRolAttachments;

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
      {isExpanded ? <SetDocumentType document={document} /> : null}
      {isExpanded && document.type === DocumentTypeEnum.JOURNALFOERT ? (
        <StyledDate data-testid="new-document-date" document={document} />
      ) : null}
      <OpenModalButton document={document} />
    </StyledNewDocument>
  );
};

const StyledDate = styled(DocumentDate)`
  grid-area: ${Fields.Date};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledNewDocument = styled.article<{ $isExpanded: boolean }>`
  ${documentCSS}
  ${({ $isExpanded }) => ($isExpanded ? expandedNewDocumentsGridCSS : collapsedNewDocumentsGridCSS)}

  &:hover {
    background-color: var(--a-surface-hover);
  }
`;
