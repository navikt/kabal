import { Table } from '@navikt/ds-react';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { kodeverkValuesToDropdownOptions } from '@app/components/filter-dropdown/functions';
import { useSettingsHjemler } from '@app/hooks/use-settings-hjemler';
import { FilterDropdownProps } from './types';

export const Hjemmel = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const hjemlerOptions = useSettingsHjemler();

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.hjemler ?? []}
        onChange={(hjemler) => setParams({ ...params, hjemler })}
        options={kodeverkValuesToDropdownOptions(hjemlerOptions)}
        data-testid="filter-hjemler"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
