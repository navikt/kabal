import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableHjemler } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { sortWithOrdinals } from '@/functions/sort-with-ordinals/sort-with-ordinals';
import { useLatestYtelser } from '@/simple-api-state/use-kodeverk';

interface HjemmelOption {
  id: string;
  navn: string;
}

export const RolHjemmel = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { data: ytelser = [] } = useLatestYtelser();
  const [hjemler, setHjemler] = useOppgaveTableHjemler(tableKey);

  const options = useMemo<HjemmelOption[]>(() => {
    const seen = new Set<string>();
    const result: HjemmelOption[] = [];

    for (const { innsendingshjemler } of ytelser) {
      for (const { id, navn } of innsendingshjemler) {
        if (!seen.has(id)) {
          seen.add(id);
          result.push({ id, navn });
        }
      }
    }

    return result.sort((a, b) => sortWithOrdinals(a.navn, b.navn));
  }, [ytelser]);

  const optionsByKey = useMemo(() => {
    const map = new Map<string, HjemmelOption>();

    for (const option of options) {
      map.set(option.id, option);
    }

    return map;
  }, [options]);

  const selectedOptions = useMemo(
    () => (hjemler ?? []).map((id) => optionsByKey.get(id)).filter((o): o is HjemmelOption => o !== undefined),
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
        valueKey={hjemmelValueKey}
        formatOption={hjemmelFormatOption}
        filterText={hjemmelFilterText}
        emptyLabel={TABLE_HEADERS[columnKey] ?? 'Hjemmel'}
        onChange={handleChange}
        confirmLabel="Bekreft"
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
        showSelectAll
      />
    </Table.ColumnHeader>
  );
};

const hjemmelValueKey = (option: HjemmelOption): string => option.id;

const hjemmelFormatOption = (option: HjemmelOption): string => option.navn;

const hjemmelFilterText = (option: HjemmelOption): string => option.navn;
