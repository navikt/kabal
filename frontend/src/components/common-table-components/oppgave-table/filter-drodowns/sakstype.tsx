import { Table } from '@navikt/ds-react';
import React from 'react';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { kodeverkSimpleValuesToDropdownOptions } from '@app/components/filter-dropdown/functions';
import { useSettingsTypes } from '@app/hooks/use-settings-types';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FilterDropdownProps } from './types';

export const Sakstype = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const sakstyper = useSettingsTypes();

  return (
    <Table.ColumnHeader>
      <FilterDropdown<SaksTypeEnum>
        selected={params.typer ?? []}
        onChange={(typer) => setParams({ ...params, typer })}
        options={kodeverkSimpleValuesToDropdownOptions(sakstyper)}
        data-testid="filter-type"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
