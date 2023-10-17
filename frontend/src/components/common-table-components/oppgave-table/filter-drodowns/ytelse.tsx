import { Table } from '@navikt/ds-react';
import React from 'react';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { kodeverkSimpleValuesToDropdownOptions } from '@app/components/filter-dropdown/functions';
import { useSettingsYtelser } from '@app/hooks/use-settings-ytelser';
import { FilterDropdownProps } from './types';

export const Ytelse = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const ytelseOptions = useSettingsYtelser();

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.ytelser ?? []}
        onChange={(ytelser) => setParams({ ...params, ytelser })}
        options={kodeverkSimpleValuesToDropdownOptions(ytelseOptions)}
        data-testid="filter-ytelse"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
