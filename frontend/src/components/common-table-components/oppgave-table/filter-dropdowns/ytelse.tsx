import { Table } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { valuesToDropdownOptions } from '@app/components/filter-dropdown/functions';
import { useLatestYtelser } from '@app/simple-api-state/use-kodeverk';
import { FilterDropdownProps } from './types';

interface Props extends FilterDropdownProps {
  options: string[];
}

export const Ytelse = ({ params, setParams, columnKey, options }: Props) => {
  const { data = [] } = useLatestYtelser();
  const filterOptions = useMemo(() => valuesToDropdownOptions(options, data), [options, data]);

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.ytelser ?? []}
        onChange={(ytelser) => setParams({ ...params, ytelser })}
        options={filterOptions}
        data-testid="filter-ytelse"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
