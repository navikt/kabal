import { Heading, Loader } from '@navikt/ds-react';
import React from 'react';
import { Type } from '@app/components/type/type';
import { isoDateToPretty } from '@app/domain/date';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useKlagerName } from '@app/hooks/use-klager-name';
import { StyledBehandlingSection } from '../styled-components';
import { BehandlingSection } from './behandling-section';
import { Fullmektig } from './fullmektig/fullmektig';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { MeldingFraVedtaksinstans } from './melding-fra-vedtaksinstans';
import { MottattVedtaksinstans } from './mottatt-vedtaksinstans';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

export const Klagebehandlingsdetaljer = () => {
  const { data: oppgavebehandling, isLoading } = useOppgave();
  const klagerName = useKlagerName();

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return <Loader size="xlarge" />;
  }

  const { typeId, fraNAVEnhetNavn, fraNAVEnhet, mottattKlageinstans, kommentarFraVedtaksinstans, resultat, ytelseId } =
    oppgavebehandling;

  return (
    <StyledBehandlingSection>
      <Heading level="1" size="medium" spacing>
        Behandling
      </Heading>

      <BehandlingSection label="Klager">{klagerName ?? ''}</BehandlingSection>

      <Fullmektig />

      <BehandlingSection label="Type">
        <Type type={typeId}></Type>
      </BehandlingSection>

      <Ytelse ytelseId={ytelseId} />

      <MottattVedtaksinstans />

      <BehandlingSection label="Fra NAV-enhet">
        {fraNAVEnhetNavn} - {fraNAVEnhet}
      </BehandlingSection>

      <BehandlingSection label="Mottatt klageinstans">{isoDateToPretty(mottattKlageinstans)}</BehandlingSection>

      <MeldingFraVedtaksinstans kommentarFraVedtaksinstans={kommentarFraVedtaksinstans} />

      <UtfallResultat utfall={resultat.utfallId} />

      <Lovhjemmel />
    </StyledBehandlingSection>
  );
};
