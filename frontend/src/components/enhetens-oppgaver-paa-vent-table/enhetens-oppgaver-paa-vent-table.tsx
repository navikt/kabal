import React, { useContext, useState } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetEnhetensVentendeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@app/types/bruker';
import { CommonOppgaverParams, EnhetensOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Innsendingshjemler,
  ColumnKeyEnum.RelevantOppgaver,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.PaaVentTil,
  ColumnKeyEnum.PaaVentReason,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.Medunderskriver,
  ColumnKeyEnum.Oppgavestyring,
  ColumnKeyEnum.Open,
];

export const EnhetensOppgaverPaaVentTable = () => {
  const hasAccess = useHasRole(Role.KABAL_INNSYN_EGEN_ENHET);

  if (!hasAccess) {
    return null;
  }

  return <EnhetensOppgaverPaaVentTableInternal />;
};

const EnhetensOppgaverPaaVentTableInternal = () => {
  const { user } = useContext(StaticDataContext);

  const [params, setParams] = useState<CommonOppgaverParams>({
    typer: [],
    ytelser: [],
    hjemler: [],
    tildelteSaksbehandlere: [],
    rekkefoelge: SortOrderEnum.STIGENDE,
    sortering: SortFieldEnum.PAA_VENT_TO,
  });

  const queryParams: EnhetensOppgaverParams = { ...params, enhetId: user.ansattEnhet.id };

  const { data, isError, isFetching, isLoading, refetch } = useGetEnhetensVentendeOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (data === undefined) {
    return null;
  }

  return (
    <section>
      <OppgaveTable
        heading="Oppgaver på vent"
        columns={COLUMNS}
        zebraStripes
        params={params}
        setParams={setParams}
        data-testid="enhetens-oppgaver-paa-vent-table"
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        refetch={refetch}
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.ENHETENS_VENTENDE}
        filters={data.filters}
      />
    </section>
  );
};
