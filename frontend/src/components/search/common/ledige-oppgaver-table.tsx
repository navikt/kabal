import { Heading } from '@navikt/ds-react';
import { Alert } from '@/components/alert/alert';
import { StaticOppgaveTableWithPageState } from '@/components/common-table-components/oppgave-table/static-oppgave-table';
import { StaticOppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';
import { ColumnKeyEnum } from '@/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@/hooks/settings/use-setting';

interface Props {
  oppgaveIds: string[];
  onRefresh: () => void;
  isLoading: boolean;
}

const TEST_ID = 'search-result-active-oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeWithTrygderetten,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Innsendingshjemler,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.VarsletFrist,
  ColumnKeyEnum.PreviousSaksbehandler,
  ColumnKeyEnum.DatoSendtTilTr,
  ColumnKeyEnum.OpenWithYtelseAccess,
  ColumnKeyEnum.OppgavestyringNonFilterable,
];

export const LedigeOppgaverTable = ({ oppgaveIds, onRefresh, isLoading }: Props) => {
  if (oppgaveIds.length === 0) {
    return <Alert variant="info">Ingen oppgaver</Alert>;
  }

  return (
    <section>
      <Heading size="small">Oppgaver</Heading>
      <StaticOppgaveTableWithPageState
        columns={COLUMNS}
        data-testid={TEST_ID}
        isLoading={isLoading}
        isFetching={false}
        isError={false}
        refetch={onRefresh}
        behandlinger={oppgaveIds}
        settingsKey={OppgaveTableRowsPerPage.SEARCH_ACTIVE}
        tableKey={StaticOppgaveTableKey.SEARCH_ACTIVE}
        resetPageOnLoad
      />
    </section>
  );
};
