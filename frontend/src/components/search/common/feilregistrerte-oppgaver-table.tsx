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
  ColumnKeyEnum.Feilregistrert,
  ColumnKeyEnum.AllTypes,
  ColumnKeyEnum.AccessYtelser,
  ColumnKeyEnum.AccessInnsendingshjemler,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Open,
];

export const FeilregistrerteOppgaverTable = ({ oppgaveIds, onRefresh, isLoading }: Props) => {
  if (oppgaveIds.length === 0) {
    return <InfoBox variant="info">Ingen feilregistrerte oppgaver</InfoBox>;
  }

  return (
    <SectionWithHeading heading="Feilregistrerte oppgaver" size="small">
      <StaticOppgaveTableWithPageState
        columns={COLUMNS}
        settingsKey={OppgaveTableRowsPerPage.SEARCH_FEILREGISTRERTE}
        isLoading={isLoading}
        isFetching={false}
        isError={false}
        behandlinger={oppgaveIds}
        refetch={onRefresh}
        tableKey={StaticOppgaveTableKey.SEARCH_FEILREGISTRERTE}
      />
    </SectionWithHeading>
  );
};
