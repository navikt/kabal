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
  ColumnKeyEnum.TypeWithTrygderetten,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Registreringshjemler,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Finished,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.Tildeling,
  ColumnKeyEnum.OpenWithYtelseAccess,
];

export const FullfoerteOppgaverTable = ({ oppgaveIds, onRefresh, isLoading }: Props) => {
  if (oppgaveIds.length === 0) {
    return <Alert variant="info">Ingen fullførte oppgaver</Alert>;
  }

  return (
    <section>
      <Heading size="small">Fullførte oppgaver</Heading>
      <StaticOppgaveTableWithPageState
        columns={COLUMNS}
        isLoading={isLoading}
        isFetching={false}
        isError={false}
        behandlinger={oppgaveIds}
        refetch={onRefresh}
        settingsKey={OppgaveTableRowsPerPage.SEARCH_FERDIGE}
        data-testid="search-result-fullfoerte-oppgaver"
        tableKey={StaticOppgaveTableKey.SEARCH_FERDIGE}
      />
    </section>
  );
};
