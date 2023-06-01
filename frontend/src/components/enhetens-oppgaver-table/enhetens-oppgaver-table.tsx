import { Heading, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { TableFooter } from '@app/components/common-table-components/footer';
import { OppgaveRows } from '@app/components/common-table-components/oppgave-rows/oppgave-rows';
import { ColumnKeyEnum } from '@app/components/common-table-components/oppgave-rows/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useSakstyper } from '@app/hooks/use-kodeverk-value';
import { useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import { useGetEnhetensUferdigeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { useUser } from '@app/simple-api-state/use-user';
import { EnhetensUferdigeOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { TableHeaderFilters } from './filter-header';
import { Filters } from './types';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.Medunderskriverflyt,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.Oppgavestyring,
];

export const EnhetensOppgaverTable = () => {
  const [filters, setFilters] = useState<Filters>({
    types: [],
    ytelser: [],
    hjemler: [],
    tildeltSaksbehandler: [],
    sorting: [SortFieldEnum.FRIST, SortOrderEnum.STIGENDE],
  });

  const types = useSakstyper();

  const typer = filters.types.length === 0 ? types?.map(({ id }) => id) : filters.types;
  const { ytelser, hjemler } = filters;
  const [sortering, rekkefoelge] = filters.sorting;

  const { data: bruker } = useUser();

  const queryParams: typeof skipToken | EnhetensUferdigeOppgaverParams =
    typeof bruker === 'undefined' || typeof types === 'undefined'
      ? skipToken
      : {
          sortering,
          rekkefoelge,
          ytelser,
          typer,
          hjemler,
          enhetId: bruker.ansattEnhet.id,
          tildelteSaksbehandlere: filters.tildeltSaksbehandler,
        };

  const { data, isLoading, isFetching, isError, refetch } = useGetEnhetensUferdigeOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { oppgaver, ...footerProps } = useOppgavePagination(
    OppgaveTableRowsPerPage.ENHETENS_UFERDIGE,
    data?.behandlinger ?? []
  );

  return (
    <div>
      <Heading size="medium">Tildelte oppgaver - {bruker?.ansattEnhet.navn}</Heading>
      <StyledTable
        data-testid="enhetens-oppgaver-table"
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
          testId="enhetens-oppgaver-table"
          oppgaver={oppgaver}
          columns={COLUMNS}
          isError={isError}
          isFetching={isFetching}
          isLoading={isLoading}
          pageSize={footerProps.pageSize}
        />
        <TableFooter
          {...footerProps}
          columnCount={8}
          onRefresh={refetch}
          isLoading={isLoading || isFetching}
          settingsKey={OppgaveTableRowsPerPage.ENHETENS_UFERDIGE}
          testId="enhetens-oppgaver-table-footer"
        />
      </StyledTable>
    </div>
  );
};

const invertSort = (order: SortOrderEnum) =>
  order === SortOrderEnum.STIGENDE ? SortOrderEnum.SYNKENDE : SortOrderEnum.STIGENDE;

const StyledTable = styled(Table)`
  max-width: 2500px;
  width: 100%;
`;
