import React from 'react';
import { SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { SortBy } from '../common-table-components/sort-by';
import { StyledTableHeader } from './styled-components';
import { Filters } from './types';

interface TableHeaderProps {
  onChange: (filters: Filters) => void;
  filters: Filters;
}

export const TableHeader = ({ filters, onChange }: TableHeaderProps): JSX.Element => (
  <thead>
    <tr>
      <StyledTableHeader>Type</StyledTableHeader>
      <StyledTableHeader>Ytelse</StyledTableHeader>
      <StyledTableHeader>Hjemmel</StyledTableHeader>
      <StyledTableHeader>Navn</StyledTableHeader>
      <StyledTableHeader>Fnr.</StyledTableHeader>
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
      <StyledTableHeader />
      <StyledTableHeader />
      <StyledTableHeader />
    </tr>
  </thead>
);
