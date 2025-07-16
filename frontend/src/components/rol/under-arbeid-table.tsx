import { StaticDataContext } from '@app/components/app/static-data-context';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@app/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useSakstyper } from '@app/hooks/use-kodeverk-value';
import { useGetRolUferdigeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@app/types/bruker';
import { type EnhetensOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.RolYtelse,
  ColumnKeyEnum.RolInnsendingshjemler,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.VarsletFrist,
  ColumnKeyEnum.Rol,
  ColumnKeyEnum.Open,
];

export const RolOppgaverTable = () => {
  const hasAccess = useHasRole(Role.KABAL_KROL);

  if (!hasAccess) {
    return null;
  }

  return <RolOppgaverTableInternal />;
};

const RolOppgaverTableInternal = () => {
  const params = useOppgaveTableState(OppgaveTableKey.ROL_UFERDIGE, SortFieldEnum.FRIST, SortOrderEnum.ASC);

  const types = useSakstyper();

  const { user } = useContext(StaticDataContext);

  const queryParams: typeof skipToken | EnhetensOppgaverParams =
    typeof types === 'undefined' ? skipToken : { ...params, enhetId: user.ansattEnhet.id };

  const { data, isLoading, isFetching, isError, refetch } = useGetRolUferdigeOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <section>
      <Heading size="small">Tildelte oppgaver</Heading>
      <OppgaveTable
        columns={COLUMNS}
        data-testid="rol-oppgaver-table"
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.ROL_UFERDIGE}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        refetch={refetch}
        tableKey={OppgaveTableKey.ROL_UFERDIGE}
        defaultRekkefoelge={SortOrderEnum.ASC}
        defaultSortering={SortFieldEnum.FRIST}
      />
    </section>
  );
};
