import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@app/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useHasRole } from '@app/hooks/use-has-role';
import { useGetSettingsQuery } from '@app/redux-api/bruker';
import { useGetLedigeRolOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@app/types/bruker';
import { type CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.RolYtelse,
  ColumnKeyEnum.RolInnsendingshjemler,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.VarsletFrist,
  ColumnKeyEnum.RolTildeling,
];

export const LedigeRolOppgaverTable = () => {
  const hasAccess = useHasRole(Role.KABAL_ROL);

  if (!hasAccess) {
    return null;
  }

  return <LedigeOppgaverTableInternal />;
};

const LedigeOppgaverTableInternal = (): React.JSX.Element => {
  const params = useOppgaveTableState(OppgaveTableKey.ROL_LEDIGE, SortFieldEnum.FRIST, SortOrderEnum.ASC);

  const {
    data: settingsData,
    isLoading: isLoadingSettings,
    isError: isErrorSettings,
    isFetching: isFetchingSettings,
  } = useGetSettingsQuery();

  const queryParams: typeof skipToken | CommonOppgaverParams = typeof settingsData === 'undefined' ? skipToken : params;

  const { data, isFetching, isLoading, isError, refetch } = useGetLedigeRolOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <section>
      <Heading level="1" size="small">
        Ledige oppgaver
      </Heading>
      <OppgaveTable
        data-testid="oppgave-table"
        zebraStripes
        columns={COLUMNS}
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.ROL_LEDIGE}
        isLoading={isLoading || isLoadingSettings}
        isFetching={isFetching || isFetchingSettings}
        isError={isError || isErrorSettings}
        refetch={refetch}
        tableKey={OppgaveTableKey.ROL_LEDIGE}
        defaultRekkefoelge={SortOrderEnum.ASC}
        defaultSortering={SortFieldEnum.FRIST}
      />
    </section>
  );
};
