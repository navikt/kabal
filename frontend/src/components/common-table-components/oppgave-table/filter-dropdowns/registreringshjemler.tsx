import type { FilterDropdownProps } from '@app/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableRegistreringshjemler } from '@app/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@app/components/common-table-components/types';
import { SearchableMultiSelect } from '@app/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { sortWithOrdinals } from '@app/functions/sort-with-ordinals/sort-with-ordinals';
import { useLovKildeToRegistreringshjemler } from '@app/simple-api-state/use-kodeverk';
import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';

interface FlatRegistreringshjemmel {
  id: string;
  navn: string;
  lovkilde: string;
}

export const Registreringshjemler = ({ tableKey, columnKey }: FilterDropdownProps) => {
  const { data: lovkilder = [] } = useLovKildeToRegistreringshjemler();
  const [registreringshjemler, setRegistreringshjemler] = useOppgaveTableRegistreringshjemler(tableKey);

  const options = useMemo<FlatRegistreringshjemmel[]>(() => {
    const flat: FlatRegistreringshjemmel[] = [];

    for (const lovkilde of lovkilder) {
      for (const hjemmel of lovkilde.registreringshjemler) {
        if (flat.find((h) => h.id === hjemmel.id) === undefined) {
          flat.push({ id: hjemmel.id, navn: hjemmel.navn, lovkilde: lovkilde.beskrivelse });
        }
      }
    }

    return flat.sort((a, b) => sortWithOrdinals(a.navn, b.navn));
  }, [lovkilder]);

  const optionsByKey = useMemo(() => {
    const map = new Map<string, FlatRegistreringshjemmel>();

    for (const option of options) {
      map.set(option.id, option);
    }

    return map;
  }, [options]);

  const value = useMemo(
    () =>
      (registreringshjemler ?? [])
        .map((id) => optionsByKey.get(id))
        .filter((v): v is FlatRegistreringshjemmel => v !== undefined),
    [registreringshjemler, optionsByKey],
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
        valueKey={hjemmelValueKey}
        formatOption={formatHjemmelOption}
        emptyLabel={TABLE_HEADERS[columnKey] ?? 'Registreringshjemler'}
        filterText={hjemmelFilterText}
        onChange={handleChange}
        confirmLabel="Bekreft"
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
      />
    </Table.ColumnHeader>
  );
};

const hjemmelValueKey = (option: FlatRegistreringshjemmel): string => option.id;

const formatHjemmelOption = (option: FlatRegistreringshjemmel) => (
  <span>
    <span className="text-ax-text-neutral-subtle">{option.lovkilde}</span> - {option.navn}
  </span>
);

const hjemmelFilterText = (option: FlatRegistreringshjemmel): string => `${option.lovkilde} - ${option.navn}`;
