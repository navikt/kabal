import { useOppgaveTableYtelser } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { kodeverkSimpleValuesToDropdownOptions } from '@app/components/filter-dropdown/functions';
import { FlatMultiSelectDropdown } from '@app/components/filter-dropdown/multi-select-dropdown';
import { useSimpleYtelser } from '@app/simple-api-state/use-kodeverk';
import { Table } from '@navikt/ds-react';
import type { FilterDropdownProps } from './types';

export const RolYtelse = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { data } = useSimpleYtelser();
  const ytelseOptions = data ?? [];
  const [ytelser, setYtelser] = useOppgaveTableYtelser(tableKey);

  return (
    <Table.ColumnHeader aria-sort="none">
      <FlatMultiSelectDropdown
        selected={ytelser ?? []}
        onChange={setYtelser}
        options={kodeverkSimpleValuesToDropdownOptions(ytelseOptions)}
        data-testid="filter-ytelse"
      >
        {TABLE_HEADERS[columnKey]}
      </FlatMultiSelectDropdown>
    </Table.ColumnHeader>
  );
};
