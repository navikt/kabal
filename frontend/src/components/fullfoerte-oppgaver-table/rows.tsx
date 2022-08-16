import { Loader, Table } from '@navikt/ds-react';
import React from 'react';
import { IOppgaveList } from '../../types/oppgaver';
import { Row } from './row';

interface OppgaveRowsProps {
  oppgaver?: IOppgaveList;
  columnCount: number;
}

export const OppgaveRows = ({ oppgaver, columnCount }: OppgaveRowsProps): JSX.Element => {
  if (typeof oppgaver === 'undefined') {
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
          <Table.DataCell colSpan={columnCount}>Ingen oppgaver i liste</Table.DataCell>
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
