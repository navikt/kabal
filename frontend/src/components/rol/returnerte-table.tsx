import { StaticDataContext } from '@app/components/app/static-data-context';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@app/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetRolReturnerteOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@app/types/bruker';
import { type EnhetensOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { Heading } from '@navikt/ds-react';
import { useContext } from 'react';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.RolYtelse,
  ColumnKeyEnum.RolInnsendingshjemler,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.VarsletFrist,
  ColumnKeyEnum.Finished,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.Open,
];

export const ReturnerteRolOppgaverTable = () => {
  const hasAccess = useHasRole(Role.KABAL_KROL);

  if (!hasAccess) {
    return null;
  }

  return <ReturnerteRolOppgaverTableInternal />;
};

const ReturnerteRolOppgaverTableInternal = () => {
  const params = useOppgaveTableState(
    OppgaveTableKey.ROL_FERDIGE,
    SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER,
    SortOrderEnum.DESC,
  );

  const { user } = useContext(StaticDataContext);

  const queryParams: EnhetensOppgaverParams = { ...params, enhetId: user.ansattEnhet.id };

  const { data, isLoading, isFetching, isError, refetch } = useGetRolReturnerteOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <section>
      <Heading size="small">Returnerte oppgaver</Heading>
      <OppgaveTable
        columns={COLUMNS}
        data-testid="rol-ferdigstilte-oppgaver-table"
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.ROL_FERDIGE}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        refetch={refetch}
        tableKey={OppgaveTableKey.ROL_FERDIGE}
        defaultRekkefoelge={SortOrderEnum.DESC}
        defaultSortering={SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER}
      />
    </section>
  );
};
