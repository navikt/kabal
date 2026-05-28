import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableRegistreringshjemler } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import type { ILovKildeToRegistreringshjemler } from '@/simple-api-state/use-kodeverk';

interface Props extends FilterDropdownProps {
  lovKildeToRegistreringshjemler: ILovKildeToRegistreringshjemler[];
}

export const Registreringshjemler = ({ tableKey, columnKey, lovKildeToRegistreringshjemler }: Props) => {
  const [registreringshjemler, setRegistreringshjemler] = useOppgaveTableRegistreringshjemler(tableKey);

  const options = useMemo(
    () => flattenRegistreringshjemler(lovKildeToRegistreringshjemler),
    [lovKildeToRegistreringshjemler],
  );

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

interface FlatRegistreringshjemmel {
  id: string;
  navn: string;
  lovkilde: string;
}

const flattenRegistreringshjemler = (
  lovKildeToRegistreringshjemler: ILovKildeToRegistreringshjemler[],
): Entry<FlatRegistreringshjemmel>[] => {
  const result: Entry<FlatRegistreringshjemmel>[] = [];
  const seen = new Set<string>();

  for (const { registreringshjemler, navn } of lovKildeToRegistreringshjemler) {
    for (const hjemmel of registreringshjemler) {
      if (seen.has(hjemmel.id)) {
        continue;
      }

      seen.add(hjemmel.id);

      result.push({
        value: { id: hjemmel.id, navn: hjemmel.navn, lovkilde: navn },
        key: hjemmel.id,
        label: (
          <span>
            <span className="text-ax-text-neutral-subtle">{navn}</span> - {hjemmel.navn}
          </span>
        ),
        plainText: `${navn} - ${hjemmel.navn}`,
      });
    }
  }

  return result;
};
