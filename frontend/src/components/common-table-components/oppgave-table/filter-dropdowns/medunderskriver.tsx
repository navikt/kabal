import { Table } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { navEmployeesToOptions } from '@app/components/common-table-components/oppgave-table/filter-dropdowns/helpers';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { IOption } from '@app/components/filter-dropdown/props';
import { INavEmployee } from '@app/types/bruker';
import { FilterDropdownProps } from './types';

interface Props extends FilterDropdownProps {
  options: INavEmployee[];
}

export const Medunderskriver = ({ params, setParams, columnKey, options }: Props) => {
  const filterOptions = useMemo<IOption<string>[]>(() => navEmployeesToOptions(options), [options]);

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.medunderskrivere ?? []}
        onChange={(medunderskrivere) => setParams({ ...params, medunderskrivere })}
        options={filterOptions}
        data-testid="filter-medunderskriver"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
