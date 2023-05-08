import { Alert, Heading, Table } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { TableFooter } from '@app/components/common-table-components/footer';
import { LoadingRow } from '@app/components/common-table-components/loading-row';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import { useGetOppgaveQuery } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { Age } from '../../common-table-components/age';
import { Deadline } from '../../common-table-components/deadline';
import { Hjemmel } from '../../common-table-components/hjemmel';
import { OpenOppgavebehandling } from '../../common-table-components/open';
import { Ytelse } from '../../common-table-components/ytelse';
import { Oppgavestyring } from '../../oppgavestyring/oppgavestyring';
import { Type } from '../../type/type';

interface Props {
  oppgaveIds: string[];
}

export const ActiveOppgaverTable = ({ oppgaveIds }: Props) => {
  const { oppgaver, ...footerProps } = useOppgavePagination(OppgaveTableRowsPerPage.SEARCH_ACTIVE, oppgaveIds);

  if (oppgaveIds.length === 0) {
    return <Alert variant="info">Ingen aktive oppgaver</Alert>;
  }

  return (
    <div>
      <Heading size="medium">Aktive oppgaver</Heading>
      <StyledTable data-testid="search-result-active-oppgaver" zebraStripes>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Type</Table.ColumnHeader>
            <Table.ColumnHeader>Ytelse</Table.ColumnHeader>
            <Table.ColumnHeader>Hjemmel</Table.ColumnHeader>
            <Table.ColumnHeader>Alder</Table.ColumnHeader>
            <Table.ColumnHeader>Frist</Table.ColumnHeader>
            <Table.ColumnHeader>Tildeling</Table.ColumnHeader>
            <Table.ColumnHeader></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {oppgaver.map((id) => (
            <Row oppgaveId={id} columnCount={7} key={id} />
          ))}
        </Table.Body>
        <TableFooter {...footerProps} columnCount={8} settingsKey={OppgaveTableRowsPerPage.SEARCH_ACTIVE} />
      </StyledTable>
    </div>
  );
};

interface RowProps {
  oppgaveId: string;
  columnCount: number;
}

const Row = ({ oppgaveId, columnCount }: RowProps) => {
  const { data: oppgave, isLoading } = useGetOppgaveQuery(oppgaveId);

  if (isLoading || typeof oppgave === 'undefined') {
    return <LoadingRow columnCount={columnCount} testId="search-result-active-oppgave" behandlingid={oppgaveId} />;
  }

  return (
    <Table.Row data-testid="search-result-active-oppgave" data-klagebehandlingid={oppgaveId}>
      <Table.DataCell>
        <Type type={oppgave.type} />
      </Table.DataCell>
      <Table.DataCell>
        <Ytelse ytelseId={oppgave.ytelse} />
      </Table.DataCell>
      <Table.DataCell>
        <Hjemmel hjemmel={oppgave.hjemmel} />
      </Table.DataCell>
      <Table.DataCell>
        <Age age={oppgave.ageKA} oppgaveId={oppgave.id} mottattDate={oppgave.mottatt} />
      </Table.DataCell>
      <Table.DataCell>
        <Deadline age={oppgave.ageKA} frist={oppgave.frist} oppgaveId={oppgave.id} type={oppgave.type} />
      </Table.DataCell>
      <Table.DataCell>
        <Oppgavestyring {...oppgave} />
      </Table.DataCell>
      <Table.DataCell align="right">
        <OpenOppgavebehandling
          oppgavebehandlingId={oppgave.id}
          ytelse={oppgave.ytelse}
          type={oppgave.type}
          tildeltSaksbehandlerident={oppgave.tildeltSaksbehandlerident}
          medunderskriverident={oppgave.medunderskriverident}
        />
      </Table.DataCell>
    </Table.Row>
  );
};

const StyledTable = styled(Table)`
  max-width: 2500px;
  width: 100%;
`;
