import React from 'react';
import { useSaksbehandlereInEnhet } from '../../hooks/use-saksbehandlere-in-enhet';
import { useSettingsHjemler } from '../../hooks/use-settings-hjemler';
import { useSettingsTypes } from '../../hooks/use-settings-types';
import { useSettingsYtelser } from '../../hooks/use-settings-ytelser';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { OppgaveType } from '../../types/kodeverk';
import { SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';
import { SortBy } from '../common-table-components/sort-by';
import { kodeverkSimpleValuesToDropdownOptions, kodeverkValuesToDropdownOptions } from '../dropdown/dropdown';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { Filters } from './types';

interface TableHeaderFiltersProps {
  onChange: (filters: Filters) => void;
  filters: Filters;
}

export const TableHeaderFilters = ({ onChange, filters }: TableHeaderFiltersProps) => {
  const typeOptions = useSettingsTypes();
  const ytelseOptions = useSettingsYtelser();
  const hjemlerOptions = useSettingsHjemler();

  const { data: bruker } = useGetBrukerQuery();

  const saksbehandlerOptions = useSaksbehandlereInEnhet(bruker?.ansattEnhet.id);

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
            options={kodeverkSimpleValuesToDropdownOptions(ytelseOptions)}
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
