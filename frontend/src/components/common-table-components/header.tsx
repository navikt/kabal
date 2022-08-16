import { Table } from '@navikt/ds-react';
import React from 'react';

interface TableHeaderProps {
  headers: (string | null)[];
}

export const TableHeader = ({ headers }: TableHeaderProps): JSX.Element => (
  <Table.Header>
    <Table.Row>
      {headers.map((h, i) =>
        typeof h === 'string' ? <Table.ColumnHeader key={h}>{h}</Table.ColumnHeader> : <Table.ColumnHeader key={i} />
      )}
    </Table.Row>
  </Table.Header>
);
