import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableHjemler } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { sortWithOrdinals } from '@/functions/sort-with-ordinals/sort-with-ordinals';
import { useLatestYtelser } from '@/simple-api-state/use-kodeverk';

interface HjemmelOption {
  id: string;
  navn: string;
}

export const RolHjemmel = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { data: ytelser = [] } = useLatestYtelser();
  const [hjemler, setHjemler] = useOppgaveTableHjemler(tableKey);

  const options = useMemo<Entry<HjemmelOption>[]>(() => {
    const seen = new Set<string>();
    const result: Entry<HjemmelOption>[] = [];

    for (const { innsendingshjemler } of ytelser) {
      for (const { id, navn } of innsendingshjemler) {
        if (!seen.has(id)) {
          seen.add(id);
          result.push({ value: { id, navn }, key: id, label: navn, plainText: navn });
        }
      }
    }

    return result.toSorted((a, b) => sortWithOrdinals(a.value.navn, b.value.navn));
  }, [ytelser]);

  const optionsByKey = useMemo(() => {
    const map = new Map<string, Entry<HjemmelOption>>();

    for (const entry of options) {
      map.set(entry.key, entry);
    }

    return map;
  }, [options]);

  const selectedOptions = useMemo(
    () => (hjemler ?? []).map((id) => optionsByKey.get(id)).filter((o): o is Entry<HjemmelOption> => o !== undefined),
    [hjemler, optionsByKey],
  );

  const handleChange = useCallback(
    (values: HjemmelOption[]) => {
      setHjemler(values.length === 0 ? undefined : values.map((v) => v.id));
    },
    [setHjemler],
  );

  return (
    <Table.ColumnHeader aria-sort="none">
      <SearchableMultiSelect
        label={TABLE_HEADERS[columnKey] ?? 'Hjemmel'}
        options={options}
        value={selectedOptions}
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
