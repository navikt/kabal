import { Heading } from '@navikt/ds-react';
import { useState } from 'react';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetReturnerteRolOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@app/types/bruker';
import { CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

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

const EMPTY_ARRAY: string[] = [];

export const ReturnerteRolOppgaverTable = () => {
  const hasAccess = useHasRole(Role.KABAL_ROL);

  if (!hasAccess) {
    return null;
  }

  return <ReturnerteRolOppgaverTableInternal />;
};

const ReturnerteRolOppgaverTableInternal = () => {
  const [params, setParams] = useState<CommonOppgaverParams>({
    sortering: SortFieldEnum.RETURNERT_FRA_ROL,
    rekkefoelge: SortOrderEnum.SYNKENDE,
    typer: [],
    ytelser: EMPTY_ARRAY,
    hjemler: EMPTY_ARRAY,
    tildelteSaksbehandlere: EMPTY_ARRAY,
  });

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
        settingsKey={OppgaveTableRowsPerPage.MINE_RETURNERTE}
        behandlinger={data?.behandlinger}
        params={params}
        setParams={setParams}
        zebraStripes
      />
    </section>
  );
};
