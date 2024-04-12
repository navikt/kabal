import React, { useContext, useState } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetEnhetensFerdigstilteOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@app/types/bruker';
import { CommonOppgaverParams, EnhetensOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Registreringshjemler,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.Finished,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.Open,
];

export const EnhetensFerdigstilteOppgaverTable = () => {
  const hasAccess = useHasRole(Role.KABAL_INNSYN_EGEN_ENHET);

  if (!hasAccess) {
    return null;
  }

  return <EnhetensFerdigstilteOppgaverTableInternal />;
};

const EnhetensFerdigstilteOppgaverTableInternal = () => {
  const [params, setParams] = useState<CommonOppgaverParams>({
    typer: [],
    ytelser: [],
    registreringshjemler: [],
    tildelteSaksbehandlere: [],
    rekkefoelge: SortOrderEnum.SYNKENDE,
    sortering: SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER,
  });

  const { user } = useContext(StaticDataContext);

  const queryParams: EnhetensOppgaverParams = { ...params, enhetId: user.ansattEnhet.id };

  const { data, isLoading, isFetching, isError, refetch } = useGetEnhetensFerdigstilteOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (data === undefined) {
    return null;
  }

  return (
    <section>
      <OppgaveTable
        heading="Fullførte oppgaver"
        columns={COLUMNS}
        params={params}
        setParams={setParams}
        data-testid="enhetens-ferdigstilte-oppgaver-table"
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.ENHETENS_FERDIGE}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        refetch={refetch}
        filters={data.filters}
      />
    </section>
  );
};
