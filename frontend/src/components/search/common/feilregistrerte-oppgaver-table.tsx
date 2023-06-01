import { Alert, Heading, Table } from '@navikt/ds-react';
import React from 'react';
import { TableFooter } from '@app/components/common-table-components/footer';
import { TableHeader } from '@app/components/common-table-components/header';
import { OppgaveRows } from '@app/components/common-table-components/oppgave-rows/oppgave-rows';
import { ColumnKeyEnum } from '@app/components/common-table-components/oppgave-rows/types';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useOppgavePagination } from '@app/hooks/use-oppgave-pagination';

interface Props {
  oppgaveIds: string[];
  onRefresh: () => void;
  isLoading: boolean;
}

const TABLE_HEADERS: (string | null)[] = ['Tidspunkt for feilregistrering', 'Type', 'Ytelse', 'Hjemmel', null];
const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Feilregistrering,
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Open,
];

export const FeilregistrerteOppgaverTable = ({ oppgaveIds, onRefresh, isLoading }: Props) => {
  const { oppgaver, ...footerProps } = useOppgavePagination(OppgaveTableRowsPerPage.SEARCH_DONE, oppgaveIds);

  if (oppgaveIds.length === 0) {
    return <Alert variant="info">Ingen feilregistrerte oppgaver</Alert>;
  }

  return (
    <div>
      <Heading size="medium">Feilregistrerte oppgaver</Heading>
      <Table data-testid="search-result-feilregistrerte-oppgaver" zebraStripes>
        <TableHeader headers={TABLE_HEADERS} />
        <OppgaveRows
          testId="search-result-feilregistrerte-oppgaver"
          oppgaver={oppgaver}
          columns={COLUMNS}
          isLoading={false}
          isFetching={false}
          isError={false}
          pageSize={footerProps.pageSize}
        />
        <TableFooter
          {...footerProps}
          columnCount={COLUMNS.length}
          settingsKey={OppgaveTableRowsPerPage.SEARCH_FEILREGISTRERTE}
          onRefresh={onRefresh}
          isLoading={isLoading}
          testId="search-result-feilregistrerte-oppgaver-footer"
        />
      </Table>
    </div>
  );
};
