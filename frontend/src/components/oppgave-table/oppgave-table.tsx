import { Pagination, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGetSettingsQuery } from '../../redux-api/bruker';
import {
  useGetAntallLedigeOppgaverMedUtgaatteFristerQuery,
  useGetLedigeOppgaverQuery,
} from '../../redux-api/oppgaver/queries/oppgaver';
import { useUser } from '../../simple-api-state/use-user';
import { StyledFooterContent } from '../../styled-components/table';
import { LedigeOppgaverParams, SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { TableHeaderFilters } from './filter-header';
import { Oppgaverader } from './rows';
import { Filters } from './types';

const PAGE_SIZE = 10;

export const OppgaveTable = (): JSX.Element => {
  const naviagte = useNavigate();
  const [filters, setFilters] = useState<Filters>({
    types: [],
    ytelser: [],
    hjemler: [],
    sorting: [SortFieldEnum.FRIST, SortOrderEnum.STIGENDE],
  });
  const { data: bruker } = useUser();
  const { data: settingsData } = useGetSettingsQuery();

  const { page } = useParams();
  const parsedPage = parsePage(page);

  const currentPage = parsedPage === null ? 1 : parsedPage;
  const from = (currentPage - 1) * PAGE_SIZE;

  const settingsTyper = settingsData?.typer ?? [];
  const settingsYtelser = settingsData?.ytelser ?? [];
  const settingsHjemler = settingsData?.hjemler ?? [];

  const typer = filters.types.length === 0 ? settingsTyper : filters.types;
  const ytelser = filters.ytelser.length === 0 ? settingsYtelser : filters.ytelser;
  const hjemler = filters.hjemler.length === 0 ? settingsHjemler : filters.hjemler;

  const [sortering, rekkefoelge] = filters.sorting;

  const queryParams: typeof skipToken | LedigeOppgaverParams =
    typeof bruker === 'undefined' || typeof settingsData === 'undefined'
      ? skipToken
      : {
          start: from,
          antall: PAGE_SIZE,
          sortering,
          rekkefoelge,
          navIdent: bruker.navIdent,
          ytelser,
          typer,
          hjemler,
        };

  const { data: oppgaver, isFetching } = useGetLedigeOppgaverQuery(queryParams, {
    pollingInterval: 30 * 1000,
    refetchOnMountOrArgChange: true,
  });

  const { data: utgaatte } = useGetAntallLedigeOppgaverMedUtgaatteFristerQuery(
    queryParams === skipToken ? skipToken : { ...queryParams, ferdigstiltDaysAgo: 7 },
    { pollingInterval: 300 * 1000 }
  );

  if (parsedPage === null) {
    return <Navigate to="../1" />;
  }

  const total = oppgaver?.antallTreffTotalt ?? 0;

  if (!isFetching && typeof oppgaver !== 'undefined' && total < from) {
    const lastPage = Math.ceil(total / PAGE_SIZE);

    return <Navigate to={`../${lastPage.toString()}`} />;
  }

  const fromNumber = from + 1;
  const toNumber = Math.min(total, from + PAGE_SIZE);

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

            setFilters((f) => ({
              ...f,
              sorting: [field, order],
            }));
          }
        }}
      >
        <TableHeaderFilters filters={filters} onChange={setFilters} />
        <Oppgaverader oppgaver={oppgaver?.behandlinger} columnCount={7} isFetching={isFetching} />
        <tfoot>
          <Table.Row>
            <Table.DataCell colSpan={6}>
              <StyledFooterContent>
                <PageInfo total={total} fromNumber={fromNumber} toNumber={toNumber} />
                <Pagination
                  page={currentPage}
                  onPageChange={(p) => naviagte(`../${p}`)}
                  count={Math.max(Math.ceil(total / PAGE_SIZE), 1)}
                  prevNextTexts
                />
              </StyledFooterContent>
            </Table.DataCell>
          </Table.Row>
        </tfoot>
      </OppgaverTable>

      <div>Antall oppgaver med utgåtte frister: {utgaatte?.antall ?? 0}</div>
    </>
  );
};

const OppgaverTable = styled(Table)`
  max-width: 2500px;
  width: 100%;
`;

interface PageInfoProps {
  total: number;
  fromNumber: number;
  toNumber: number;
}

const PageInfo = ({ total, fromNumber, toNumber }: PageInfoProps): JSX.Element | null => {
  if (total === 0) {
    return null;
  }

  return <span>{`Viser ${fromNumber} til ${toNumber} av ${total} oppgaver`}</span>;
};

const parsePage = (page = '1'): number | null => {
  const parsed = Number.parseInt(page, 10);

  return Number.isNaN(parsed) ? null : parsed;
};

const invertSort = (order: SortOrderEnum) =>
  order === SortOrderEnum.STIGENDE ? SortOrderEnum.SYNKENDE : SortOrderEnum.STIGENDE;
