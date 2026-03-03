import { Alert } from '@app/components/alert/alert';
import type { ISikkerhetstiltak } from '@app/types/oppgavebehandling/oppgavebehandling';

interface Props {
  sikkerhetstiltak: ISikkerhetstiltak | null;
}

export const Sikkerhetstiltak = ({ sikkerhetstiltak }: Props) => {
  if (sikkerhetstiltak === null) {
    return null;
  }

  return <Alert variant="warning">{sikkerhetstiltak.beskrivelse}</Alert>;
};
