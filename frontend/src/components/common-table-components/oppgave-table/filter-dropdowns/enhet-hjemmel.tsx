import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableHjemler } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useAvailableHjemler } from '@/hooks/use-available-hjemler';
import type { IKodeverkValue } from '@/types/kodeverk';

export const EnhetHjemmel = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const enhetHjemlerOptions = useAvailableHjemler();
  const [hjemler, setHjemler] = useOppgaveTableHjemler(tableKey);

  const entries = useMemo<Entry<IKodeverkValue>[]>(
    () =>
      enhetHjemlerOptions.map((option) => ({
        value: option,
        key: option.id,
        label: option.beskrivelse,
        plainText: option.beskrivelse,
      })),
    [enhetHjemlerOptions],
  );

  const entriesByKey = useMemo(() => {
    const map = new Map<string, Entry<IKodeverkValue>>();

    for (const entry of entries) {
      map.set(entry.key, entry);
    }

    return map;
  }, [entries]);

  const selectedEntries = useMemo<Entry<IKodeverkValue>[]>(
    () =>
      (hjemler ?? []).reduce<Entry<IKodeverkValue>[]>((acc, id) => {
        const entry = entriesByKey.get(id);

        if (entry !== undefined) {
          acc.push(entry);
        }

        return acc;
      }, []),
    [hjemler, entriesByKey],
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
        options={entries}
        value={selectedEntries}
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
