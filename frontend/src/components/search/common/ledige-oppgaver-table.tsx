import { Alert, Heading } from '@navikt/ds-react';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';

interface Props {
  oppgaveIds: string[];
  onRefresh: () => void;
  isLoading: boolean;
}

const TEST_ID = 'search-result-active-oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeWithAnkeITrygderetten,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Innsendingshjemler,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.PreviousSaksbehandler,
  ColumnKeyEnum.DatoSendtTilTr,
  ColumnKeyEnum.OppgavestyringNonFilterable,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.Feilregistrering,
];

export const LedigeOppgaverTable = ({ oppgaveIds, onRefresh, isLoading }: Props) => {
  if (oppgaveIds.length === 0) {
    return <Alert variant="info">Ingen oppgaver</Alert>;
  }

  return (
    <section>
      <Heading size="small">Oppgaver</Heading>
      <OppgaveTable
        columns={COLUMNS}
        data-testid={TEST_ID}
        isLoading={isLoading}
        isFetching={false}
        isError={false}
        refetch={onRefresh}
        behandlinger={oppgaveIds}
        settingsKey={OppgaveTableRowsPerPage.SEARCH_ACTIVE}
      />
    </section>
  );
};
