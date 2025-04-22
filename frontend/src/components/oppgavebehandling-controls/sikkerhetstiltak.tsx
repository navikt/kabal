import type { ISikkerhetstiltak } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Alert } from '@navikt/ds-react';

interface Props {
  sikkerhetstiltak: ISikkerhetstiltak | null;
}

export const Sikkerhetstiltak = ({ sikkerhetstiltak }: Props) => {
  if (sikkerhetstiltak === null) {
    return null;
  }

  return (
    <Alert variant="warning" size="small">
      {sikkerhetstiltak.beskrivelse}
    </Alert>
  );
};
