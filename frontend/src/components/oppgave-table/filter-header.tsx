import { Table } from '@navikt/ds-react';
import React from 'react';
import { useSettingsHjemler } from '../../hooks/use-settings-hjemler';
import { useSettingsTypes } from '../../hooks/use-settings-types';
import { useSettingsYtelser } from '../../hooks/use-settings-ytelser';
import { SortFieldEnum } from '../../types/oppgaver';
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
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>
          <FilterDropdown
            testId="filter-type"
            selected={filters.types}
            onChange={(types) => onChange({ ...filters, types })}
            options={kodeverkSimpleValuesToDropdownOptions(typeOptions)}
          >
            Type
          </FilterDropdown>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <FilterDropdown
            testId="filter-ytelse"
            selected={filters.ytelser}
            onChange={(ytelser) => onChange({ ...filters, ytelser })}
            options={kodeverkSimpleValuesToDropdownOptions(ytelseOptions)}
          >
            Ytelse
          </FilterDropdown>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <FilterDropdown
            testId="filter-hjemler"
            selected={filters.hjemler}
            onChange={(hjemler) => onChange({ ...filters, hjemler })}
            options={kodeverkValuesToDropdownOptions(hjemlerOptions)}
          >
            Hjemmel
          </FilterDropdown>
        </Table.HeaderCell>
        <Table.ColumnHeader sortKey={SortFieldEnum.ALDER} sortable scope="col">
          Alder
        </Table.ColumnHeader>
        <Table.ColumnHeader sortKey={SortFieldEnum.FRIST} sortable scope="col">
          Frist
        </Table.ColumnHeader>
        <Table.HeaderCell>Tildeling</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  );
};
