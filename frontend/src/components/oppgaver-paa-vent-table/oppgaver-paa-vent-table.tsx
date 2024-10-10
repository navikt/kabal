import { Heading } from '@navikt/ds-react';
import { useState } from 'react';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetMineVentendeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@app/types/bruker';
import { CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeWithAnkeITrygderetten,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Innsendingshjemler,
  ColumnKeyEnum.Navn,
  ColumnKeyEnum.Fnr,
  ColumnKeyEnum.RelevantOppgaver,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.VarsletFrist,
  ColumnKeyEnum.PaaVentTil,
  ColumnKeyEnum.PaaVentReason,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.OppgavestyringNonFilterable,
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
  const [params, setParams] = useState<CommonOppgaverParams>({
    typer: [],
    ytelser: [],
    hjemler: [],
    sortering: SortFieldEnum.PAA_VENT_TO,
    rekkefoelge: SortOrderEnum.STIGENDE,
  });

  const { data, isError, isFetching, isLoading, refetch } = useGetMineVentendeOppgaverQuery(params, {
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
