import { Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { OppgaveTable } from '@/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';
import { useHasRole } from '@/hooks/use-has-role';
import { useGetSettingsQuery } from '@/redux-api/bruker';
import { useGetLedigeRolOppgaverQuery } from '@/redux-api/oppgaver/queries/oppgaver';
import { Role } from '@/types/bruker';
import { type CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@/types/oppgaver';

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
