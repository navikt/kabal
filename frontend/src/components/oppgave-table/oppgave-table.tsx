import { BodyShort, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { TableFooter } from '@app/components/common-table-components/footer';
import { OppgaveRows } from '@app/components/common-table-components/oppgave-rows/oppgave-rows';
import { ColumnKeyEnum } from '@app/components/common-table-components/oppgave-rows/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import { useGetSettingsQuery } from '@app/redux-api/bruker';
import {
  useGetAntallLedigeOppgaverMedUtgaatteFristerQuery,
  useGetLedigeOppgaverQuery,
} from '@app/redux-api/oppgaver/queries/oppgaver';
import { LedigeOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { TableHeaderFilters } from './filter-header';
import { Filters } from './types';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.Oppgavestyring,
];

export const OppgaveTable = (): JSX.Element => {
  const [filters, setFilters] = useState<Filters>({
    types: [],
    ytelser: [],
    hjemler: [],
    sorting: [SortFieldEnum.FRIST, SortOrderEnum.STIGENDE],
  });
  const {
    data: settingsData,
    isLoading: isLoadingSettings,
    isError: isErrorSettings,
    isFetching: isFetchingSettings,
  } = useGetSettingsQuery();

  const settingsTyper = settingsData?.typer ?? [];
  const settingsYtelser = settingsData?.ytelser ?? [];
  const settingsHjemler = settingsData?.hjemler ?? [];

  const typer = filters.types.length === 0 ? settingsTyper : filters.types;
  const ytelser = filters.ytelser.length === 0 ? settingsYtelser : filters.ytelser;
  const hjemler = filters.hjemler.length === 0 ? settingsHjemler : filters.hjemler;

  const [sortering, rekkefoelge] = filters.sorting;

  const queryParams: typeof skipToken | LedigeOppgaverParams =
    typeof settingsData === 'undefined' ? skipToken : { sortering, rekkefoelge, ytelser, typer, hjemler };

  const { data, isFetching, isLoading, isError } = useGetLedigeOppgaverQuery(queryParams, {
    pollingInterval: 30 * 1000,
    refetchOnMountOrArgChange: true,
  });

  const { data: utgaatte } = useGetAntallLedigeOppgaverMedUtgaatteFristerQuery(
    queryParams === skipToken ? skipToken : { ...queryParams, ferdigstiltDaysAgo: 7 },
    { pollingInterval: 300 * 1000 }
  );

  const { oppgaver, ...footerProps } = useOppgavePagination(OppgaveTableRowsPerPage.LEDIGE, data?.behandlinger);

  return (
    <>
      <OppgaverTable
        data-testid="oppgave-table"
        zebraStripes
        sort={{
          orderBy: filters.sorting[0],
          direction: filters.sorting[1] === SortOrderEnum.STIGENDE ? 'ascending' : 'descending',
        }}
        onSortChange={(field?: string) => {
          if (field === SortFieldEnum.FRIST || field === SortFieldEnum.ALDER || field === SortFieldEnum.MOTTATT) {
            const [currentField, currentOrder] = filters.sorting;

            const order = currentField === field ? invertSort(currentOrder) : SortOrderEnum.STIGENDE;

            setFilters((f) => ({ ...f, sorting: [field, order] }));
          }
        }}
      >
        <TableHeaderFilters filters={filters} onChange={setFilters} />
        <OppgaveRows
          testId="oppgave-table"
          oppgaver={oppgaver}
          columns={COLUMNS}
          isLoading={isLoading || isLoadingSettings}
          isFetching={isFetching || isFetchingSettings}
          isError={isError || isErrorSettings}
          pageSize={footerProps.pageSize}
        />
        <TableFooter
          {...footerProps}
          columnCount={7}
          settingsKey={OppgaveTableRowsPerPage.LEDIGE}
          testId="oppgave-table-footer"
        />
      </OppgaverTable>

      <BodyShort size="small">Antall oppgaver med utgåtte frister: {utgaatte?.antall ?? 0}</BodyShort>
    </>
  );
};

const OppgaverTable = styled(Table)`
  max-width: 2500px;
  width: 100%;
`;

const invertSort = (order: SortOrderEnum) =>
  order === SortOrderEnum.STIGENDE ? SortOrderEnum.SYNKENDE : SortOrderEnum.STIGENDE;
