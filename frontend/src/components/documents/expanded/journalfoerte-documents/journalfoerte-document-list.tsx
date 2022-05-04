import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useState } from 'react';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useAllTemaer } from '../../../../hooks/use-all-temaer';
import { useGetArkiverteDokumenterQuery } from '../../../../redux-api/oppgavebehandling';
import { kodeverkValuesToDropdownOptions } from '../../../dropdown/dropdown';
import { StyledDocumentsContainer } from '../styled-components/container';
import { StyledDocumentList } from '../styled-components/document-list';
import { StyledFilterDropdown, StyledListHeader, StyledListTitle } from '../styled-components/list-header';
import { DocumentsPage } from './documents-page';
import { LoadMore } from './load-more';

export const JournalfoerteDocumentList = () => {
  const oppgaveId = useOppgaveId();
  const [pageReferences, setPageReferences] = useState<(string | null)[]>([null]);
  const [selectedTemaer, setSelectedTemaer] = useState<string[]>([]);

  const { data: lastPage, isFetching } = useGetArkiverteDokumenterQuery({
    oppgaveId,
    pageReference: pageReferences[pageReferences.length - 1] ?? null,
    temaer: selectedTemaer,
  });

  const allTemaer = useAllTemaer();

  return (
    <StyledDocumentsContainer data-testid="oppgavebehandling-documents-all">
      <StyledListHeader>
        <StyledListTitle>Journalførte dokumenter</StyledListTitle>
        <StyledFilterDropdown
          options={kodeverkValuesToDropdownOptions(allTemaer)}
          onChange={setSelectedTemaer}
          selected={selectedTemaer}
        >
          Tema
        </StyledFilterDropdown>
      </StyledListHeader>
      <StyledDocumentList data-testid="oppgavebehandling-documents-all-list">
        <DocumentsSpinner pageCount={pageReferences.length} hasDocuments={typeof lastPage !== 'undefined'} />
        {pageReferences.map((pageReference) => (
          <DocumentsPage
            key={pageReference}
            oppgaveId={oppgaveId}
            pageReference={pageReference}
            temaer={selectedTemaer}
            pageReferences={pageReferences}
          />
        ))}
      </StyledDocumentList>
      <LoadMore
        totalDocuments={lastPage?.totaltAntall ?? 0}
        loadedDocuments={pageReferences.length * 10}
        pageReference={lastPage?.pageReference ?? null}
        loading={isFetching}
        setPage={(pageReference: string) => setPageReferences(pageReferences.concat(pageReference))}
      />
    </StyledDocumentsContainer>
  );
};

JournalfoerteDocumentList.displayName = 'JournalfoerteDocuments';

interface DocumentsSpinnerProps {
  pageCount: number;
  hasDocuments: boolean;
}

const DocumentsSpinner = ({ hasDocuments, pageCount }: DocumentsSpinnerProps): JSX.Element | null => {
  if (hasDocuments || pageCount > 1) {
    return null;
  }

  return <NavFrontendSpinner />;
};
