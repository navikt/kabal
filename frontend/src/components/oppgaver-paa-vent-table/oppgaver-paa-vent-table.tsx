import { Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useState } from 'react';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetMineVentendeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { useUser } from '@app/simple-api-state/use-user';
import { Role } from '@app/types/bruker';
import { CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Navn,
  ColumnKeyEnum.Fnr,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.PaaVentTil,
  ColumnKeyEnum.PaaVentReason,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.OppgavestyringNonFilterable,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.Feilregistrering,
];

export const OppgaverPaaVentTable = () => {
  const hasAccess = useHasRole(Role.KABAL_SAKSBEHANDLING);

  if (!hasAccess) {
    return null;
  }

  return <OppgaverPaaVentTableInternal />;
};

const OppgaverPaaVentTableInternal = () => {
  const { data: bruker } = useUser();

  const [params, setParams] = useState<CommonOppgaverParams>({
    typer: [],
    ytelser: [],
    hjemler: [],
    sortering: SortFieldEnum.FRIST,
    rekkefoelge: SortOrderEnum.STIGENDE,
  });

  const queryParams: typeof skipToken | CommonOppgaverParams = typeof bruker === 'undefined' ? skipToken : params;

  const { data, isError, isFetching, isLoading, refetch } = useGetMineVentendeOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <section>
      <Heading size="small">Oppgaver på vent</Heading>
      <OppgaveTable
        columns={COLUMNS}
        params={params}
        setParams={setParams}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        settingsKey={OppgaveTableRowsPerPage.MINE_VENTENDE}
        refetch={refetch}
        behandlinger={data?.behandlinger}
        data-testid="oppgaver-paa-vent-table"
      />
    </section>
  );
};
