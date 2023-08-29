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

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Finished,
  ColumnKeyEnum.Tildeling,
  ColumnKeyEnum.Open,
];

export const FullfoerteOppgaverTable = ({ oppgaveIds, onRefresh, isLoading }: Props) => {
  if (oppgaveIds.length === 0) {
    return <Alert variant="info">Ingen fullførte oppgaver siste 12 måneder</Alert>;
  }

  return (
    <section>
      <Heading size="small">Fullførte oppgaver siste 12 måneder</Heading>
      <OppgaveTable
        columns={COLUMNS}
        isLoading={isLoading}
        isFetching={false}
        isError={false}
        behandlinger={oppgaveIds}
        refetch={onRefresh}
        settingsKey={OppgaveTableRowsPerPage.SEARCH_DONE}
        data-testid="search-result-fullfoerte-oppgaver"
      />
    </section>
  );
};
