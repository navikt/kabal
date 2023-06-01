import { Alert, Heading, Table } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
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

const TABLE_HEADERS: (string | null)[] = [
  'Type',
  'Ytelse',
  'Hjemmel',
  'Alder',
  'Frist',
  'Tildeling',
  null,
  'Feilregistrering',
];

const COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.Type,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Hjemmel,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.Oppgavestyring,
  ColumnKeyEnum.Open,
  ColumnKeyEnum.Feilregistrering,
];

export const LedigeOppgaverTable = ({ oppgaveIds, onRefresh, isLoading }: Props) => {
  const { oppgaver, ...footerProps } = useOppgavePagination(OppgaveTableRowsPerPage.SEARCH_ACTIVE, oppgaveIds);

  if (oppgaveIds.length === 0) {
    return <Alert variant="info">Ingen oppgaver</Alert>;
  }

  return (
    <div>
      <Heading size="medium">Oppgaver</Heading>
      <StyledTable data-testid="search-result-active-oppgaver" zebraStripes>
        <TableHeader headers={TABLE_HEADERS} />
        <OppgaveRows
          testId="search-result-active-oppgaver"
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
          settingsKey={OppgaveTableRowsPerPage.SEARCH_ACTIVE}
          testId="search-result-active-oppgaver-footer"
        />
      </StyledTable>
    </div>
  );
};

const StyledTable = styled(Table)`
  max-width: 2500px;
  width: 100%;
`;
