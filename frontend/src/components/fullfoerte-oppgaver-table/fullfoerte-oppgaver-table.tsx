import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@app/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetMineFerdigstilteOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@app/types/bruker';
import { SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { Heading } from '@navikt/ds-react';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeWithAnkeITrygderetten,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Registreringshjemler,
  ColumnKeyEnum.Navn,
  ColumnKeyEnum.Fnr,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Finished,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.Open,
];

const TEST_ID = 'fullfoerte-oppgaver-table';

export const FullfoerteOppgaverTable = () => {
  const hasAccess = useHasRole(Role.KABAL_SAKSBEHANDLING);

  if (!hasAccess) {
    return null;
  }

  return <FullfoerteOppgaverTableInternal />;
};

const FullfoerteOppgaverTableInternal = () => {
  const params = useOppgaveTableState(
    OppgaveTableKey.MINE_RETURNERTE,
    SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER,
    SortOrderEnum.DESC,
  );

  const { data, isLoading, isFetching, isError, refetch } = useGetMineFerdigstilteOppgaverQuery(params, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <section>
      <Heading size="small">Fullførte oppgaver</Heading>
      <OppgaveTable
        columns={COLUMNS}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        refetch={refetch}
        data-testid={TEST_ID}
        settingsKey={OppgaveTableRowsPerPage.MINE_RETURNERTE}
        behandlinger={data?.behandlinger}
        zebraStripes
        tableKey={OppgaveTableKey.MINE_RETURNERTE}
        defaultRekkefoelge={SortOrderEnum.DESC}
        defaultSortering={SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER}
      />
    </section>
  );
};
