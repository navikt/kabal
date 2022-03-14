import React from 'react';
import { SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { SortBy } from '../common-table-components/sort-by';
import { Filters } from './types';

interface TableHeaderProps {
  onChange: (filters: Filters) => void;
  filters: Filters;
}

export const TableHeader = ({ filters, onChange }: TableHeaderProps): JSX.Element => (
  <thead>
    <tr>
      <th>Type</th>
      <th>Ytelse</th>
      <th>Hjemmel</th>
      <th>Navn</th>
      <th>Fnr.</th>
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
      <th />
      <th />
      <th />
    </tr>
  </thead>
);
