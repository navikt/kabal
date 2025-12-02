import { useOppgaveTableHjemler } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { kodeverkValuesToDropdownOptions } from '@app/components/filter-dropdown/functions';
import { FlatMultiSelectDropdown } from '@app/components/filter-dropdown/multi-select-dropdown';
import { useSettingsHjemler } from '@app/hooks/use-settings-hjemler';
import { Table } from '@navikt/ds-react';
import type { FilterDropdownProps } from './types';

export const Hjemmel = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const hjemlerOptions = useSettingsHjemler();
  const [hjemler, setHjemler] = useOppgaveTableHjemler(tableKey);

  return (
    <Table.ColumnHeader aria-sort="none">
      <FlatMultiSelectDropdown
        selected={hjemler ?? []}
        onChange={setHjemler}
        options={kodeverkValuesToDropdownOptions(hjemlerOptions)}
        data-testid="filter-hjemler"
      >
        {TABLE_HEADERS[columnKey]}
      </FlatMultiSelectDropdown>
    </Table.ColumnHeader>
  );
};
