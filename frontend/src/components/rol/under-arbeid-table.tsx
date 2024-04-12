import { skipToken } from '@reduxjs/toolkit/query';
import React, { useContext, useState } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useSakstyper } from '@app/hooks/use-kodeverk-value';
import { useGetRolUferdigeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@app/types/bruker';
import { CommonOppgaverParams, EnhetensOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.RolYtelse,
  ColumnKeyEnum.RolInnsendingshjemler,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.Rol,
  ColumnKeyEnum.Open,
];

export const RolOppgaverTable = () => {
  const hasAccess = useHasRole(Role.KABAL_KROL);

  if (!hasAccess) {
    return null;
  }

  return <RolOppgaverTableInternal />;
};

const RolOppgaverTableInternal = () => {
  const [params, setParams] = useState<CommonOppgaverParams>({
    typer: [],
    ytelser: [],
    hjemler: [],
    tildelteSaksbehandlere: [],
    rekkefoelge: SortOrderEnum.STIGENDE,
    sortering: SortFieldEnum.FRIST,
  });

  const types = useSakstyper();

  const { user } = useContext(StaticDataContext);

  const queryParams: typeof skipToken | EnhetensOppgaverParams =
    typeof types === 'undefined' ? skipToken : { ...params, enhetId: user.ansattEnhet.id };

  const { data, isLoading, isFetching, isError, refetch } = useGetRolUferdigeOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (data === undefined) {
    return null;
  }

  return (
    <section>
      <OppgaveTable
        heading="Tildelte oppgaver"
        columns={COLUMNS}
        params={params}
        setParams={setParams}
        data-testid="rol-oppgaver-table"
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.ROL_UFERDIGE}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        refetch={refetch}
        filters={data.filters}
      />
    </section>
  );
};
