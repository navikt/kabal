import React from 'react';
import { useSaksbehandlereInEnhet } from '../../hooks/use-saksbehandlere-in-enhet';
import { useSettingsHjemler } from '../../hooks/use-settings-hjemler';
import { useSettingsTypes } from '../../hooks/use-settings-types';
import { useSettingsYtelser } from '../../hooks/use-settings-ytelser';
import { OppgaveType } from '../../types/kodeverk';
import { kodeverkSimpleValuesToDropdownOptions, kodeverkValuesToDropdownOptions } from '../dropdown/dropdown';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { SortBy } from './sortby';
import { Filters } from './types';

interface TableHeaderFiltersProps {
  onChange: (filters: Filters) => void;
  filters: Filters;
  enhetId: string;
}

export const TableHeaderFilters = ({ onChange, filters, enhetId }: TableHeaderFiltersProps) => {
  const typeOptions = useSettingsTypes();
  const ytelseOptions = useSettingsYtelser();
  const hjemlerOptions = useSettingsHjemler();
  const saksbehandlerOptions = useSaksbehandlereInEnhet(enhetId);

  return (
    <thead>
      <tr>
        <th role="columnheader">
          <FilterDropdown<OppgaveType>
            selected={filters.types}
            onChange={(types) =>
              onChange({
                ...filters,
                types,
              })
            }
            options={kodeverkSimpleValuesToDropdownOptions(typeOptions)}
          >
            Type
          </FilterDropdown>
        </th>
        <th role="columnheader">
          <FilterDropdown
            selected={filters.ytelser}
            onChange={(ytelse) => onChange({ ...filters, ytelser: ytelse })}
            options={kodeverkValuesToDropdownOptions(ytelseOptions)}
          >
            Ytelse
          </FilterDropdown>
        </th>
        <th role="columnheader">
          <FilterDropdown
            selected={filters.hjemler}
            onChange={(hjemler) => onChange({ ...filters, hjemler })}
            options={kodeverkValuesToDropdownOptions(hjemlerOptions)}
          >
            Hjemmel
          </FilterDropdown>
        </th>
        <th>Alder</th>
        <SortBy desc={filters.sortDescending} onChange={(sortDescending) => onChange({ ...filters, sortDescending })}>
          Frist
        </SortBy>
        <th>
          <FilterDropdown
            selected={filters.tildeltSaksbehandler}
            onChange={(tildeltSaksbehandler) => onChange({ ...filters, tildeltSaksbehandler })}
            options={kodeverkValuesToDropdownOptions(saksbehandlerOptions)}
          >
            Saksbehandler
          </FilterDropdown>
        </th>
        <th role="columnheader"></th>
        <th role="columnheader"></th>
        <th role="columnheader"></th>
      </tr>
    </thead>
  );
};
