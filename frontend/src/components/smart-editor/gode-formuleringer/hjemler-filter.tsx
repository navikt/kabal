import { useCallback, useMemo } from 'react';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { sortWithOrdinals } from '@/functions/sort-with-ordinals/sort-with-ordinals';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useRegistreringshjemlerMap } from '@/simple-api-state/use-kodeverk';

interface HjemmelOption {
  id: string;
  navn: string;
  lovkilde: string;
}

interface Props {
  selected: string[];
  setSelected: (selected: string[]) => void;
}

export const HjemlerFilter = ({ selected, setSelected }: Props) => {
  const { data: hjemmelMap = {} } = useRegistreringshjemlerMap();
  const { data: oppgave } = useOppgave();

  const entries = useMemo<Entry<HjemmelOption>[]>(() => {
    if (oppgave === undefined) {
      return [];
    }

    return oppgave.resultat.hjemmelIdSet
      .map((id) => {
        const hjemmel = hjemmelMap[id];

        const value = {
          id,
          navn: hjemmel === undefined ? id : hjemmel.hjemmelnavn,
          lovkilde: hjemmel === undefined ? '' : hjemmel.lovkilde.beskrivelse,
        };

        return {
          value,
          key: id,
          label: (
            <span>
              <span className="text-ax-text-neutral-subtle">{value.lovkilde}</span> - {value.navn}
            </span>
          ),
          plainText: `${value.lovkilde} - ${value.navn}`,
        };
      })
      .toSorted((a, b) => sortWithOrdinals(a.value.navn, b.value.navn));
  }, [oppgave, hjemmelMap]);

  const entriesByKey = useMemo(() => {
    const map = new Map<string, Entry<HjemmelOption>>();

    for (const entry of entries) {
      map.set(entry.key, entry);
    }

    return map;
  }, [entries]);

  const selectedEntries = useMemo(
    () => selected.map((id) => entriesByKey.get(id)).filter((v): v is Entry<HjemmelOption> => v !== undefined),
    [selected, entriesByKey],
  );

  const handleChange = useCallback((values: HjemmelOption[]) => setSelected(values.map((v) => v.id)), [setSelected]);

  if (oppgave === undefined) {
    return null;
  }

  return (
    <SearchableMultiSelect
      label="Filtrer på hjemler"
      options={entries}
      value={selectedEntries}
      emptyLabel="Filtrer på hjemler"
      onChange={handleChange}
      triggerVariant="secondary"
      triggerDisplay="count"
      showSelectAll
    />
  );
};
