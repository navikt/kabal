import { Table } from '@navikt/ds-react';
import React from 'react';
import { useAvailableHjemler } from '../../hooks/use-available-hjemler';
import { useAvailableYtelser } from '../../hooks/use-available-ytelser';
import { useSakstyper } from '../../hooks/use-kodeverk-value';
import { useSaksbehandlereInEnhet } from '../../hooks/use-saksbehandlere-in-enhet';
import { useUser } from '../../simple-api-state/use-user';
import { SaksTypeEnum } from '../../types/kodeverk';
import { SortFieldEnum } from '../../types/oppgaver';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { kodeverkSimpleValuesToDropdownOptions, kodeverkValuesToDropdownOptions } from '../filter-dropdown/functions';
import { Filters } from './types';

interface TableHeaderFiltersProps {
  onChange: (filters: Filters) => void;
  filters: Filters;
}

export const TableHeaderFilters = ({ onChange, filters }: TableHeaderFiltersProps) => {
  const sakstyper = useSakstyper();
  const ytelseOptions = useAvailableYtelser();
  const hjemlerOptions = useAvailableHjemler();

  const { data: bruker } = useUser();

  const saksbehandlerOptions = useSaksbehandlereInEnhet(bruker?.ansattEnhet.id);

  return (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell role="columnheader">
          <FilterDropdown<SaksTypeEnum>
            selected={filters.types}
            onChange={(types) => onChange({ ...filters, types })}
            options={kodeverkSimpleValuesToDropdownOptions(sakstyper)}
          >
            Type
          </FilterDropdown>
        </Table.HeaderCell>
        <Table.HeaderCell role="columnheader">
          <FilterDropdown
            selected={filters.ytelser}
            onChange={(ytelse) => onChange({ ...filters, ytelser: ytelse })}
            options={kodeverkSimpleValuesToDropdownOptions(ytelseOptions)}
          >
            Ytelse
          </FilterDropdown>
        </Table.HeaderCell>
        <Table.HeaderCell role="columnheader">
          <FilterDropdown
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
        <Table.HeaderCell role="columnheader"></Table.HeaderCell>
        <Table.HeaderCell role="columnheader"></Table.HeaderCell>
        <Table.HeaderCell>
          <FilterDropdown
            selected={filters.tildeltSaksbehandler}
            onChange={(tildeltSaksbehandler) => onChange({ ...filters, tildeltSaksbehandler })}
            options={kodeverkSimpleValuesToDropdownOptions(saksbehandlerOptions)}
          >
            Tildeling
          </FilterDropdown>
        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  );
};
