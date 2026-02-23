import { Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { OppgaveTable } from '@/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';
import { useGetSettingsQuery } from '@/redux-api/bruker';
import { useGetLedigeOppgaverITRQuery } from '@/redux-api/oppgaver/queries/oppgaver';
import { SortFieldEnum, SortOrderEnum } from '@/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeForSakerITR,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Innsendingshjemler,
  ColumnKeyEnum.RelevantOppgaver,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.PreviousSaksbehandler,
  ColumnKeyEnum.DatoSendtTilTr,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.Oppgavestyring,
];

const TABLE_KEY = OppgaveTableKey.SAKER_I_TR_LEDIGE;
const DEFAULT_SORTING = SortFieldEnum.ALDER;
const DEFAULT_REKKEFOELGE = SortOrderEnum.DESC;

export const LedigeSakerITRTable = () => {
  const stateParams = useOppgaveTableState(TABLE_KEY, DEFAULT_SORTING, DEFAULT_REKKEFOELGE);

  const {
    data: settingsData,
    isLoading: isLoadingSettings,
    isError: isErrorSettings,
    isFetching: isFetchingSettings,
  } = useGetSettingsQuery();

  const params = settingsData === undefined ? skipToken : stateParams;

  const { data, isLoading, isFetching, isError, refetch } = useGetLedigeOppgaverITRQuery(params, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <section>
      <Heading size="small">Ledige oppgaver</Heading>
      <OppgaveTable
        zebraStripes
        columns={COLUMNS}
        data-testid="saker-i-tr-ledige-table"
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.SAKER_I_TR_LEDIGE}
        isLoading={isLoading || isLoadingSettings}
        isFetching={isFetching || isFetchingSettings}
        isError={isError || isErrorSettings}
        refetch={refetch}
        tableKey={TABLE_KEY}
        defaultRekkefoelge={DEFAULT_REKKEFOELGE}
        defaultSortering={DEFAULT_SORTING}
      />
    </section>
  );
};
