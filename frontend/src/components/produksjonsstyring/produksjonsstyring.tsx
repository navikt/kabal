import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useGetSettingsQuery } from '@app/redux-api/bruker';
import { useGetLedigeOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { type CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Innsendingshjemler,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.VarsletFrist,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.Tildeling,
];

export const Produksjonsstyring = () => {
  const [params, setParams] = useState<CommonOppgaverParams>({
    typer: [],
    ytelser: [],
    hjemler: [],
    sortering: SortFieldEnum.FRIST,
    rekkefoelge: SortOrderEnum.STIGENDE,
  });

  const {
    data: settingsData,
    isLoading: isLoadingSettings,
    isError: isErrorSettings,
    isFetching: isFetchingSettings,
  } = useGetSettingsQuery();

  const queryParams: typeof skipToken | CommonOppgaverParams = typeof settingsData === 'undefined' ? skipToken : params;

  const { data, isFetching, isLoading, isError, refetch } = useGetLedigeOppgaverQuery(queryParams, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <OppgaveTable
      data-testid="oppgave-table"
      zebraStripes
      columns={COLUMNS}
      params={params}
      setParams={setParams}
      behandlinger={data?.behandlinger}
      settingsKey={OppgaveTableRowsPerPage.PRODUKSJONSSTYRING}
      isLoading={isLoading || isLoadingSettings}
      isFetching={isFetching || isFetchingSettings}
      isError={isError || isErrorSettings}
      refetch={refetch}
    />
  );
};
