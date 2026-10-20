import { StaticOppgaveTableWithPageState } from '@/components/common-table-components/oppgave-table/static-oppgave-table';
import { StaticOppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@/components/common-table-components/types';
import { InfoBox } from '@/components/info-box/info-box';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';

interface Props {
  oppgaveIds: string[];
  onRefresh: () => void;
  isLoading: boolean;
}

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeWithTrygderetten,
  ColumnKeyEnum.AccessYtelser,
  ColumnKeyEnum.AccessInnsendingshjemler,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.VarsletFrist,
  ColumnKeyEnum.PaaVentTil,
  ColumnKeyEnum.PaaVentReason,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.OpenWithYtelseAccess,
  ColumnKeyEnum.OppgavestyringNonFilterable,
];

export const OppgaverPaaVentTable = ({ oppgaveIds, onRefresh, isLoading }: Props) => {
  if (oppgaveIds.length === 0) {
    return <InfoBox variant="info">Ingen oppgaver på vent</InfoBox>;
  }

  return (
    <SectionWithHeading heading="Oppgaver på vent" size="small">
      <StaticOppgaveTableWithPageState
        columns={COLUMNS}
        zebraStripes
        behandlinger={oppgaveIds}
        isLoading={isLoading}
        isFetching={false}
        isError={false}
        refetch={onRefresh}
        settingsKey={OppgaveTableRowsPerPage.SEARCH_VENTENDE}
        tableKey={StaticOppgaveTableKey.SEARCH_VENTENDE}
      />
    </SectionWithHeading>
  );
};
