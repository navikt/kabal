import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useSakspartName } from '../../../hooks/use-klager-name';
import { PanelHeader } from '../../oppgavebehandling-panels/panel';
import { Type } from '../../type/type';
import { StyledBehandlingsdetaljer, StyledPaddedContent } from '../styled-components';
import { AnkeMottattDato } from './anke-mottatt-dato';
import { BehandlingSection } from './behandling-section';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

export const Ankebehandlingsdetaljer = () => {
  const { data: oppgavebehandling, isLoading } = useOppgave();
  const klagerName = useSakspartName('klager');

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const { type, fraNAVEnhetNavn, fraNAVEnhet, resultat, ytelse } = oppgavebehandling;

  return (
    <StyledBehandlingsdetaljer>
      <StyledPaddedContent>
        <PanelHeader>Behandling</PanelHeader>

        <BehandlingSection label="Klager">{klagerName ?? ''}</BehandlingSection>

        <BehandlingSection label="Type">
          <Type type={type}></Type>
        </BehandlingSection>

        <Ytelse ytelseId={ytelse} />

        <BehandlingSection label="Behandlet av">
          {fraNAVEnhetNavn} &mdash; {fraNAVEnhet}
        </BehandlingSection>

        <AnkeMottattDato />

        <UtfallResultat utfall={resultat.utfall} />

        <Lovhjemmel />
      </StyledPaddedContent>
    </StyledBehandlingsdetaljer>
  );
};
