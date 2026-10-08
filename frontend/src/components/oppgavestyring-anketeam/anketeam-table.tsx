import { OppgaveTable } from '@/components/common-table-components/oppgave-table/oppgave-table';
import { useOppgaveTableState } from '@/components/common-table-components/oppgave-table/state/state';
import { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@/components/common-table-components/types';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';
import {
  useGetAnketeamFerdigstilteOppgaverQuery,
  useGetAnketeamLedigeOppgaverQuery,
  useGetAnketeamTildelteOppgaverQuery,
  useGetAnketeamVentendeOppgaverQuery,
} from '@/redux-api/oppgaver/queries/oppgaver';
import { SortFieldEnum, SortOrderEnum } from '@/types/oppgaver';

interface Props {
  heading: string;
  useQuery: typeof useGetAnketeamLedigeOppgaverQuery;
  columns: ColumnKeyEnum[];
  tableKey: OppgaveTableKey;
  settingsKey: OppgaveTableRowsPerPage;
  defaultSortering: SortFieldEnum;
  defaultRekkefoelge: SortOrderEnum;
}

const AnketeamTable = ({
  heading,
  useQuery,
  columns,
  tableKey,
  settingsKey,
  defaultSortering,
  defaultRekkefoelge,
}: Props) => {
  const params = useOppgaveTableState(tableKey, defaultSortering, defaultRekkefoelge);

  const { data, isLoading, isFetching, isError, refetch } = useQuery(params, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  return (
    <SectionWithHeading heading={heading} size="small">
      <OppgaveTable
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        refetch={refetch}
        columns={columns}
        behandlinger={data?.behandlinger}
        settingsKey={settingsKey}
        tableKey={tableKey}
        defaultRekkefoelge={defaultRekkefoelge}
        defaultSortering={defaultSortering}
      />
    </SectionWithHeading>
  );
};

export const LedigeAnkerTable = () => (
  <AnketeamTable
    heading="Ledige"
    useQuery={useGetAnketeamLedigeOppgaverQuery}
    columns={[
      ColumnKeyEnum.ReadOnlyType,
      ColumnKeyEnum.AllYtelser,
      ColumnKeyEnum.AllInnsendingshjemler,
      ColumnKeyEnum.RelevantOppgaver,
      ColumnKeyEnum.Saksnummer,
      ColumnKeyEnum.Age,
      ColumnKeyEnum.Deadline,
      ColumnKeyEnum.FlowStatesWithoutSelf,
      ColumnKeyEnum.Open,
      ColumnKeyEnum.Oppgavestyring,
    ]}
    tableKey={OppgaveTableKey.ANKETEAM_LEDIGE}
    settingsKey={OppgaveTableRowsPerPage.ANKETEAM_LEDIGE}
    defaultSortering={SortFieldEnum.FRIST}
    defaultRekkefoelge={SortOrderEnum.ASC}
  />
);

export const TildelteAnkerTable = () => (
  <AnketeamTable
    heading="Tildelte"
    useQuery={useGetAnketeamTildelteOppgaverQuery}
    columns={[
      ColumnKeyEnum.TypeForAnkerAfter2027,
      ColumnKeyEnum.AllYtelser,
      ColumnKeyEnum.AllInnsendingshjemler,
      ColumnKeyEnum.RelevantOppgaver,
      ColumnKeyEnum.Saksnummer,
      ColumnKeyEnum.Age,
      ColumnKeyEnum.Deadline,
      ColumnKeyEnum.FlowStatesWithoutSelf,
      ColumnKeyEnum.Open,
      ColumnKeyEnum.Medunderskriver,
      ColumnKeyEnum.Oppgavestyring,
    ]}
    tableKey={OppgaveTableKey.ANKETEAM_TILDELTE}
    settingsKey={OppgaveTableRowsPerPage.ANKETEAM_TILDELTE}
    defaultSortering={SortFieldEnum.FRIST}
    defaultRekkefoelge={SortOrderEnum.ASC}
  />
);

export const AnkerPåVentTable = () => (
  <AnketeamTable
    heading="På vent"
    useQuery={useGetAnketeamVentendeOppgaverQuery}
    columns={[
      ColumnKeyEnum.TypeForAnkerAfter2027,
      ColumnKeyEnum.AllYtelser,
      ColumnKeyEnum.AllInnsendingshjemler,
      ColumnKeyEnum.RelevantOppgaver,
      ColumnKeyEnum.Saksnummer,
      ColumnKeyEnum.Age,
      ColumnKeyEnum.Deadline,
      ColumnKeyEnum.PaaVentTil,
      ColumnKeyEnum.PaaVentReason,
      ColumnKeyEnum.Utfall,
      ColumnKeyEnum.Open,
      ColumnKeyEnum.Medunderskriver,
      ColumnKeyEnum.Oppgavestyring,
    ]}
    tableKey={OppgaveTableKey.ANKETEAM_VENTENDE}
    settingsKey={OppgaveTableRowsPerPage.ANKETEAM_VENTENDE}
    defaultSortering={SortFieldEnum.PAA_VENT_TO}
    defaultRekkefoelge={SortOrderEnum.ASC}
  />
);

export const FerdigstilteAnkerTable = () => (
  <AnketeamTable
    heading="Fullførte"
    useQuery={useGetAnketeamFerdigstilteOppgaverQuery}
    columns={[
      ColumnKeyEnum.TypeForAnkerAfter2027,
      ColumnKeyEnum.AllYtelser,
      ColumnKeyEnum.AllRegistreringshjemler,
      ColumnKeyEnum.Saksnummer,
      ColumnKeyEnum.Finished,
      ColumnKeyEnum.Utfall,
      ColumnKeyEnum.PreviousSaksbehandler,
      ColumnKeyEnum.Open,
    ]}
    tableKey={OppgaveTableKey.ANKETEAM_FERDIGE}
    settingsKey={OppgaveTableRowsPerPage.ANKETEAM_FERDIGE}
    defaultSortering={SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER}
    defaultRekkefoelge={SortOrderEnum.DESC}
  />
);
