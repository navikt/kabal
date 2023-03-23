import { Pagination, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useState } from 'react';
import { useGetMineFerdigstilteOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { useUser } from '@app/simple-api-state/use-user';
import { StyledCaption, StyledFooterContent, StyledMineOppgaverTable } from '@app/styled-components/table';
import { MineFerdigstilteOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { TableHeader } from '../common-table-components/header';
import { PageInfo } from '../common-table-components/page-info';
import { OppgaveRows } from './rows';

const PAGE_SIZE = 10;
const HUNDRED_YEARS = 100 * 365;

const TABLE_HEADERS: (string | null)[] = ['Type', 'Ytelse', 'Hjemmel', 'Navn', 'Fnr.', 'Fullført', 'Utfall', null];

export const FullfoerteOppgaverTable = () => {
  const { data: bruker } = useUser();
  const [page, setPage] = useState(1);

  const from = (page - 1) * PAGE_SIZE;

  const queryParams: typeof skipToken | MineFerdigstilteOppgaverParams =
    typeof bruker === 'undefined'
      ? skipToken
      : {
          start: from,
          antall: PAGE_SIZE,
          sortering: SortFieldEnum.FRIST, // TODO: Bytt?
          rekkefoelge: SortOrderEnum.SYNKENDE,
          navIdent: bruker.navIdent,
          ferdigstiltDaysAgo: HUNDRED_YEARS,
        };

  const { data: doneOppgaver, isLoading } = useGetMineFerdigstilteOppgaverQuery(queryParams, {
    pollingInterval: 180 * 1000,
    refetchOnMountOrArgChange: true,
  });

  const total = doneOppgaver?.antallTreffTotalt ?? 0;
  const fromNumber = from + 1;
  const toNumber = Math.min(total, from + PAGE_SIZE);

  return (
    <StyledMineOppgaverTable className="tabell tabell--stripet" data-testid="fullfoerte-oppgaver-table" zebraStripes>
      <StyledCaption>Fullførte oppgaver</StyledCaption>
      <TableHeader headers={TABLE_HEADERS} />
      <OppgaveRows oppgaver={doneOppgaver?.behandlinger} columnCount={TABLE_HEADERS.length} isLoading={isLoading} />
      <tfoot>
        <Table.Row>
          <Table.DataCell colSpan={8}>
            <StyledFooterContent>
              <PageInfo total={total} fromNumber={fromNumber} toNumber={toNumber} />
              <Pagination
                page={page}
                onPageChange={setPage}
                count={Math.max(Math.ceil(total / PAGE_SIZE), 1)}
                prevNextTexts
              />
            </StyledFooterContent>
          </Table.DataCell>
        </Table.Row>
      </tfoot>
    </StyledMineOppgaverTable>
  );
};
