import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useEffect } from 'react';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { useGetEnhetensVentendeOppgaverQuery } from '../../redux-api/oppgaver/queries/oppgaver';
import { StyledCaption, StyledTable } from '../../styled-components/table';
import { EnhetensUferdigeOppgaverParams, SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { TableHeader } from '../common-table-components/header';
import { OppgaveRader } from './rows';

const MAX_OPPGAVER = 100;

const TABLE_HEADERS: (string | null)[] = ['Type', 'Ytelse', 'Hjemmel', 'På vent til', 'Utfall', 'Saksbehandler', null];

export const EnhetensOppgaverPaaVentTable = () => {
  const { data: bruker } = useGetBrukerQuery();

  const queryParams: typeof skipToken | EnhetensUferdigeOppgaverParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          start: 0,
          antall: MAX_OPPGAVER,
          sortering: SortFieldEnum.FRIST,
          rekkefoelge: SortOrderEnum.STIGENDE,
          enhetId: bruker.ansattEnhet.id,
        };

  const {
    data: oppgaver,
    refetch,
    isError,
    isLoading,
  } = useGetEnhetensVentendeOppgaverQuery(queryParams, {
    pollingInterval: 30 * 1000,
  });

  useEffect(() => {
    refetch();
    return refetch;
  }, [refetch]);

  return (
    <StyledTable className="tabell tabell--stripet" data-testid="enhetens-oppgaver-paa-vent-table">
      <StyledCaption>Oppgaver på vent</StyledCaption>
      <TableHeader headers={TABLE_HEADERS} />
      <OppgaveRader
        oppgaver={oppgaver?.behandlinger}
        columnCount={TABLE_HEADERS.length}
        isLoading={isLoading}
        isError={isError}
      />
    </StyledTable>
  );
};
