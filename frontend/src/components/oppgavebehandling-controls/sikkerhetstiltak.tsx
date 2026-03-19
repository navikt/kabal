import { Alert } from '@/components/alert/alert';
import type { ISikkerhetstiltak } from '@/types/oppgavebehandling/oppgavebehandling';

interface Props {
  sikkerhetstiltak: ISikkerhetstiltak | null;
}

export const Sikkerhetstiltak = ({ sikkerhetstiltak }: Props) => {
  if (sikkerhetstiltak === null) {
    return null;
  }

  return <Alert variant="warning">{sikkerhetstiltak.beskrivelse}</Alert>;
};
