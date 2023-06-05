import { Table } from '@navikt/ds-react';
import React from 'react';
import { ColumnKeyEnum, TABLE_HEADERS } from '@app/components/common-table-components/oppgave-rows/types';

interface TableHeaderProps {
  columnKeys: ColumnKeyEnum[];
}

export const TableHeader = ({ columnKeys }: TableHeaderProps): JSX.Element => (
  <Table.Header>
    <Table.Row>
      {columnKeys.map((key) => {
        const header = TABLE_HEADERS[key];

        if (header === null) {
          return <Table.ColumnHeader key={key} />;
        }

        return <Table.ColumnHeader key={key}>{header}</Table.ColumnHeader>;
      })}
    </Table.Row>
  </Table.Header>
);
