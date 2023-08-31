import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { DocumentList } from '@app/components/documents/journalfoerte-documents/document-list';
import { Header } from '@app/components/documents/journalfoerte-documents/header/header';
import { SelectContextElement } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { commonStyles } from '@app/components/documents/styled-components/container';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { useFilters } from './header/use-filters';
import { JournalfoertHeading } from './heading/heading';
import { LoadMore } from './load-more';
import { IArkivertDocumentReference } from './select-context/types';

const PAGE_SIZE = 50;
const EMPTY_ARRAY: IArkivertDocument[] = [];

export const JournalfoerteDocuments = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetArkiverteDokumenterQuery(typeof oppgaveId === 'undefined' ? skipToken : oppgaveId);

  const documents = data?.dokumenter ?? EMPTY_ARRAY;

  const filters = useFilters(documents);
  const { resetFilters, noFiltersActive, totalFilteredDocuments } = filters;

  const [page, setPage] = useState(1);

  const endIndex = PAGE_SIZE * page;

  const slicedFilteredDocuments = useMemo(
    () => totalFilteredDocuments.slice(0, endIndex),
    [endIndex, totalFilteredDocuments],
  );

  const allSelectableDocuments = useMemo<IArkivertDocumentReference[]>(() => {
    const selectable: IArkivertDocumentReference[] = [];

    for (const doc of totalFilteredDocuments) {
      if (doc.harTilgangTilArkivvariant) {
        selectable.push({ journalpostId: doc.journalpostId, dokumentInfoId: doc.dokumentInfoId });
      }

      for (const vedlegg of doc.vedlegg) {
        if (vedlegg.harTilgangTilArkivvariant) {
          selectable.push({ journalpostId: doc.journalpostId, dokumentInfoId: vedlegg.dokumentInfoId });
        }
      }
    }

    return selectable;
  }, [totalFilteredDocuments]);

  return (
    <SelectContextElement documentList={documents}>
      <Container data-testid="oppgavebehandling-documents-all">
        <JournalfoertHeading
          filteredLength={totalFilteredDocuments.length}
          totalLengthOfMainDocuments={data?.totaltAntall}
          noFiltersActive={noFiltersActive}
          resetFilters={resetFilters}
          slicedFilteredDocuments={slicedFilteredDocuments}
          allDocuments={data?.dokumenter ?? EMPTY_ARRAY}
        />
        <Wrapper>
          <Header filters={filters} allSelectableDocuments={allSelectableDocuments} />

          <DocumentList documents={slicedFilteredDocuments} isLoading={isLoading} />

          <LoadMore
            loadedDocuments={endIndex}
            totalDocuments={totalFilteredDocuments.length}
            loading={isLoading}
            onNextPage={() => setPage(page + 1)}
          />
        </Wrapper>
      </Container>
    </SelectContextElement>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
`;

const Container = styled.section`
  ${commonStyles}
  justify-content: space-between;
  flex-grow: 1;
  overflow: hidden;
`;
