import { Loader, Table } from '@navikt/ds-react';
import React from 'react';
import { IOppgaveList } from '../../types/oppgaver';
import { Row } from './row';

interface OppgaveraderProps {
  oppgaver?: IOppgaveList;
  columnCount: number;
  isFetching: boolean;
}

export const Oppgaverader = ({ oppgaver, columnCount, isFetching }: OppgaveraderProps): JSX.Element => {
  if (typeof oppgaver === 'undefined') {
    return (
      <Table.Body data-testid="mine-oppgaver-table-loading" data-isfetching="false">
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
      <Table.Body data-testid="mine-oppgaver-table-none" data-isfetching="false">
        <Table.Row>
          <Table.DataCell colSpan={columnCount}>Ingen oppgaver</Table.DataCell>
        </Table.Row>
      </Table.Body>
    );
  }

  return (
    <Table.Body data-testid="mine-oppgaver-table-rows" data-isfetching={isFetching.toString()}>
      {oppgaver.map((k) => (
        <Row {...k} key={k.id} />
      ))}
    </Table.Body>
  );
};
