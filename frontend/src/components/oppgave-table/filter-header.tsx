import React from 'react';
import { useSettingsHjemler } from '../../hooks/use-settings-hjemler';
import { useSettingsTypes } from '../../hooks/use-settings-types';
import { useSettingsYtelser } from '../../hooks/use-settings-ytelser';
import { SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { SortBy } from '../common-table-components/sort-by';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { kodeverkSimpleValuesToDropdownOptions, kodeverkValuesToDropdownOptions } from '../filter-dropdown/functions';
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
        <th>
          <FilterDropdown
            testId="filter-type"
            selected={filters.types}
            onChange={(types) => onChange({ ...filters, types })}
            options={kodeverkSimpleValuesToDropdownOptions(typeOptions)}
          >
            Type
          </FilterDropdown>
        </th>
        <th>
          <FilterDropdown
            testId="filter-ytelse"
            selected={filters.ytelser}
            onChange={(ytelser) => onChange({ ...filters, ytelser })}
            options={kodeverkSimpleValuesToDropdownOptions(ytelseOptions)}
          >
            Ytelse
          </FilterDropdown>
        </th>
        <th>
          <FilterDropdown
            testId="filter-hjemler"
            selected={filters.hjemler}
            onChange={(hjemler) => onChange({ ...filters, hjemler })}
            options={kodeverkValuesToDropdownOptions(hjemlerOptions)}
          >
            Hjemmel
          </FilterDropdown>
        </th>
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
        <th></th>
      </tr>
    </thead>
  );
};
