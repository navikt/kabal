import { Loader, Table } from '@navikt/ds-react';
import React from 'react';
import { IOppgaveList } from '@app/types/oppgaver';
import { Row } from './row';

interface OppgaveRowsProps {
  oppgaver?: IOppgaveList;
  columnCount: number;
  isLoading: boolean;
}

export const OppgaveRows = ({ oppgaver, isLoading, columnCount }: OppgaveRowsProps): JSX.Element => {
  if (isLoading || typeof oppgaver === 'undefined') {
    return (
      <Table.Body>
        <Table.Row>
          <Table.DataCell colSpan={columnCount}>
            <Loader size="xlarge" title="Laster oppgaver..." />
          </Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  if (oppgaver.length === 0) {
    return (
      <Table.Body>
        <Table.Row>
          <Table.DataCell colSpan={columnCount}>Ingen oppgaver</Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  return (
    <Table.Body>
      {oppgaver.map((k) => (
        <Row {...k} key={k.id} />
      ))}
    </Table.Body>
  );
};
