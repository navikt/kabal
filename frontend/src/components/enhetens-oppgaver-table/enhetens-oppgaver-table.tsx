import { Loader, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useSakstyper } from '../../hooks/use-kodeverk-value';
import { useGetEnhetensUferdigeOppgaverQuery } from '../../redux-api/oppgaver/queries/oppgaver';
import { useUser } from '../../simple-api-state/use-user';
import { StyledCaption } from '../../styled-components/table';
import { EnhetensUferdigeOppgaverParams, IOppgaveList, SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { TableHeaderFilters } from './filter-header';
import { Row } from './row';
import { Filters } from './types';

const MAX_OPPGAVER = 100;

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
          start: 0,
          antall: MAX_OPPGAVER,
          sortering,
          rekkefoelge,
          ytelser,
          typer,
          hjemler,
          enhetId: bruker.ansattEnhet.id,
          tildelteSaksbehandlere: filters.tildeltSaksbehandler,
        };

  const { data: oppgaver, isLoading } = useGetEnhetensUferdigeOppgaverQuery(queryParams, {
    pollingInterval: 30 * 1000,
    refetchOnMountOrArgChange: true,
  });

  return (
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

          setFilters((f) => ({
            ...f,
            sorting: [field, order],
          }));
        }
      }}
    >
      <StyledCaption>Tildelte oppgaver - {bruker?.ansattEnhet.navn}</StyledCaption>
      <TableHeaderFilters filters={filters} onChange={setFilters} />
      <OppgaveRader oppgaver={oppgaver?.behandlinger} isLoading={isLoading} />
    </StyledTable>
  );
};

const invertSort = (order: SortOrderEnum) =>
  order === SortOrderEnum.STIGENDE ? SortOrderEnum.SYNKENDE : SortOrderEnum.STIGENDE;

interface OppgaveRaderProps {
  oppgaver?: IOppgaveList;
  isLoading: boolean;
}

const OppgaveRader = ({ oppgaver, isLoading }: OppgaveRaderProps): JSX.Element => {
  if (isLoading || typeof oppgaver === 'undefined') {
    return (
      <Table.Body>
        <Table.Row>
          <Table.DataCell colSpan={100}>
            <Loader size="xlarge" title="Laster oppgaver..." />
          </Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  if (oppgaver.length === 0) {
    return (
      <Table.Body data-testid="enhetens-oppgaver-table-none">
        <Table.Row>
          <Table.DataCell colSpan={5}>Ingen oppgaver</Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  return (
    <Table.Body data-testid="enhetens-oppgaver-table-rows">
      {oppgaver.map((k) => (
        <Row {...k} key={k.id} />
      ))}
    </Table.Body>
  );
};

const StyledTable = styled(Table)`
  max-width: 2500px;
  width: 100%;
`;
