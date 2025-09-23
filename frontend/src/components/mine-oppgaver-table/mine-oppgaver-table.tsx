import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@app/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetMineUferdigeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@app/types/bruker';
import { SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { Heading } from '@navikt/ds-react';

const TEST_ID = 'mine-oppgaver-table';

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
  ColumnKeyEnum.FlowStatesWithSelf,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.OppgavestyringNonFilterable,
];

export const MineOppgaverTable = () => {
  const hasAccess = useHasRole(Role.KABAL_SAKSBEHANDLING);

  if (!hasAccess) {
    return null;
  }

  return <MineOppgaverTableInternal />;
};

const MineOppgaverTableInternal = () => {
  const params = useOppgaveTableState(OppgaveTableKey.MINE_UFERDIGE, SortFieldEnum.FRIST, SortOrderEnum.ASC);

  const { data, isError, isLoading, isFetching, refetch } = useGetMineUferdigeOppgaverQuery(params, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <section>
      <Heading size="small">Oppgaver under arbeid</Heading>
      <OppgaveTable
        columns={COLUMNS}
        isError={isError}
        isLoading={isLoading}
        isFetching={isFetching}
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.MINE_UFERDIGE}
        refetch={refetch}
        data-testid={TEST_ID}
        tableKey={OppgaveTableKey.MINE_UFERDIGE}
        defaultRekkefoelge={SortOrderEnum.ASC}
        defaultSortering={SortFieldEnum.FRIST}
      />
    </section>
  );
};
