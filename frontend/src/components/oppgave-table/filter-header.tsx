import React from 'react';
import { SortBy } from './sortby';
import { Filters } from './types';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { useSettingsTypes } from '../../hooks/use-settings-types';
import { useSettingsTemaer } from '../../hooks/use-settings-temaer';
import { useSettingsHjemler } from '../../hooks/use-settings-hjemler';
import { StyledTableHeader } from './styled-components';

interface TableHeaderFiltersProps {
  onChange: (filters: Filters) => void;
  filters: Filters;
}

export const TableHeaderFilters: React.FC<TableHeaderFiltersProps> = ({ onChange, filters }) => {
  const typeOptions = useSettingsTypes();
  const temaOptions = useSettingsTemaer();
  const hjemlerOptions = useSettingsHjemler();

  return (
    <thead>
      <tr>
        <StyledTableHeader width={'225px'}>
          <FilterDropdown
            selected={filters.types}
            onChange={(types) => onChange({ ...filters, types })}
            options={typeOptions}
          >
            Type
          </FilterDropdown>
        </StyledTableHeader>
        <StyledTableHeader width={'225px'}>
          <FilterDropdown
            selected={filters.tema}
            onChange={(tema) => onChange({ ...filters, tema })}
            options={temaOptions}
          >
            Tema
          </FilterDropdown>
        </StyledTableHeader>
        <StyledTableHeader width={'225px'}>
          <FilterDropdown
            selected={filters.hjemler}
            onChange={(hjemler) => onChange({ ...filters, hjemler })}
            options={hjemlerOptions}
          >
            Hjemmel
          </FilterDropdown>
        </StyledTableHeader>
        <StyledTableHeader width={'225px'}>Alder</StyledTableHeader>
        <SortBy desc={filters.sortDescending} onChange={(sortDescending) => onChange({ ...filters, sortDescending })}>
          Frist
        </SortBy>
        <StyledTableHeader width={'14em'}></StyledTableHeader>
      </tr>
    </thead>
  );
};
