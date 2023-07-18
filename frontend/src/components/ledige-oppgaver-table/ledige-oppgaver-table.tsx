import { BodyShort } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useState } from 'react';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useGetSettingsQuery } from '@app/redux-api/bruker';
import {
  useGetAntallLedigeOppgaverMedUtgaatteFristerQuery,
  useGetLedigeOppgaverQuery,
} from '@app/redux-api/oppgaver/queries/oppgaver';
import { CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.OppgavestyringNonFilterable,
];

export const LedigeOppgaverTable = (): JSX.Element => {
  const [params, setParams] = useState<CommonOppgaverParams>({
    types: [],
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

  const { data: utgaatte } = useGetAntallLedigeOppgaverMedUtgaatteFristerQuery(
    queryParams === skipToken ? skipToken : { ...queryParams, ferdigstiltDaysAgo: 7 }
  );

  return (
    <>
      <OppgaveTable
        data-testid="oppgave-table"
        zebraStripes
        columns={COLUMNS}
        params={params}
        setParams={setParams}
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.LEDIGE}
        isLoading={isLoading || isLoadingSettings}
        isFetching={isFetching || isFetchingSettings}
        isError={isError || isErrorSettings}
        refetch={refetch}
      />
      <BodyShort size="small">Antall oppgaver med utgåtte frister: {utgaatte?.antall ?? 0}</BodyShort>
    </>
  );
};
