import { navEmployeesToOptions } from '@app/components/common-table-components/oppgave-table/filter-dropdowns/helpers';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import type { IOption } from '@app/components/filter-dropdown/props';
import { useGetRolsInEnhetQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { Table } from '@navikt/ds-react';
import { useMemo } from 'react';
import type { FilterDropdownProps } from './types';

export const Rol = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const { data } = useGetRolsInEnhetQuery();
  const options = useMemo<IOption<string>[]>(() => navEmployeesToOptions(data?.rolList), [data]);

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.tildelteRol ?? []}
        onChange={(tildelteRol) => setParams({ ...params, tildelteRol })}
        options={options}
        data-testid="filter-rol"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
