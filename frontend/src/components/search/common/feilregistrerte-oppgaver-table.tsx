import { Alert, Heading } from '@navikt/ds-react';
import React from 'react';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';

interface Props {
  oppgaveIds: string[];
  onRefresh: () => void;
  isLoading: boolean;
}

const TEST_ID = 'search-result-feilregistrerte-oppgaver';

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Feilregistrert,
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Open,
];

export const FeilregistrerteOppgaverTable = ({ oppgaveIds, onRefresh, isLoading }: Props) => {
  if (oppgaveIds.length === 0) {
    return <Alert variant="info">Ingen feilregistrerte oppgaver</Alert>;
  }

  return (
    <div>
      <Heading size="medium">Feilregistrerte oppgaver</Heading>
      <OppgaveTable
        columns={COLUMNS}
        data-testid={TEST_ID}
        settingsKey={OppgaveTableRowsPerPage.SEARCH_FEILREGISTRERTE}
        isLoading={isLoading}
        isFetching={false}
        isError={false}
        behandlinger={oppgaveIds}
        refetch={onRefresh}
      />
    </div>
  );
};
