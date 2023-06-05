import { Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React from 'react';
import { TableFooter } from '@app/components/common-table-components/footer';
import { ColumnKeyEnum } from '@app/components/common-table-components/oppgave-rows/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import { useGetMineVentendeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { useUser } from '@app/simple-api-state/use-user';
import { StyledMineOppgaverTable } from '@app/styled-components/table';
import { MineUferdigeOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { TableHeader } from '../common-table-components/header';
import { OppgaveRows } from '../common-table-components/oppgave-rows/oppgave-rows';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Navn,
  ColumnKeyEnum.Fnr,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.PaaVentTil,
  ColumnKeyEnum.PaaVentReason,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.Feilregistrering,
];

export const OppgaverPaaVentTable = () => {
  const { data: bruker } = useUser();

  const queryParams: typeof skipToken | MineUferdigeOppgaverParams =
    typeof bruker === 'undefined' ? skipToken : { sortering: SortFieldEnum.FRIST, rekkefoelge: SortOrderEnum.STIGENDE };

  const { data, isError, isFetching, isLoading, refetch } = useGetMineVentendeOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { oppgaver, ...footerProps } = useOppgavePagination(
    OppgaveTableRowsPerPage.MINE_VENTENDE,
    data?.behandlinger ?? []
  );

  return (
    <div>
      <Heading size="medium">Oppgaver på vent</Heading>
      <StyledMineOppgaverTable data-testid="oppgaver-paa-vent-table" zebraStripes>
        <TableHeader columnKeys={COLUMNS} />
        <OppgaveRows
          testId="oppgaver-paa-vent-table"
          oppgaver={oppgaver}
          columns={COLUMNS}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          pageSize={footerProps.pageSize}
        />
        <TableFooter
          {...footerProps}
          columnCount={COLUMNS.length}
          onRefresh={refetch}
          isLoading={isLoading || isFetching}
          settingsKey={OppgaveTableRowsPerPage.MINE_VENTENDE}
          testId="oppgaver-paa-vent-table-footer"
        />
      </StyledMineOppgaverTable>
    </div>
  );
};
