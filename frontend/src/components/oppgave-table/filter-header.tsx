import React from 'react';
import { useSettingsHjemler } from '../../hooks/use-settings-hjemler';
import { useSettingsTypes } from '../../hooks/use-settings-types';
import { useSettingsYtelser } from '../../hooks/use-settings-ytelser';
import { kodeverkSimpleValuesToDropdownOptions, kodeverkValuesToDropdownOptions } from '../dropdown/dropdown';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { SortBy } from './sortby';
import { StyledTableHeader } from './styled-components';
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
        <StyledTableHeader width="225px">
          <FilterDropdown
            testId="filter-type"
            selected={filters.types}
            onChange={(types) => onChange({ ...filters, types })}
            options={kodeverkSimpleValuesToDropdownOptions(typeOptions)}
          >
            Type
          </FilterDropdown>
        </StyledTableHeader>
        <StyledTableHeader width="225px">
          <FilterDropdown
            testId="filter-ytelse"
            selected={filters.ytelser}
            onChange={(ytelser) => onChange({ ...filters, ytelser })}
            options={kodeverkValuesToDropdownOptions(ytelseOptions)}
          >
            Ytelse
          </FilterDropdown>
        </StyledTableHeader>
        <StyledTableHeader width="225px">
          <FilterDropdown
            testId="filter-hjemler"
            selected={filters.hjemler}
            onChange={(hjemler) => onChange({ ...filters, hjemler })}
            options={kodeverkValuesToDropdownOptions(hjemlerOptions)}
          >
            Hjemmel
          </FilterDropdown>
        </StyledTableHeader>
        <StyledTableHeader width="225px">Alder</StyledTableHeader>
        <SortBy desc={filters.sortDescending} onChange={(sortDescending) => onChange({ ...filters, sortDescending })}>
          Frist
        </SortBy>
        <StyledTableHeader width="14em"></StyledTableHeader>
      </tr>
    </thead>
  );
};
