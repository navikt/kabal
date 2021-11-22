import React from 'react';
import { useSettingsHjemler } from '../../hooks/use-settings-hjemler';
import { useSettingsTypes } from '../../hooks/use-settings-types';
import { useSettingsYtelser } from '../../hooks/use-settings-ytelser';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { SortBy } from './sortby';
import { Filters } from './types';

interface TableHeaderFiltersProps {
  onChange: (filters: Filters) => void;
  filters: Filters;
}

export const TableHeaderFilters = ({ onChange, filters }: TableHeaderFiltersProps): JSX.Element => {
  const typeOptions = useSettingsTypes();
  const ytelseOptions = useSettingsYtelser();
  const hjemlerOptions = useSettingsHjemler();

  return (
    <thead>
      <tr>
        <th role="columnheader">
          <FilterDropdown
            selected={filters.types}
            onChange={(types) => onChange({ ...filters, types })}
            options={typeOptions}
          >
            Type
          </FilterDropdown>
        </th>
        <th role="columnheader">
          <FilterDropdown
            selected={filters.ytelser}
            onChange={(ytelse) => onChange({ ...filters, ytelser: ytelse })}
            options={ytelseOptions}
          >
            Ytelse
          </FilterDropdown>
        </th>
        <th role="columnheader">
          <FilterDropdown
            selected={filters.hjemler}
            onChange={(hjemler) => onChange({ ...filters, hjemler })}
            options={hjemlerOptions}
          >
            Hjemmel
          </FilterDropdown>
        </th>
        <th>Alder</th>
        <SortBy desc={filters.sortDescending} onChange={(sortDescending) => onChange({ ...filters, sortDescending })}>
          Frist
        </SortBy>
        <th>Saksbehandler</th>
        <th role="columnheader"></th>
        <th role="columnheader"></th>
        <th role="columnheader"></th>
      </tr>
    </thead>
  );
};
