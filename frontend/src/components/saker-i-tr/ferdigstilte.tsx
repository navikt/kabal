import { skipToken } from '@reduxjs/toolkit/query';
import { OppgaveTable } from '@/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@/components/common-table-components/types';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';
import { useGetSettingsQuery } from '@/redux-api/bruker';
import { useGetFerdigstilteAnkerITRQuery } from '@/redux-api/oppgaver/queries/oppgaver';
import { SortFieldEnum, SortOrderEnum } from '@/types/oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeForSakerITR,
  ColumnKeyEnum.UserYtelser,
  ColumnKeyEnum.AllRegistreringshjemler,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Finished,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.PreviousSaksbehandler,
  ColumnKeyEnum.Open,
];

const TABLE_KEY = OppgaveTableKey.SAKER_I_TR_FERDIGE;
const DEFAULT_SORTING = SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER;
const DEFAULT_REKKEFOELGE = SortOrderEnum.DESC;

export const SakerITRFerdigstilteTable = () => {
  const stateParams = useOppgaveTableState(TABLE_KEY, DEFAULT_SORTING, DEFAULT_REKKEFOELGE);

  const {
    data: settingsData,
    isLoading: isLoadingSettings,
    isError: isErrorSettings,
    isFetching: isFetchingSettings,
  } = useGetSettingsQuery();

  const params = settingsData === undefined ? skipToken : stateParams;

  const { data, isLoading, isFetching, isError, refetch } = useGetFerdigstilteAnkerITRQuery(params, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <SectionWithHeading heading="Fullførte oppgaver" size="small">
      <OppgaveTable
        zebraStripes
        columns={COLUMNS}
        behandlinger={data?.behandlinger}
        settingsKey={OppgaveTableRowsPerPage.SAKER_I_TR_FERDIGE}
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
