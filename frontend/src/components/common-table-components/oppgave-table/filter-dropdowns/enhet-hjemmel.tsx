import { Table } from '@navikt/ds-react';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { kodeverkValuesToDropdownOptions } from '@app/components/filter-dropdown/functions';
import { useAvailableHjemler } from '@app/hooks/use-available-hjemler';
import { FilterDropdownProps } from './types';

export const EnhetHjemmel = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const enhetHjemlerOptions = useAvailableHjemler();

  return (
    <Table.ColumnHeader>
      <FilterDropdown
        selected={params.hjemler ?? []}
        onChange={(hjemler) => setParams({ ...params, hjemler })}
        options={kodeverkValuesToDropdownOptions(enhetHjemlerOptions)}
        data-testid="filter-hjemler"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
