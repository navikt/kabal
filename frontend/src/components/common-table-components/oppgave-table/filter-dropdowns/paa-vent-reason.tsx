import { useOppgaveTablePaaVentReasons } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import { kodeverkValuesToDropdownOptions } from '@app/components/filter-dropdown/functions';
import { usePaaVentReasons } from '@app/simple-api-state/use-kodeverk';
import { Table } from '@navikt/ds-react';
import type { FilterDropdownProps } from './types';

export const PaaVentReasons = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const [reasons, setReasons] = useOppgaveTablePaaVentReasons(tableKey);
  const { data = [] } = usePaaVentReasons();

  return (
    <Table.ColumnHeader aria-sort="none">
      <FilterDropdown
        selected={reasons ?? []}
        onChange={setReasons}
        options={kodeverkValuesToDropdownOptions(data)}
        data-testid="filter-paa-vent-reason"
      >
        {TABLE_HEADERS[columnKey]}
      </FilterDropdown>
    </Table.ColumnHeader>
  );
};
