import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import { SelectHjemler } from '@/components/filter-dropdown/select-hjemler';
import { InputError } from '@/components/input-error/input-error';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useLovkildeToRegistreringshjemmelForYtelse } from '@/hooks/use-kodeverk-value';

interface LovhjemmelSelectProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  error?: string;
  children: string;
}

export const LovhjemmelSelect = ({ onChange, selected, error, children }: LovhjemmelSelectProps) => {
  const { data: oppgave } = useOppgave();
  const lovKildeToRegistreringshjemler = useLovkildeToRegistreringshjemmelForYtelse(oppgave?.ytelseId ?? skipToken);

  const options = useMemo(
    () =>
      lovKildeToRegistreringshjemler.map(({ lovkilde: { id, navn, beskrivelse }, registreringshjemler }) => ({
        id,
        navn,
        beskrivelse,
        registreringshjemler,
      })),
    [lovKildeToRegistreringshjemler],
  );

  return (
    <>
      <SelectHjemler selectedHjemler={selected} setSelectedHjemler={onChange} label={children} options={options} />

      <InputError error={error} />
    </>
  );
};
