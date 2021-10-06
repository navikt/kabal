import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useMemo, useState } from 'react';
import { useAvailableTemaer } from '../../../hooks/use-available-temaer';
import { useGetDokumenterQuery } from '../../../redux-api/dokumenter/api';
import { IKlagebehandling } from '../../../redux-api/oppgave-state-types';
import { IDocumentReference } from '../../../redux-api/oppgave-types';
import { FilterDropdown } from '../../filter-dropdown/filter-dropdown';
import { IShownDokument } from '../../show-document/types';
import { dokumentMatcher } from '../helpers';
import { DokumenterFullvisning, List, ListItem } from '../styled-components/fullvisning';
import { ListHeader, ListTitle } from '../styled-components/list-header';
import { ITilknyttetDokument } from '../types';
import { Document } from './document';
import { LoadMore } from './load-more';

interface AlleDokumenterProps {
  klagebehandling: IKlagebehandling;
  show: boolean;
  setShownDocument: (document: IShownDokument) => void;
  onChange: (tilknyttedeDokumenter: IDocumentReference[]) => void;
}

export const AlleDokumenter = React.memo(
  ({ klagebehandling, show, setShownDocument }: AlleDokumenterProps) => {
    const [pageReference, setPageReference] = useState<string | null>(null);
    const [selectedTemaer, setSelectedTemaer] = useState<string[]>([]);

    const { data: alleDokumenter, isLoading } = useGetDokumenterQuery({
      klagebehandlingId: klagebehandling.id,
      pageReference,
      temaer: selectedTemaer,
    });

    const availableTemaer = useAvailableTemaer();

    const dokumenter = useMemo<ITilknyttetDokument[]>(() => {
      if (typeof alleDokumenter === 'undefined') {
        return [];
      }

      return alleDokumenter.dokumenter.map((document) => ({
        document,
        tilknyttet: klagebehandling.tilknyttedeDokumenter.some((t) => dokumentMatcher(t, document)),
      }));
    }, [alleDokumenter, klagebehandling.tilknyttedeDokumenter]);

    if (!show) {
      return null;
    }

    if (isLoading || typeof alleDokumenter === 'undefined') {
      return <NavFrontendSpinner />;
    }

    return (
      <DokumenterFullvisning>
        <ListHeader>
          <ListTitle>Journalførte dokumenter</ListTitle>
          <FilterDropdown options={availableTemaer} onChange={setSelectedTemaer} selected={selectedTemaer}>
            Tema
          </FilterDropdown>
        </ListHeader>
        <List data-testid={'dokumenter'}>
          {dokumenter.map(({ document: dokument, tilknyttet }) => (
            <ListItem key={`dokument_${dokument.journalpostId}_${dokument.dokumentInfoId}`}>
              <Document
                document={dokument}
                tilknyttet={tilknyttet}
                setShownDocument={setShownDocument}
                klagebehandling={klagebehandling}
              />
            </ListItem>
          ))}
        </List>
        <LoadMore dokumenter={alleDokumenter} loading={isLoading} setPage={setPageReference} />
      </DokumenterFullvisning>
    );
  },
  (previous, next) =>
    previous.show === next.show &&
    previous.klagebehandling.id === next.klagebehandling.id &&
    previous.setShownDocument === next.setShownDocument
);

AlleDokumenter.displayName = 'AlleDokumenter';
