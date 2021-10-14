import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useState } from 'react';
import { useAllTemaer } from '../../../hooks/use-all-temaer';
import { useGetDokumenterQuery } from '../../../redux-api/oppgave';
import { FilterDropdown } from '../../filter-dropdown/filter-dropdown';
import { IShownDokument } from '../../show-document/types';
import { AllDocumentsList, DokumenterFullvisning } from '../styled-components/fullvisning';
import { ListHeader, ListTitle } from '../styled-components/list-header';
import { DocumentsPage } from './documents-page';
import { LoadMore } from './load-more';

interface AlleDokumenterProps {
  klagebehandlingId: string;
  show: boolean;
  setShownDocument: (document: IShownDokument) => void;
}

const PAGE_SIZE = 10;

export const AlleDokumenter = React.memo(
  ({ klagebehandlingId, show, setShownDocument }: AlleDokumenterProps) => {
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
      <DokumenterFullvisning>
        <ListHeader>
          <ListTitle>Journalførte dokumenter</ListTitle>
          <FilterDropdown options={allTemaer} onChange={setSelectedTemaer} selected={selectedTemaer}>
            Tema
          </FilterDropdown>
        </ListHeader>
        <AllDocumentsList data-testid={'all-documents'}>
          <DocumentsSpinner pageCount={pageReferences.length} hasDocuments={typeof lastPage !== 'undefined'} />
          {pageReferences.map((pageReference) => (
            <DocumentsPage
              key={pageReference}
              klagebehandlingId={klagebehandlingId}
              pageReference={pageReference}
              pageSize={PAGE_SIZE}
              temaer={selectedTemaer}
              setShownDocument={setShownDocument}
            />
          ))}
        </AllDocumentsList>
        <LoadMore
          documents={lastPage}
          loading={isLoading}
          setPage={(pageReference: string) => setPageReferences(pageReferences.concat(pageReference))}
        />
      </DokumenterFullvisning>
    );
  },
  (previous, next) =>
    previous.show === next.show &&
    previous.klagebehandlingId === next.klagebehandlingId &&
    previous.setShownDocument === next.setShownDocument
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
