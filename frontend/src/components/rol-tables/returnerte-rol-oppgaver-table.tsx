import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@app/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetReturnerteRolOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@app/types/bruker';
import { SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { Heading } from '@navikt/ds-react';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.RolYtelse,
  ColumnKeyEnum.RolInnsendingshjemler,
  ColumnKeyEnum.Navn,
  ColumnKeyEnum.Fnr,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Returnert,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.Open,
];

const TEST_ID = 'returnerte-oppgaver-table';

export const ReturnerteRolOppgaverTable = () => {
  const hasAccess = useHasRole(Role.KABAL_ROL);

  if (!hasAccess) {
    return null;
  }

  return <ReturnerteRolOppgaverTableInternal />;
};

const ReturnerteRolOppgaverTableInternal = () => {
  const params = useOppgaveTableState(
    OppgaveTableKey.ROL_RETURNERTE,
    SortFieldEnum.RETURNERT_FRA_ROL,
    SortOrderEnum.DESC,
  );

  const { data, isLoading, isFetching, isError, refetch } = useGetReturnerteRolOppgaverQuery(params, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <section>
      <Heading size="small">Returnerte oppgaver</Heading>
      <OppgaveTable
        columns={COLUMNS}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        refetch={refetch}
        data-testid={TEST_ID}
        settingsKey={OppgaveTableRowsPerPage.ROL_RETURNERTE}
        behandlinger={data?.behandlinger}
        zebraStripes
        tableKey={OppgaveTableKey.ROL_RETURNERTE}
        defaultRekkefoelge={SortOrderEnum.DESC}
        defaultSortering={SortFieldEnum.RETURNERT_FRA_ROL}
      />
    </section>
  );
};
