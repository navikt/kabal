import { Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React from 'react';
import { TableFooter } from '@app/components/common-table-components/footer';
import { ColumnKeyEnum } from '@app/components/common-table-components/oppgave-rows/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import { useGetMineFerdigstilteOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { StyledMineOppgaverTable } from '@app/styled-components/table';
import { MineFerdigstilteOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { TableHeader } from '../common-table-components/header';
import { OppgaveRows } from '../common-table-components/oppgave-rows/oppgave-rows';

const HUNDRED_YEARS = 100 * 365;

const TABLE_HEADERS: (string | null)[] = ['Type', 'Ytelse', 'Hjemmel', 'Navn', 'Fnr.', 'Fullført', 'Utfall', null];
const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Navn,
  ColumnKeyEnum.Fnr,
  ColumnKeyEnum.Finished,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.Open,
];

export const FullfoerteOppgaverTable = () => {
  const queryParams: typeof skipToken | MineFerdigstilteOppgaverParams = {
    sortering: SortFieldEnum.FRIST, // TODO: Bytt?
    rekkefoelge: SortOrderEnum.SYNKENDE,
    ferdigstiltDaysAgo: HUNDRED_YEARS,
  };

  const { data, isLoading, isFetching, isError } = useGetMineFerdigstilteOppgaverQuery(queryParams, {
    pollingInterval: 180 * 1000,
    refetchOnMountOrArgChange: true,
  });

  const { oppgaver, ...footerProps } = useOppgavePagination(OppgaveTableRowsPerPage.MINE_FERDIGE, data?.behandlinger);

  return (
    <div>
      <Heading size="medium">Fullførte oppgaver</Heading>

      <StyledMineOppgaverTable className="tabell tabell--stripet" data-testid="fullfoerte-oppgaver-table" zebraStripes>
        <TableHeader headers={TABLE_HEADERS} />
        <OppgaveRows
          testId="fullfoerte-oppgaver-table"
          oppgaver={oppgaver}
          columns={COLUMNS}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          pageSize={footerProps.pageSize}
        />
        <TableFooter
          {...footerProps}
          columnCount={TABLE_HEADERS.length}
          settingsKey={OppgaveTableRowsPerPage.MINE_FERDIGE}
        />
      </StyledMineOppgaverTable>
    </div>
  );
};
