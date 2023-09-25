import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Link } from '@navikt/ds-react';
import React from 'react';
import { EXTERNAL_URL_MODIA } from '@app/domain/eksterne-lenker';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { KABAL_BEHANDLINGER_BASE_PATH } from '@app/redux-api/common';
import { ISakenGjelder } from '@app/types/oppgave-common';

interface LinkProps {
  sakenGjelder: ISakenGjelder;
}

export const Modia = ({ sakenGjelder }: LinkProps) => (
  <Link
    href={`${EXTERNAL_URL_MODIA}/person/${sakenGjelder.id}`}
    target="_blank"
    aria-label="Ekstern lenke til Modia for denne personen"
    title="Åpne i ny fane"
    rel="noreferrer"
  >
    Modia <ExternalLinkIcon title="Ekstern lenke" />
  </Link>
);

export const AaRegisteret = () => {
  const oppgaveId = useOppgaveId();

  if (typeof oppgaveId !== 'string') {
    return null;
  }

  return (
    <Link
      href={`${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/aaregister`}
      target="_blank"
      aria-label="Ekstern lenke til Aa-registeret for denne personen"
      title="Åpne i ny fane"
      rel="noreferrer"
    >
      Aa-registeret <ExternalLinkIcon title="Ekstern lenke" />
    </Link>
  );
};

export const Ainntekt = () => {
  const oppgaveId = useOppgaveId();

  if (typeof oppgaveId !== 'string') {
    return null;
  }

  return (
    <Link
      href={`${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/ainntekt`}
      target="_blank"
      aria-label="Ekstern lenke til A-inntekt for denne personen"
      title="Åpne i ny fane"
      rel="noreferrer"
    >
      A-inntekt <ExternalLinkIcon title="Ekstern lenke" />
    </Link>
  );
};
