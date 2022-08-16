import { Pagination, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useGetSettingsQuery } from '../../redux-api/bruker';
import {
  useGetAntallLedigeOppgaverMedUtgaatteFristerQuery,
  useGetMineLedigeOppgaverQuery,
} from '../../redux-api/oppgaver/queries/oppgaver';
import { useUser } from '../../simple-api-state/use-user';
import { StyledFooterContent } from '../../styled-components/table';
import { MineLedigeOppgaverParams, SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { TableHeaderFilters } from './filter-header';
import { OppgaveRader } from './rows';
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

  const queryParams: typeof skipToken | MineLedigeOppgaverParams =
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

  const {
    data: oppgaver,
    refetch,
    isFetching,
  } = useGetMineLedigeOppgaverQuery(queryParams, { pollingInterval: 30 * 1000 });

  const { data: utgaatte } = useGetAntallLedigeOppgaverMedUtgaatteFristerQuery(
    queryParams === skipToken ? skipToken : { ...queryParams, ferdigstiltDaysAgo: 7 },
    { pollingInterval: 300 * 1000 }
  );

  useEffect(() => {
    refetch();

    return refetch;
  }, [refetch]);

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
      <Table
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
        <OppgaveRader oppgaver={oppgaver?.behandlinger} columnCount={7} isFetching={isFetching} />
        <tfoot>
          <Table.Row>
            <Table.DataCell colSpan={6}>
              <StyledFooterContent>
                <PageInfo total={total} fromNumber={fromNumber} toNumber={toNumber} />
                <Pagination
                  page={currentPage}
                  onPageChange={(p) => naviagte(`../${p}`)}
                  count={Math.max(Math.ceil(total / PAGE_SIZE), 1)}
                />
              </StyledFooterContent>
            </Table.DataCell>
          </Table.Row>
        </tfoot>
      </Table>

      <div>Antall oppgaver med utgåtte frister: {utgaatte?.antall ?? 0}</div>
    </>
  );
};

interface PageInfoProps {
  total: number;
  fromNumber: number;
  toNumber: number;
}

const PageInfo = ({ total, fromNumber, toNumber }: PageInfoProps): JSX.Element => {
  if (total === 0) {
    return <span>Ingen klagebehandlinger å vise</span>;
  }

  return <span>{`Viser ${fromNumber} til ${toNumber} av ${total} klagebehandlinger`}</span>;
};

const parsePage = (page = '1'): number | null => {
  const parsed = Number.parseInt(page, 10);

  return Number.isNaN(parsed) ? null : parsed;
};

const invertSort = (order: SortOrderEnum) =>
  order === SortOrderEnum.STIGENDE ? SortOrderEnum.SYNKENDE : SortOrderEnum.STIGENDE;
