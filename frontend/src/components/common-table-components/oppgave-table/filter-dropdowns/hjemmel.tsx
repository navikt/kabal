import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableHjemler } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useSettingsHjemler } from '@/hooks/use-settings-hjemler';
import type { IKodeverkValue } from '@/types/kodeverk';

export const Hjemmel = ({ columnKey, tableKey }: FilterDropdownProps) => {
  const hjemlerOptions = useSettingsHjemler();
  const [hjemler, setHjemler] = useOppgaveTableHjemler(tableKey);

  const options = useMemo<Entry<IKodeverkValue>[]>(
    () =>
      hjemlerOptions.map((o) => ({
        value: o,
        key: o.id,
        label: o.beskrivelse,
        plainText: o.beskrivelse,
      })),
    [hjemlerOptions],
  );

  const selectedValues = useMemo<Entry<IKodeverkValue>[]>(
    () => options.filter((o) => hjemler?.includes(o.key) === true),
    [options, hjemler],
  );

  const handleChange = useCallback(
    (values: IKodeverkValue[]) => {
      setHjemler(values.length === 0 ? undefined : values.map((v) => v.id));
    },
    [setHjemler],
  );

  return (
    <Table.ColumnHeader aria-sort="none">
      <SearchableMultiSelect
        label={TABLE_HEADERS[columnKey] ?? 'Hjemmel'}
        options={options}
        value={selectedValues}
        emptyLabel={TABLE_HEADERS[columnKey] ?? 'Hjemmel'}
        onChange={handleChange}
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
        showSelectAll
      />
    </Table.ColumnHeader>
  );
};
