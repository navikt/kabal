import React from 'react';
import { EXTERNAL_URL_GOSYS, EXTERNAL_URL_MODIA } from '@app/domain/eksterne-lenker';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { KABAL_BEHANDLINGER_BASE_PATH } from '@app/redux-api/common';
import { ISakenGjelder } from '@app/types/oppgave-common';
import { StyledExtLinkIcon } from '../view-pdf/styled-components';
import { ExternalLink } from './styled-components';

interface LinkProps {
  sakenGjelder: ISakenGjelder;
}

export const Gosys = ({ sakenGjelder }: LinkProps) => (
  <ExternalLink
    href={`${EXTERNAL_URL_GOSYS}/personoversikt/fnr=${sakenGjelder.id}`}
    target="_blank"
    aria-label="Ekstern lenke til Gosys for denne personen"
    title="Åpne i ny fane"
    rel="noreferrer"
  >
    <span>Gosys</span> <StyledExtLinkIcon title="Ekstern lenke" />
  </ExternalLink>
);

export const Modia = ({ sakenGjelder }: LinkProps) => (
  <ExternalLink
    href={`${EXTERNAL_URL_MODIA}/person/${sakenGjelder.id}`}
    target="_blank"
    aria-label="Ekstern lenke til Modia for denne personen"
    title="Åpne i ny fane"
    rel="noreferrer"
  >
    <span>Modia</span> <StyledExtLinkIcon title="Ekstern lenke" />
  </ExternalLink>
);

export const AaRegisteret = () => {
  const oppgaveId = useOppgaveId();

  if (typeof oppgaveId !== 'string') {
    return null;
  }

  return (
    <ExternalLink
      href={`${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/aaregister`}
      target="_blank"
      aria-label="Ekstern lenke til Aa-registeret for denne personen"
      title="Åpne i ny fane"
      rel="noreferrer"
    >
      <span>Aa-registeret</span> <StyledExtLinkIcon title="Ekstern lenke" />
    </ExternalLink>
  );
};

export const Ainntekt = () => {
  const oppgaveId = useOppgaveId();

  if (typeof oppgaveId !== 'string') {
    return null;
  }

  return (
    <ExternalLink
      href={`${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/ainntekt`}
      target="_blank"
      aria-label="Ekstern lenke til A-inntekt for denne personen"
      title="Åpne i ny fane"
      rel="noreferrer"
    >
      <span>A-inntekt</span> <StyledExtLinkIcon title="Ekstern lenke" />
    </ExternalLink>
  );
};
