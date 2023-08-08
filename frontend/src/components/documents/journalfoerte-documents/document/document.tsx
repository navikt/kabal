import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Skeleton } from '@navikt/ds-react';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { ExpandedColumns } from '@app/components/documents/journalfoerte-documents/document/expanded-columns';
import { SelectRow } from '@app/components/documents/journalfoerte-documents/document/shared/select-row';
import {
  Fields,
  collapsedJournalfoerteDocumentsGridCSS,
  expandedJournalfoerteDocumentsGridCSS,
} from '@app/components/documents/journalfoerte-documents/grid';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import {
  documentCSS,
  getBackgroundColor,
  getHoverBackgroundColor,
} from '@app/components/documents/styled-components/document';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useGetDocumentQuery, useGetJournalpostQuery } from '@app/redux-api/oppgaver/queries/documents';
import { IJournalpostReference } from '@app/types/documents/documents';
import { AttachmentList } from './attachments/attachment-list';
import { ExpandedDocument } from './expanded-document';
import { DocumentTitle } from './shared/document-title';
import { IncludeDocument } from './shared/include-document';

interface Props {
  journalpostReference: IJournalpostReference;
  isSelected: boolean;
}

export const Document = ({ journalpostReference, isSelected }: Props) => {
  const { data: oppgave } = useOppgave();
  const [documentExpanded, setDocumentExpanded] = useState(false);

  const { journalpostId, dokumentInfoId } = journalpostReference;

  const { data: journalpost } = useGetJournalpostQuery(journalpostId);
  const { data: document } = useGetDocumentQuery({ journalpostId, dokumentInfoId });

  const [listExpanded] = useIsExpanded();

  const { getSelectedDocuments } = useContext(SelectContext);
  const { setDraggedJournalfoertDocuments, clearDragState } = useContext(DragAndDropContext);

  const cleanDragUI = useRef<() => void>(() => undefined);

  const toggleExpanded = () => setDocumentExpanded(!documentExpanded);
  const Icon = documentExpanded ? ChevronUpIcon : ChevronDownIcon;

  const onDragStart = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.clearData();

      if (document === undefined) {
        return;
      }

      const docs = isSelected ? await getSelectedDocuments() : [document];

      if (docs.length === 0) {
        return;
      }

      cleanDragUI.current = createDragUI(
        docs.map((d) => d.title ?? ''),
        e,
      );

      e.dataTransfer.effectAllowed = 'link';
      e.dataTransfer.dropEffect = 'link';
      setDraggedJournalfoertDocuments(docs);
    },
    [document, isSelected, getSelectedDocuments, setDraggedJournalfoertDocuments],
  );

  if (oppgave === undefined) {
    return null;
  }

  const checked = oppgave.relevantDocumentIdList.includes(dokumentInfoId);

  const hasDocumentData = document !== undefined;
  const hasJournalpostData = journalpost !== undefined;

  return (
    <>
      <StyledJournalfoertDocument
        $documentExpanded={documentExpanded}
        $listExpanded={listExpanded}
        $selected={isSelected}
        data-testid="document-journalfoert"
        data-journalpostid={journalpostReference}
        data-dokumentinfoid={dokumentInfoId}
        data-documentname={document?.title ?? ''}
        onDragStart={onDragStart}
        onDragEnd={() => {
          cleanDragUI.current();
          clearDragState();
        }}
        draggable
      >
        <SelectRow journalpostId={journalpostId} dokumentInfoId={dokumentInfoId} />
        {listExpanded ? (
          <ExpandButton variant="tertiary" size="small" icon={<Icon aria-hidden />} onClick={toggleExpanded} />
        ) : null}
        {hasDocumentData ? (
          <DocumentTitle
            journalpostId={journalpostId}
            dokumentInfoId={dokumentInfoId}
            harTilgangTilArkivvariant={hasDocumentData && document.harTilgangTilArkivvariant}
            tittel={document.title ?? ''}
          />
        ) : (
          <Skeleton variant="text" />
        )}

        {listExpanded ? <ExpandedColumns journalpost={journalpost} /> : null}

        <IncludeDocument
          dokumentInfoId={dokumentInfoId}
          journalpostId={journalpostId}
          harTilgangTilArkivvariant={hasDocumentData && document.harTilgangTilArkivvariant}
          name={document?.title ?? ''}
          oppgavebehandlingId={oppgave.id}
          checked={checked}
        />
      </StyledJournalfoertDocument>
      {documentExpanded && listExpanded && hasJournalpostData ? <ExpandedDocument journalpost={journalpost} /> : null}
      {hasJournalpostData ? <AttachmentList journalpost={journalpost} oppgaveId={oppgave.id} /> : null}
    </>
  );
};

const ExpandButton = styled(Button)`
  grid-area: ${Fields.Expand};
`;

const StyledJournalfoertDocument = styled.article<{
  $documentExpanded: boolean;
  $selected: boolean;
  $listExpanded: boolean;
}>`
  ${documentCSS}
  ${({ $listExpanded }) =>
    $listExpanded ? expandedJournalfoerteDocumentsGridCSS : collapsedJournalfoerteDocumentsGridCSS}
  background-color: ${({ $documentExpanded, $selected }) => getBackgroundColor($documentExpanded, $selected)};

  &:hover {
    background-color: ${({ $documentExpanded, $selected }) => getHoverBackgroundColor($documentExpanded, $selected)};
  }
`;
