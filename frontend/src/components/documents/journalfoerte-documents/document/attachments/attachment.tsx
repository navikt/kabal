import { Skeleton } from '@navikt/ds-react';
import React, { memo, useCallback, useContext, useRef } from 'react';
import { styled } from 'styled-components';
import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import {
  Fields,
  documentsGridCSS,
  getFieldNames,
  getFieldSizes,
} from '@app/components/documents/journalfoerte-documents/grid';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import {
  documentCSS,
  getBackgroundColor,
  getHoverBackgroundColor,
} from '@app/components/documents/styled-components/document';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useGetDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTitle } from '../shared/document-title';
import { IncludeDocument } from '../shared/include-document';
import { SelectRow } from '../shared/select-row';

interface Props {
  oppgavebehandlingId: string;
  journalpostId: string;
  dokumentInfoId: string;
  isSelected: boolean;
}

export const Attachment = memo(
  ({ oppgavebehandlingId, dokumentInfoId, journalpostId, isSelected }: Props) => {
    const { data: oppgave } = useOppgave();
    const { data } = useGetDocumentQuery({ journalpostId, dokumentInfoId });
    const hasData = data !== undefined;
    const { getSelectedDocuments } = useContext(SelectContext);
    const cleanDragUI = useRef<() => void>(() => undefined);
    const { setDraggedJournalfoertDocuments, clearDragState } = useContext(DragAndDropContext);

    const onDragStart = useCallback(
      async (e: React.DragEvent<HTMLDivElement>) => {
        if (isSelected) {
          const docs = await getSelectedDocuments();

          cleanDragUI.current = createDragUI(
            docs.map((d) => d.title ?? 'Ukjent dokument'),
            e,
          );

          e.dataTransfer.effectAllowed = 'link';
          e.dataTransfer.dropEffect = 'link';
          setDraggedJournalfoertDocuments(docs);

          return;
        }

        if (data === undefined) {
          return;
        }

        cleanDragUI.current = createDragUI([data.title ?? 'Ukjent dokument'], e);

        e.dataTransfer.effectAllowed = 'link';
        e.dataTransfer.dropEffect = 'link';
        setDraggedJournalfoertDocuments([data]);
      },
      [data, getSelectedDocuments, isSelected, setDraggedJournalfoertDocuments],
    );

    return (
      <StyledVedlegg
        key={dokumentInfoId}
        data-testid="oppgavebehandling-documents-all-list-item"
        data-journalpostid={journalpostId}
        data-dokumentinfoid={dokumentInfoId}
        data-documentname={data?.title}
        $selected={isSelected}
        onDragStart={onDragStart}
        onDragEnd={() => {
          cleanDragUI.current();
          clearDragState();
        }}
        draggable
      >
        <SelectRow journalpostId={journalpostId} dokumentInfoId={dokumentInfoId} />
        {hasData ? (
          <DocumentTitle
            journalpostId={journalpostId}
            dokumentInfoId={dokumentInfoId}
            tittel={data.title ?? ''}
            harTilgangTilArkivvariant={data.harTilgangTilArkivvariant}
          />
        ) : (
          <Skeleton variant="text" />
        )}
        {hasData ? (
          <IncludeDocument
            dokumentInfoId={dokumentInfoId}
            journalpostId={journalpostId}
            harTilgangTilArkivvariant={data.harTilgangTilArkivvariant}
            name={data.title ?? ''}
            oppgavebehandlingId={oppgavebehandlingId}
            checked={oppgave?.relevantDocumentIdList.includes(dokumentInfoId) ?? false}
          />
        ) : (
          <Skeleton variant="text" />
        )}
      </StyledVedlegg>
    );
  },
  (prevProps, nextProps) =>
    prevProps.isSelected === nextProps.isSelected && prevProps.dokumentInfoId === nextProps.dokumentInfoId,
);

Attachment.displayName = 'Attachment';

const VEDLEGG_FIELDS = [Fields.SelectRow, Fields.Title, Fields.Action];

const StyledVedlegg = styled.article<{ $selected: boolean }>`
  ${documentCSS}
  ${documentsGridCSS}
  grid-template-columns: ${getFieldSizes(VEDLEGG_FIELDS)};
  grid-template-areas: '${getFieldNames(VEDLEGG_FIELDS)}';

  background-color: ${({ $selected }) => getBackgroundColor(false, $selected)};

  &:hover {
    background-color: ${({ $selected }) => getHoverBackgroundColor(false, $selected)};
  }
`;
