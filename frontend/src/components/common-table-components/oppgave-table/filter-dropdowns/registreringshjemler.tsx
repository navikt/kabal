import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableRegistreringshjemler } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { sortWithOrdinals } from '@/functions/sort-with-ordinals/sort-with-ordinals';
import { useLovKildeToRegistreringshjemler } from '@/simple-api-state/use-kodeverk';

interface FlatRegistreringshjemmel {
  id: string;
  navn: string;
  lovkilde: string;
}

export const Registreringshjemler = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { data: lovkilder = [] } = useLovKildeToRegistreringshjemler();
  const [registreringshjemler, setRegistreringshjemler] = useOppgaveTableRegistreringshjemler(tableKey);

  const options = useMemo<Entry<FlatRegistreringshjemmel>[]>(() => {
    const flat: FlatRegistreringshjemmel[] = [];

    for (const lovkilde of lovkilder) {
      for (const hjemmel of lovkilde.registreringshjemler) {
        if (flat.find((h) => h.id === hjemmel.id) === undefined) {
          flat.push({ id: hjemmel.id, navn: hjemmel.navn, lovkilde: lovkilde.beskrivelse });
        }
      }
    }

    flat.sort((a, b) => sortWithOrdinals(a.navn, b.navn));

    return flat.map((h) => ({
      value: h,
      key: h.id,
      label: (
        <span>
          <span className="text-ax-text-neutral-subtle">{h.lovkilde}</span> - {h.navn}
        </span>
      ),
      plainText: `${h.lovkilde} - ${h.navn}`,
    }));
  }, [lovkilder]);

  const value = useMemo<Entry<FlatRegistreringshjemmel>[]>(
    () => options.filter((entry) => registreringshjemler?.includes(entry.key) === true),
    [registreringshjemler, options],
  );

  const handleChange = useCallback(
    (selected: FlatRegistreringshjemmel[]) => {
      setRegistreringshjemler(selected.length === 0 ? undefined : selected.map((o) => o.id));
    },
    [setRegistreringshjemler],
  );

  return (
    <Table.ColumnHeader className="relative" aria-sort="none">
      <SearchableMultiSelect
        label={TABLE_HEADERS[columnKey] ?? 'Registreringshjemler'}
        options={options}
        value={value}
        emptyLabel={TABLE_HEADERS[columnKey] ?? 'Registreringshjemler'}
        onChange={handleChange}
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
        showSelectAll
      />
    </Table.ColumnHeader>
  );
};
