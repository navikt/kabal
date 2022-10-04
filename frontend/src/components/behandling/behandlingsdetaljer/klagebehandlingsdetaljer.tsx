import { Heading, Loader } from '@navikt/ds-react';
import React from 'react';
import { isoDateToPretty } from '../../../domain/date';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useSakspartName } from '../../../hooks/use-klager-name';
import { Type } from '../../type/type';
import { StyledBehandlingSection } from '../styled-components';
import { BehandlingSection } from './behandling-section';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { MeldingFraVedtaksinstans } from './melding-fra-vedtaksinstans';
import { MottattVedtaksinstans } from './mottatt-vedtaksinstans';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

export const Klagebehandlingsdetaljer = () => {
  const { data: oppgavebehandling, isLoading } = useOppgave();
  const klagerName = useSakspartName('klager');

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return <Loader size="xlarge" />;
  }

  const { type, fraNAVEnhetNavn, fraNAVEnhet, mottattKlageinstans, kommentarFraVedtaksinstans, resultat, ytelse } =
    oppgavebehandling;

  return (
    <StyledBehandlingSection>
      <Heading level="1" size="medium" spacing>
        Behandling
      </Heading>

      <BehandlingSection label="Klager">{klagerName ?? ''}</BehandlingSection>

      <BehandlingSection label="Type">
        <Type type={type}></Type>
      </BehandlingSection>

      <Ytelse ytelseId={ytelse} />

      <MottattVedtaksinstans />
      <BehandlingSection label="Fra NAV-enhet">
        {fraNAVEnhetNavn} - {fraNAVEnhet}
      </BehandlingSection>
      <BehandlingSection label="Mottatt klageinstans">{isoDateToPretty(mottattKlageinstans)}</BehandlingSection>

      <MeldingFraVedtaksinstans kommentarFraVedtaksinstans={kommentarFraVedtaksinstans} />

      <UtfallResultat utfall={resultat.utfall} />

      <Lovhjemmel />
    </StyledBehandlingSection>
  );
};
