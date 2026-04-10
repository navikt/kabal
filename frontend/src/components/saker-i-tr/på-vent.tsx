import { skipToken } from '@reduxjs/toolkit/query';
import { OppgaveTable } from '@/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@/components/common-table-components/types';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';
import { useGetSettingsQuery } from '@/redux-api/bruker';
import { useGetVentendeOppgaverITRQuery } from '@/redux-api/oppgaver/queries/oppgaver';
import { SortFieldEnum, SortOrderEnum } from '@/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeForSakerITR,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Innsendingshjemler,
  ColumnKeyEnum.RelevantOppgaver,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.PaaVentTil,
  ColumnKeyEnum.PaaVentReason,
  ColumnKeyEnum.DatoSendtTilTr,
  ColumnKeyEnum.FlowStatesWithoutSelf,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.Oppgavestyring,
];

const TABLE_KEY = OppgaveTableKey.SAKER_I_TR_VENTENDE;
const DEFAULT_SORTING = SortFieldEnum.PAA_VENT_TO;
const DEFAULT_REKKEFOELGE = SortOrderEnum.DESC;

export const SakerITRPåVentTable = () => {
  const stateParams = useOppgaveTableState(TABLE_KEY, DEFAULT_SORTING, DEFAULT_REKKEFOELGE);

  const {
    data: settingsData,
    isLoading: isLoadingSettings,
    isError: isErrorSettings,
    isFetching: isFetchingSettings,
  } = useGetSettingsQuery();

  const params = settingsData === undefined ? skipToken : stateParams;

  const { data, isLoading, isFetching, isError, refetch } = useGetVentendeOppgaverITRQuery(params, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <SectionWithHeading heading="Oppgaver på vent" size="small">
      <OppgaveTable
        zebraStripes
        columns={COLUMNS}
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.SAKER_I_TR_VENTENDE}
        isLoading={isLoading || isLoadingSettings}
        isFetching={isFetching || isFetchingSettings}
        isError={isError || isErrorSettings}
        refetch={refetch}
        tableKey={TABLE_KEY}
        defaultRekkefoelge={DEFAULT_REKKEFOELGE}
        defaultSortering={DEFAULT_SORTING}
      />
    </SectionWithHeading>
  );
};
