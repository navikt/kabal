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

export const Rol = ({ params, setParams, columnKey, options }: Props) => {
  const filterOptions = useMemo<IOption<string>[]>(() => navEmployeesToOptions(options), [options]);

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.tildelteRol ?? []}
        onChange={(tildelteRol) => setParams({ ...params, tildelteRol })}
        options={filterOptions}
        data-testid="filter-rol"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
