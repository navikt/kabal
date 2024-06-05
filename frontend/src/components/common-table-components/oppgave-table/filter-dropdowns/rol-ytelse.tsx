import { Table } from '@navikt/ds-react';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { kodeverkSimpleValuesToDropdownOptions } from '@app/components/filter-dropdown/functions';
import { useSimpleYtelser } from '@app/simple-api-state/use-kodeverk';
import { FilterDropdownProps } from './types';

export const RolYtelse = ({ params, setParams, columnKey }: FilterDropdownProps) => {
  const { data } = useSimpleYtelser();
  const ytelseOptions = data ?? [];

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
