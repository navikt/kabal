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

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Finished,
  ColumnKeyEnum.Tildeling,
  ColumnKeyEnum.Open,
];

export const FullfoerteOppgaverTable = ({ oppgaveIds, onRefresh, isLoading }: Props) => {
  const { oppgaver, ...footerProps } = useOppgavePagination(OppgaveTableRowsPerPage.SEARCH_DONE, oppgaveIds);

  if (oppgaveIds.length === 0) {
    return <Alert variant="info">Ingen fullførte oppgaver siste 12 måneder</Alert>;
  }

  return (
    <div>
      <Heading size="medium">Fullførte oppgaver siste 12 måneder</Heading>
      <Table data-testid="search-result-fullfoerte-oppgaver" zebraStripes>
        <TableHeader columnKeys={COLUMNS} />
        <OppgaveRows
          testId="search-result-fullfoerte-oppgaver"
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
          onRefresh={onRefresh}
          isLoading={isLoading}
          settingsKey={OppgaveTableRowsPerPage.SEARCH_DONE}
          testId="search-result-fullfoerte-oppgaver-footer"
        />
      </Table>
    </div>
  );
};
