import { SearchableMultiSelect } from '@app/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { sortWithOrdinals } from '@app/functions/sort-with-ordinals/sort-with-ordinals';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useRegistreringshjemlerMap } from '@app/simple-api-state/use-kodeverk';
import { useCallback, useMemo } from 'react';

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

  const options = useMemo(() => {
    if (oppgave === undefined) {
      return [];
    }

    return oppgave.resultat.hjemmelIdSet
      .map((id) => {
        const hjemmel = hjemmelMap[id];

        return {
          id,
          navn: hjemmel === undefined ? id : hjemmel.hjemmelnavn,
          lovkilde: hjemmel === undefined ? '' : hjemmel.lovkilde.beskrivelse,
        };
      })
      .toSorted((a, b) => sortWithOrdinals(a.navn, b.navn));
  }, [oppgave, hjemmelMap]);

  const optionsByKey = useMemo(() => {
    const map = new Map<string, HjemmelOption>();

    for (const option of options) {
      map.set(option.id, option);
    }

    return map;
  }, [options]);

  const selectedOptions = useMemo(
    () => selected.map((id) => optionsByKey.get(id)).filter((v): v is HjemmelOption => v !== undefined),
    [selected, optionsByKey],
  );

  const handleChange = useCallback((values: HjemmelOption[]) => setSelected(values.map((v) => v.id)), [setSelected]);

  if (oppgave === undefined) {
    return null;
  }

  return (
    <SearchableMultiSelect
      label="Filtrer på hjemler"
      options={options}
      value={selectedOptions}
      valueKey={hjemmelValueKey}
      formatOption={formatHjemmelOption}
      emptyLabel="Filtrer på hjemler"
      filterText={hjemmelFilterText}
      onChange={handleChange}
      triggerVariant="secondary"
      triggerDisplay="count"
    />
  );
};

const hjemmelValueKey = (option: HjemmelOption): string => option.id;

const formatHjemmelOption = (option: HjemmelOption) => (
  <span>
    <span className="text-ax-text-neutral-subtle">{option.lovkilde}</span> - {option.navn}
  </span>
);

const hjemmelFilterText = (option: HjemmelOption): string => `${option.lovkilde} - ${option.navn}`;
