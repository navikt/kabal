import { StaticDataContext } from '@app/components/app/static-data-context';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetEnhetensFerdigstilteOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@app/types/bruker';
import {
  type CommonOppgaverParams,
  type EnhetensOppgaverParams,
  SortFieldEnum,
  SortOrderEnum,
} from '@app/types/oppgaver';
import { Heading } from '@navikt/ds-react';
import { useContext, useState } from 'react';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeWithAnkeITrygderetten,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Registreringshjemler,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.VarsletFrist,
  ColumnKeyEnum.Finished,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.PreviousSaksbehandler,
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

  return (
    <section>
      <Heading size="small">Fullførte oppgaver</Heading>
      <OppgaveTable
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
      />
    </section>
  );
};
