import { skipToken } from '@reduxjs/toolkit/query';
import React, { useState } from 'react';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetUferdigeRolOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@app/types/bruker';
import { CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

const TEST_ID = 'mine-oppgaver-table';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.RolYtelse,
  ColumnKeyEnum.RolInnsendingshjemler,
  ColumnKeyEnum.Navn,
  ColumnKeyEnum.Fnr,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.RolTildeling,
  ColumnKeyEnum.Open,
];

export const MineRolOppgaverTable = () => {
  const hasAccess = useHasRole(Role.KABAL_ROL);

  if (!hasAccess) {
    return null;
  }

  return <MineRolOppgaverTableInternal />;
};

const MineRolOppgaverTableInternal = () => {
  const [params, setParams] = useState<CommonOppgaverParams>({
    sortering: SortFieldEnum.FRIST,
    rekkefoelge: SortOrderEnum.STIGENDE,
  });

  const queryParams: typeof skipToken | CommonOppgaverParams = params;

  const { data, isError, isLoading, isFetching, refetch } = useGetUferdigeRolOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (data === undefined) {
    return null;
  }

  return (
    <section>
      <OppgaveTable
        heading="Oppgaver under arbeid"
        columns={COLUMNS}
        params={params}
        setParams={setParams}
        isError={isError}
        isLoading={isLoading}
        isFetching={isFetching}
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.MINE_UFERDIGE}
        refetch={refetch}
        data-testid={TEST_ID}
        filters={data.filters}
      />
    </section>
  );
};
