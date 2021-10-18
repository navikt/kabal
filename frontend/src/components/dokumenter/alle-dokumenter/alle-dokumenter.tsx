import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useState } from 'react';
import { useAllTemaer } from '../../../hooks/use-all-temaer';
import { useGetDokumenterQuery } from '../../../redux-api/oppgave';
import { FilterDropdown } from '../../filter-dropdown/filter-dropdown';
import { AllDocumentsList, DokumenterFullvisning } from '../styled-components/fullvisning';
import { ListHeader, ListTitle } from '../styled-components/list-header';
import { DocumentsPage } from './documents-page';
import { LoadMore } from './load-more';

interface AlleDokumenterProps {
  klagebehandlingId: string;
  show: boolean;
}

const PAGE_SIZE = 10;

export const AlleDokumenter = React.memo(
  ({ klagebehandlingId, show }: AlleDokumenterProps) => {
    const [pageReferences, setPageReferences] = useState<(string | null)[]>([null]);
    const [selectedTemaer, setSelectedTemaer] = useState<string[]>([]);

    const { data: lastPage, isLoading } = useGetDokumenterQuery({
      klagebehandlingId,
      pageReference: pageReferences[pageReferences.length - 1],
      pageSize: PAGE_SIZE,
      temaer: selectedTemaer,
    });

    const allTemaer = useAllTemaer();

    if (!show) {
      return null;
    }

    return (
      <DokumenterFullvisning data-testid="klagebehandling-documents-all">
        <ListHeader>
          <ListTitle>Journalførte dokumenter</ListTitle>
          <FilterDropdown options={allTemaer} onChange={setSelectedTemaer} selected={selectedTemaer}>
            Tema
          </FilterDropdown>
        </ListHeader>
        <AllDocumentsList data-testid="klagebehandling-documents-all-list">
          <DocumentsSpinner pageCount={pageReferences.length} hasDocuments={typeof lastPage !== 'undefined'} />
          {pageReferences.map((pageReference) => (
            <DocumentsPage
              key={pageReference}
              klagebehandlingId={klagebehandlingId}
              pageReference={pageReference}
              pageSize={PAGE_SIZE}
              temaer={selectedTemaer}
            />
          ))}
        </AllDocumentsList>
        <LoadMore
          totalDocuments={lastPage?.totaltAntall ?? 0}
          loadedDocuments={pageReferences.length * PAGE_SIZE}
          pageReference={lastPage?.pageReference ?? null}
          loading={isLoading}
          setPage={(pageReference: string) => setPageReferences(pageReferences.concat(pageReference))}
        />
      </DokumenterFullvisning>
    );
  },
  (previous, next) => previous.show === next.show && previous.klagebehandlingId === next.klagebehandlingId
);

AlleDokumenter.displayName = 'AlleDokumenter';

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
