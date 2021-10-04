import React from 'react';
import { useSettingsHjemler } from '../../hooks/use-settings-hjemler';
import { useSettingsTemaer } from '../../hooks/use-settings-temaer';
import { useSettingsTypes } from '../../hooks/use-settings-types';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { SortBy } from './sortby';
import { Filters } from './types';

interface TableHeaderFiltersProps {
  onChange: (filters: Filters) => void;
  filters: Filters;
}

export const TableHeaderFilters = ({ onChange, filters }: TableHeaderFiltersProps): JSX.Element => {
  const typeOptions = useSettingsTypes();
  const temaOptions = useSettingsTemaer();
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
            selected={filters.tema}
            onChange={(tema) => onChange({ ...filters, tema })}
            options={temaOptions}
          >
            Tema
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
        <th>Fnr.</th>
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
