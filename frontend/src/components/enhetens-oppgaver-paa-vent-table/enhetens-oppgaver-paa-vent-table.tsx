import { Heading, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React from 'react';
import styled from 'styled-components';
import { TableFooter } from '@app/components/common-table-components/footer';
import { OppgaveRows } from '@app/components/common-table-components/oppgave-rows/oppgave-rows';
import { ColumnKeyEnum } from '@app/components/common-table-components/oppgave-rows/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import { useGetEnhetensVentendeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { useUser } from '@app/simple-api-state/use-user';
import { EnhetensUferdigeOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { TableHeader } from '../common-table-components/header';

const TABLE_HEADERS: (string | null)[] = ['Type', 'Ytelse', 'Hjemmel', 'På vent til', 'Utfall', 'Tildeling', null];
const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.PaaVentTil,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.Tildeling,
  ColumnKeyEnum.Open,
];

export const EnhetensOppgaverPaaVentTable = () => {
  const { data: bruker } = useUser();

  const queryParams: typeof skipToken | EnhetensUferdigeOppgaverParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          sortering: SortFieldEnum.FRIST,
          rekkefoelge: SortOrderEnum.STIGENDE,
          enhetId: bruker.ansattEnhet.id,
        };

  const { data, isError, isFetching, isLoading } = useGetEnhetensVentendeOppgaverQuery(queryParams);

  const { oppgaver, ...footerProps } = useOppgavePagination(
    OppgaveTableRowsPerPage.ENHETENS_VENTENDE,
    data?.behandlinger ?? []
  );

  return (
    <div>
      <Heading size="medium">Oppgaver på vent</Heading>
      <StyledTable zebraStripes data-testid="enhetens-oppgaver-paa-vent-table">
        <TableHeader headers={TABLE_HEADERS} />
        <OppgaveRows
          testId="enhetens-oppgaver-paa-vent-table"
          oppgaver={oppgaver}
          columns={COLUMNS}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          pageSize={footerProps.pageSize}
        />
        <TableFooter
          {...footerProps}
          columnCount={7}
          settingsKey={OppgaveTableRowsPerPage.ENHETENS_VENTENDE}
          testId="enhetens-oppgaver-paa-vent-footer"
        />
      </StyledTable>
    </div>
  );
};

const StyledTable = styled(Table)`
  max-width: 2500px;
  width: 100%;
`;
