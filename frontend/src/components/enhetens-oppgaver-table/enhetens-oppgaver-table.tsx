import { Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useState } from 'react';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useSakstyper } from '@app/hooks/use-kodeverk-value';
import { useGetEnhetensUferdigeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { useUser } from '@app/simple-api-state/use-user';
import { Role } from '@app/types/bruker';
import { CommonOppgaverParams, EnhetensOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.RolFlowState,
  ColumnKeyEnum.MedunderskriverFlowState,
  ColumnKeyEnum.Medunderskriver,
  ColumnKeyEnum.Oppgavestyring,
  ColumnKeyEnum.Open,
];

export const EnhetensOppgaverTable = () => {
  const hasAccess = useHasRole(Role.KABAL_INNSYN_EGEN_ENHET);

  if (!hasAccess) {
    return null;
  }

  return <EnhetensOppgaverTableInternal />;
};

const EnhetensOppgaverTableInternal = () => {
  const [params, setParams] = useState<CommonOppgaverParams>({
    typer: [],
    ytelser: [],
    hjemler: [],
    tildelteSaksbehandlere: [],
    rekkefoelge: SortOrderEnum.STIGENDE,
    sortering: SortFieldEnum.FRIST,
  });

  const types = useSakstyper();

  const { data: bruker } = useUser();

  const queryParams: typeof skipToken | EnhetensOppgaverParams =
    typeof bruker === 'undefined' || typeof types === 'undefined'
      ? skipToken
      : { ...params, enhetId: bruker.ansattEnhet.id };

  const { data, isLoading, isFetching, isError, refetch } = useGetEnhetensUferdigeOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <section>
      <Heading size="small">Tildelte oppgaver</Heading>
      <OppgaveTable
        columns={COLUMNS}
        params={params}
        setParams={setParams}
        data-testid="enhetens-oppgaver-table"
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.ENHETENS_UFERDIGE}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        refetch={refetch}
      />
    </section>
  );
};
