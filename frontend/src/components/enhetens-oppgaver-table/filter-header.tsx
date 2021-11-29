import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React from 'react';
import { useSettingsHjemler } from '../../hooks/use-settings-hjemler';
import { useSettingsTypes } from '../../hooks/use-settings-types';
import { useSettingsYtelser } from '../../hooks/use-settings-ytelser';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { IKodeverkVerdi } from '../../redux-api/kodeverk';
import { useGetSaksbehandlereInEnhetQuery } from '../../redux-api/oppgaver';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { SortBy } from './sortby';
import { Filters } from './types';

interface TableHeaderFiltersProps {
  onChange: (filters: Filters) => void;
  filters: Filters;
}

export const TableHeaderFilters = ({ onChange, filters }: TableHeaderFiltersProps) => {
  const { data: userData } = useGetBrukerQuery();
  const typeOptions = useSettingsTypes();
  const ytelseOptions = useSettingsYtelser();
  const hjemlerOptions = useSettingsHjemler();

  const { data } = useGetSaksbehandlereInEnhetQuery(userData?.valgtEnhetView.id ?? skipToken);

  if (typeof data === 'undefined') {
    return null;
  }

  const saksbehandlerOptions = data.saksbehandlere.map<IKodeverkVerdi>(({ navIdent, navn }) => ({
    navn,
    beskrivelse: navn,
    id: navIdent,
  }));

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
        <th>
          <FilterDropdown
            selected={filters.tildeltSaksbehandler}
            onChange={(tildeltSaksbehandler) => onChange({ ...filters, tildeltSaksbehandler })}
            options={saksbehandlerOptions}
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
