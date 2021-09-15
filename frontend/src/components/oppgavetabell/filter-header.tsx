import React from 'react';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { SortBy } from './sortby';
import { useGetKodeverkQuery } from '../../redux-api/kodeverk';
import { Filters } from './types';

interface TableHeaderFiltersProps {
  onChange: (filters: Filters) => void;
  filters: Filters;
}

export const TableHeaderFilters: React.FC<TableHeaderFiltersProps> = ({ onChange, filters }) => {
  const { data } = useGetKodeverkQuery();

  return (
    <thead>
      <tr>
        <th role="columnheader">
          <FilterDropdown
            selected={filters.types}
            onChange={(types) => onChange({ ...filters, types })}
            options={data?.type ?? []}
          >
            Type
          </FilterDropdown>
        </th>
        <th role="columnheader">
          <FilterDropdown
            selected={filters.tema}
            onChange={(tema) => onChange({ ...filters, tema })}
            options={data?.tema ?? []}
          >
            Tema
          </FilterDropdown>
        </th>
        <th role="columnheader">
          <FilterDropdown
            selected={filters.hjemler}
            onChange={(hjemler) => onChange({ ...filters, hjemler })}
            options={data?.hjemmel ?? []}
          >
            Hjemmel
          </FilterDropdown>
        </th>
        <th>Alder</th>
        <SortBy desc={filters.sortDescending} onChange={(sortDescending) => onChange({ ...filters, sortDescending })}>
          Frist
        </SortBy>
        <th role="columnheader"></th>
      </tr>
    </thead>
  );
};
