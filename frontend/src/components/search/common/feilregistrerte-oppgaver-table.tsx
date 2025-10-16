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

const TEST_ID = 'search-result-feilregistrerte-oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Feilregistrert,
  ColumnKeyEnum.TypeWithTrygderetten,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Innsendingshjemler,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Open,
];

export const FeilregistrerteOppgaverTable = ({ oppgaveIds, onRefresh, isLoading }: Props) => {
  if (oppgaveIds.length === 0) {
    return <Alert variant="info">Ingen feilregistrerte oppgaver</Alert>;
  }

  return (
    <section>
      <Heading size="small">Feilregistrerte oppgaver</Heading>
      <StaticOppgaveTableWithPageState
        columns={COLUMNS}
        data-testid={TEST_ID}
        settingsKey={OppgaveTableRowsPerPage.SEARCH_FEILREGISTRERTE}
        isLoading={isLoading}
        isFetching={false}
        isError={false}
        behandlinger={oppgaveIds}
        refetch={onRefresh}
        tableKey={StaticOppgaveTableKey.SEARCH_FEILREGISTRERTE}
      />
    </section>
  );
};
