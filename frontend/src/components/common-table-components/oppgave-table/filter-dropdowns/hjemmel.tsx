import { Table } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { valuesToDropdownOptions } from '@app/components/filter-dropdown/functions';
import { useHjemler } from '@app/simple-api-state/use-kodeverk';
import { FilterDropdownProps } from './types';

interface Props extends FilterDropdownProps {
  options: string[];
}

export const Hjemmel = ({ params, setParams, columnKey, options }: Props) => {
  const { data = [] } = useHjemler();
  const filterOptions = useMemo(() => valuesToDropdownOptions(options, data), [options, data]);

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.hjemler ?? []}
        onChange={(hjemler) => setParams({ ...params, hjemler })}
        options={filterOptions}
        data-testid="filter-hjemler"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
