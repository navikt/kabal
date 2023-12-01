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
import { IArkivertDocumentReference } from './select-context/types';

const EMPTY_ARRAY: IArkivertDocument[] = [];

export const JournalfoerteDocuments = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetArkiverteDokumenterQuery(typeof oppgaveId === 'undefined' ? skipToken : oppgaveId);
  const [listHeight, setListHeight] = useState<number>(0);

  const documents = data?.dokumenter ?? EMPTY_ARRAY;

  const filters = useFilters(documents);
  const { resetFilters, noFiltersActive, totalFilteredDocuments } = filters;

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
          allDocuments={documents}
          totalLengthOfMainDocuments={data?.totaltAntall ?? 0}
          noFiltersActive={noFiltersActive}
          resetFilters={resetFilters}
          filteredDocuments={totalFilteredDocuments}
        />
        <Wrapper>
          <Header filters={filters} allSelectableDocuments={allSelectableDocuments} listHeight={listHeight} />

          <DocumentList documents={totalFilteredDocuments} isLoading={isLoading} onHeightChange={setListHeight} />
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
