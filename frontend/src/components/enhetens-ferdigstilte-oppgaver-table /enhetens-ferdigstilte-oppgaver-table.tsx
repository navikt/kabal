import { Heading } from '@navikt/ds-react';
import { useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { OppgaveTable } from '@/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';
import { useHasRole } from '@/hooks/use-has-role';
import { useGetEnhetensFerdigstilteOppgaverQuery } from '@/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@/types/bruker';
import { type EnhetensOppgaverParams, SortFieldEnum, SortOrderEnum } from '@/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeWithTrygderetten,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Registreringshjemler,
  ColumnKeyEnum.Saksnummer,
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
  const params = useOppgaveTableState(
    OppgaveTableKey.ENHETENS_FERDIGE,
    SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER,
    SortOrderEnum.DESC,
  );

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
        data-testid="enhetens-ferdigstilte-oppgaver-table"
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.ENHETENS_FERDIGE}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        refetch={refetch}
        tableKey={OppgaveTableKey.ENHETENS_FERDIGE}
        defaultRekkefoelge={SortOrderEnum.DESC}
        defaultSortering={SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER}
      />
    </section>
  );
};
