import { Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useState } from 'react';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useGetMineUferdigeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { useUser } from '@app/simple-api-state/use-user';
import { CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

const TEST_ID = 'mine-oppgaver-table';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Navn,
  ColumnKeyEnum.Fnr,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.Medunderskriverflyt,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.OppgavestyringNonFilterable,
  ColumnKeyEnum.Feilregistrering,
];

export const MineOppgaverTable = () => {
  const [params, setParams] = useState<CommonOppgaverParams>({
    sortering: SortFieldEnum.FRIST,
    rekkefoelge: SortOrderEnum.STIGENDE,
  });

  const { data: bruker, isLoading: isLoadingUser, isError: isErrorUser } = useUser();

  const queryParams: typeof skipToken | CommonOppgaverParams = typeof bruker === 'undefined' ? skipToken : params;

  const { data, isError, isLoading, isFetching, refetch } = useGetMineUferdigeOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <section>
      <Heading size="small">Oppgaver under arbeid</Heading>
      <OppgaveTable
        columns={COLUMNS}
        params={params}
        setParams={setParams}
        isError={isError || isErrorUser}
        isLoading={isLoading || isLoadingUser}
        isFetching={isFetching}
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.MINE_UFERDIGE}
        refetch={refetch}
        data-testid={TEST_ID}
      />
    </section>
  );
};
