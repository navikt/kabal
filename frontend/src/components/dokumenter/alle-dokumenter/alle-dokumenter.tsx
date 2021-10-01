import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useMemo, useState } from 'react';
import { useAvailableTemaer } from '../../../hooks/use-available-temaer';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useGetDokumenterQuery } from '../../../redux-api/dokumenter/api';
import { IDokument } from '../../../redux-api/dokumenter/types';
import { IKlagebehandling, TilknyttetDokument } from '../../../redux-api/oppgave-state-types';
import { FilterDropdown } from '../../filter-dropdown/filter-dropdown';
import { IShownDokument } from '../../show-document/types';
import { dokumentMatcher } from '../helpers';
import { DokumenterFullvisning, List, ListItem } from '../styled-components/fullvisning';
import { ITilknyttetDokument } from '../types';
import { Document } from './document';
import { LoadMore } from './load-more';

interface AlleDokumenterProps {
  klagebehandling: IKlagebehandling;
  skjult: boolean;
  visDokument: (dokument: IShownDokument) => void;
  onChange: (tilknyttedeDokumenter: TilknyttetDokument[]) => void;
}

export const AlleDokumenter = React.memo(
  ({ klagebehandling, skjult, visDokument, onChange }: AlleDokumenterProps) => {
    const [pageReference, setPageReference] = useState<string | null>(null);
    const [selectedTemaer, setSelectedTemaer] = useState<string[]>([]);

    const { data: alleDokumenter, isLoading } = useGetDokumenterQuery({
      klagebehandlingId: klagebehandling.id,
      pageReference,
      temaer: selectedTemaer,
    });

    const availableTemaer = useAvailableTemaer();

    const canEdit = useCanEdit(klagebehandling.id);

    const dokumenter = useMemo<ITilknyttetDokument[]>(() => {
      if (typeof alleDokumenter === 'undefined') {
        return [];
      }

      return alleDokumenter.dokumenter.map((dokument) => ({
        dokument,
        tilknyttet: klagebehandling.tilknyttedeDokumenter.some((t) => dokumentMatcher(t, dokument)),
      }));
    }, [alleDokumenter, klagebehandling.tilknyttedeDokumenter]);

    const onCheck = ({ dokumentInfoId, journalpostId }: IDokument, checked: boolean) => {
      if (checked) {
        onChange([...klagebehandling.tilknyttedeDokumenter, { dokumentInfoId, journalpostId }]);
        return;
      }

      onChange(
        klagebehandling.tilknyttedeDokumenter.filter(
          (d) => !(d.dokumentInfoId === dokumentInfoId && d.journalpostId === journalpostId)
        )
      );
    };

    if (skjult) {
      return null;
    }

    if (isLoading || typeof alleDokumenter === 'undefined') {
      return <NavFrontendSpinner />;
    }

    return (
      <DokumenterFullvisning>
        <FilterDropdown options={availableTemaer} onChange={setSelectedTemaer} selected={selectedTemaer}>
          Tema
        </FilterDropdown>

        <List data-testid={'dokumenter'}>
          {dokumenter.map(({ dokument, tilknyttet }) => (
            <ListItem key={`dokument_${dokument.journalpostId}_${dokument.dokumentInfoId}`}>
              <Document
                canEdit={canEdit}
                dokument={dokument}
                tilknyttet={tilknyttet}
                visDokument={visDokument}
                klagebehandling={klagebehandling}
                onCheck={onCheck}
              />
            </ListItem>
          ))}
        </List>
        <LoadMore dokumenter={alleDokumenter} loading={isLoading} setPage={setPageReference} />
      </DokumenterFullvisning>
    );
  },
  (previous, next) =>
    previous.skjult === next.skjult &&
    previous.klagebehandling.id === next.klagebehandling.id &&
    previous.visDokument === next.visDokument
);

AlleDokumenter.displayName = 'AlleDokumenter';
