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
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.PaaVentTil,
  ColumnKeyEnum.PaaVentReason,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.Open,
];

export const OppgaverPaaVentTable = ({ oppgaveIds, onRefresh, isLoading }: Props) => {
  const { oppgaver, ...footerProps } = useOppgavePagination(OppgaveTableRowsPerPage.SEARCH_PAA_VENT, oppgaveIds);

  if (oppgaveIds.length === 0) {
    return <Alert variant="info">Ingen oppgaver på vent</Alert>;
  }

  return (
    <div>
      <Heading size="medium">Oppgaver på vent</Heading>
      <Table data-testid="search-result-oppgaver-paa-vent" zebraStripes>
        <TableHeader columnKeys={COLUMNS} />
        <OppgaveRows
          testId="search-result-oppgaver-paa-vent"
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
          testId="search-result-oppgaver-paa-vent-footer"
        />
      </Table>
    </div>
  );
};
