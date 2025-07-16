import { StaticOppgaveTableWithPageState } from '@app/components/common-table-components/oppgave-table/static-oppgave-table';
import { StaticOppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { Alert, Heading } from '@navikt/ds-react';

interface Props {
  oppgaveIds: string[];
  onRefresh: () => void;
  isLoading: boolean;
}

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeWithAnkeITrygderetten,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Innsendingshjemler,
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
    return <Alert variant="info">Ingen oppgaver på vent</Alert>;
  }

  return (
    <section>
      <Heading size="small">Oppgaver på vent</Heading>
      <StaticOppgaveTableWithPageState
        columns={COLUMNS}
        data-testid="search-result-oppgaver-paa-vent"
        zebraStripes
        behandlinger={oppgaveIds}
        isLoading={isLoading}
        isFetching={false}
        isError={false}
        refetch={onRefresh}
        settingsKey={OppgaveTableRowsPerPage.SEARCH_VENTENDE}
        tableKey={StaticOppgaveTableKey.SEARCH_VENTENDE}
      />
    </section>
  );
};
