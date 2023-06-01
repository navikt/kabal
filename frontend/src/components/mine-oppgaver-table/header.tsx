import { Table } from '@navikt/ds-react';
import React from 'react';
import { SortFieldEnum } from '@app/types/oppgaver';

export const TableHeader = (): JSX.Element => (
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader scope="col">Type</Table.ColumnHeader>
      <Table.ColumnHeader scope="col">Ytelse</Table.ColumnHeader>
      <Table.ColumnHeader scope="col">Hjemmel</Table.ColumnHeader>
      <Table.ColumnHeader scope="col">Navn</Table.ColumnHeader>
      <Table.ColumnHeader scope="col">Fnr.</Table.ColumnHeader>
      <Table.ColumnHeader sortKey={SortFieldEnum.ALDER} sortable scope="col">
        Alder
      </Table.ColumnHeader>
      <Table.ColumnHeader sortKey={SortFieldEnum.FRIST} sortable scope="col">
        Frist
      </Table.ColumnHeader>
      <Table.ColumnHeader scope="col" />
      <Table.ColumnHeader scope="col" />
      <Table.ColumnHeader scope="col">Tildeling</Table.ColumnHeader>
      <Table.ColumnHeader scope="col">Feilregistrering</Table.ColumnHeader>
    </Table.Row>
  </Table.Header>
);
