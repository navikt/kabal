import { HourglassIcon } from '@navikt/aksel-icons';
import React, { useCallback, useContext, useId, useRef } from 'react';
import styled from 'styled-components';
import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import {
  Fields,
  collapsedNewDocumentsGridCSS,
  expandedNewDocumentsGridCSS,
} from '@app/components/documents/new-documents/grid';
import { ToggleModalButton } from '@app/components/documents/new-documents/new-document/toggle-modal';
import { DocumentDate } from '@app/components/documents/new-documents/shared/document-date';
import { documentCSS } from '@app/components/documents/styled-components/document';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';
import { DocumentModalContent } from '../modal/modal-content';
import { SetDocumentType } from './set-type';
import { DocumentTitle } from './title';

interface Props {
  document: IMainDocument;
}

const EMPTY_LIST: IMainDocument[] = [];

export const NewDocument = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data = EMPTY_LIST, isLoading } = useGetDocumentsQuery(oppgaveId);
  const [isExpanded] = useIsExpanded();
  const cleanDragUI = useRef<() => void>(() => undefined);
  const { setDraggedDocument, clearDragState } = useContext(DragAndDropContext);

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
    [data, document, setDraggedDocument]
  );

  return (
    <StyledNewDocument
      $isExpanded={isExpanded}
      data-documentname={document.tittel}
      data-documentid={document.id}
      data-testid="new-document-list-item-content"
      data-documenttype={document.parentId === null ? 'parent' : 'attachment'}
      onDragStart={onDragStart}
      onDragEnd={() => {
        cleanDragUI.current();
        clearDragState();
      }}
      draggable={!document.isMarkertAvsluttet && !isLoading}
    >
      <DocumentTitle document={document} />
      {isExpanded ? <SetDocumentType document={document} /> : null}
      {isExpanded ? <StyledDate data-testid="new-document-date" document={document} /> : null}
      <ActionContent document={document} />
    </StyledNewDocument>
  );
};

const ActionContent = ({ document }: Props) => {
  const titleId = useId();

  if (document.isMarkertAvsluttet) {
    if (document.dokumentTypeId === DistribusjonsType.NOTAT) {
      return <StyledIcon title="Dokumentet er under journalføring." data-testid="document-archiving" />;
    }

    return <StyledIcon title="Dokumentet er under journalføring og utsending." data-testid="document-archiving" />;
  }

  return (
    <ToggleModalButton document={document} titleId={titleId}>
      <DocumentModalContent document={document} titleId={titleId} />
    </ToggleModalButton>
  );
};

const StyledIcon = styled(HourglassIcon)`
  grid-area: ${Fields.Action};
  justify-self: center;
`;

const StyledDate = styled(DocumentDate)`
  grid-area: ${Fields.Date};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledNewDocument = styled.article<{ $isExpanded: boolean }>`
  ${documentCSS}
  ${({ $isExpanded }) => ($isExpanded ? expandedNewDocumentsGridCSS : collapsedNewDocumentsGridCSS)}

  :hover {
    background-color: var(--a-surface-hover);
  }
`;
