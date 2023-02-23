import { Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React from 'react';
import styled from 'styled-components';
import { useGetEnhetensVentendeOppgaverQuery } from '../../redux-api/oppgaver/queries/oppgaver';
import { useUser } from '../../simple-api-state/use-user';
import { StyledCaption } from '../../styled-components/table';
import { EnhetensUferdigeOppgaverParams, SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { TableHeader } from '../common-table-components/header';
import { OppgaveRows } from './rows';

const MAX_OPPGAVER = 100;

const TABLE_HEADERS: (string | null)[] = ['Type', 'Ytelse', 'Hjemmel', 'På vent til', 'Utfall', 'Tildeling', null];

export const EnhetensOppgaverPaaVentTable = () => {
  const { data: bruker } = useUser();

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
    isError,
    isLoading,
  } = useGetEnhetensVentendeOppgaverQuery(queryParams, {
    pollingInterval: 30 * 1000,
    refetchOnMountOrArgChange: true,
  });

  return (
    <StyledTable zebraStripes data-testid="enhetens-oppgaver-paa-vent-table">
      <StyledCaption>Oppgaver på vent</StyledCaption>
      <TableHeader headers={TABLE_HEADERS} />
      <OppgaveRows
        oppgaver={oppgaver?.behandlinger}
        columnCount={TABLE_HEADERS.length}
        isLoading={isLoading}
        isError={isError}
      />
    </StyledTable>
  );
};

const StyledTable = styled(Table)`
  max-width: 2500px;
  width: 100%;
`;
