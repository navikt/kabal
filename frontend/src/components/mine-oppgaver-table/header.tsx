import { Table } from '@navikt/ds-react';
import React from 'react';
import { SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { SortBy } from '../common-table-components/sort-by';
import { Filters } from './types';

interface TableHeaderProps {
  onChange: (filters: Filters) => void;
  filters: Filters;
}

export const TableHeader = ({ filters, onChange }: TableHeaderProps): JSX.Element => (
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader scope="col">Type</Table.ColumnHeader>
      <Table.ColumnHeader scope="col">Ytelse</Table.ColumnHeader>
      <Table.ColumnHeader scope="col">Hjemmel</Table.ColumnHeader>
      <Table.ColumnHeader scope="col">Navn</Table.ColumnHeader>
      <Table.ColumnHeader scope="col">Fnr.</Table.ColumnHeader>
      <SortBy
        sorting={filters.sorting}
        sortField={SortFieldEnum.ALDER}
        defaultSortOrder={SortOrderEnum.SYNKENDE}
        onChange={(sorting) => onChange({ ...filters, sorting })}
      >
        Alder
      </SortBy>
      <SortBy
        sorting={filters.sorting}
        sortField={SortFieldEnum.FRIST}
        onChange={(sorting) => onChange({ ...filters, sorting })}
      >
        Frist
      </SortBy>
      <Table.ColumnHeader scope="col" />
      <Table.ColumnHeader scope="col" />
      <Table.ColumnHeader scope="col" />
    </Table.Row>
  </Table.Header>
);
