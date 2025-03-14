import { ChipFilterDropdown } from '@app/components/filter-dropdown/chip-filter-dropdown';
import { sortWithOrdinals } from '@app/functions/sort-with-ordinals/sort-with-ordinals';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useRegistreringshjemlerMap } from '@app/simple-api-state/use-kodeverk';

interface Props {
  selected: string[];
  setSelected: (selected: string[]) => void;
}

export const HjemlerFilter = ({ selected, setSelected }: Props) => {
  const { data: hjemmelMap = {} } = useRegistreringshjemlerMap();
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    return null;
  }

  const options = oppgave.resultat.hjemmelIdSet
    .map((id) => {
      const hjemmel = hjemmelMap[id];
      const label = hjemmel === undefined ? id : `${hjemmel.lovkilde.beskrivelse} - ${hjemmel.hjemmelnavn}`;

      return { value: id, label };
    })
    .toSorted((a, b) => sortWithOrdinals(a.label, b.label));

  return (
    <ChipFilterDropdown selected={selected} options={options} onChange={setSelected}>
      Filtrer på hjemler
    </ChipFilterDropdown>
  );
};
