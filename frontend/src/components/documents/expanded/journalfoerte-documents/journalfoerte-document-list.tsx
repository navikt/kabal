import { Heading, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useAllTemaer } from '../../../../hooks/use-all-temaer';
import { useGetArkiverteDokumenterQuery } from '../../../../redux-api/oppgaver/queries/documents';
import { IArkivertDocument } from '../../../../types/arkiverte-documents';
import { kodeverkValuesToDropdownOptions } from '../../../filter-dropdown/functions';
import { StyledJournalfoerteDocumentsContainer } from '../styled-components/container';
import { StyledDocumentListItem, StyledJournalfoerteDocumentList } from '../styled-components/document-list';
import { StyledFilterDropdown, StyledListHeader } from '../styled-components/list-header';
import { Document } from './document';
import { LoadMore } from './load-more';

const PAGE_SIZE = 50;
const EMPTY_ARRAY: IArkivertDocument[] = [];

export const JournalfoerteDocumentList = () => {
  const oppgaveId = useOppgaveId();
  const [selectedTemaer, setSelectedTemaer] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetArkiverteDokumenterQuery(typeof oppgaveId === 'undefined' ? skipToken : oppgaveId);

  const documents = data?.dokumenter ?? EMPTY_ARRAY;

  const endIndex = PAGE_SIZE * page;

  const totalFilteredDocuments = useMemo(() => {
    if (selectedTemaer.length === 0) {
      return documents;
    }

    return documents.filter(({ tema }) => tema !== null && selectedTemaer.includes(tema));
  }, [documents, selectedTemaer]);

  const slicedFilteredDocuments = useMemo(
    () => totalFilteredDocuments.slice(0, endIndex),
    [endIndex, totalFilteredDocuments]
  );

  const allTemaer = useAllTemaer();

  const totaltAntall = data?.totaltAntall ?? 0;

  return (
    <StyledJournalfoerteDocumentsContainer data-testid="oppgavebehandling-documents-all">
      <Wrapper>
        <StyledListHeader>
          <Heading
            size="xsmall"
            level="2"
            title={`Viser ${slicedFilteredDocuments.length} av ${totalFilteredDocuments.length} filtrerte dokumenter. Totalt ${totaltAntall} dokumenter`}
          >
            Journalførte dokumenter ({totalFilteredDocuments.length})
          </Heading>
          <StyledFilterDropdown
            options={kodeverkValuesToDropdownOptions(allTemaer)}
            onChange={setSelectedTemaer}
            selected={selectedTemaer}
          >
            Tema
          </StyledFilterDropdown>
        </StyledListHeader>
        <StyledJournalfoerteDocumentList data-testid="oppgavebehandling-documents-all-list">
          <DocumentsSpinner hasDocuments={!isLoading} />
          {slicedFilteredDocuments.map((document) => (
            <StyledDocumentListItem
              key={`dokument_${document.journalpostId}_${document.dokumentInfoId}`}
              data-testid="oppgavebehandling-documents-all-list-item"
              data-documentname={document.tittel}
            >
              <Document document={document} />
            </StyledDocumentListItem>
          ))}
        </StyledJournalfoerteDocumentList>
        <LoadMore
          loadedDocuments={endIndex}
          totalDocuments={totalFilteredDocuments.length}
          loading={isLoading}
          onNextPage={() => setPage(page + 1)}
        />
      </Wrapper>
    </StyledJournalfoerteDocumentsContainer>
  );
};

JournalfoerteDocumentList.displayName = 'JournalfoerteDocuments';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

interface DocumentsSpinnerProps {
  hasDocuments: boolean;
}

const DocumentsSpinner = ({ hasDocuments }: DocumentsSpinnerProps): JSX.Element | null => {
  if (hasDocuments) {
    return null;
  }

  return <Loader size="xlarge" />;
};
