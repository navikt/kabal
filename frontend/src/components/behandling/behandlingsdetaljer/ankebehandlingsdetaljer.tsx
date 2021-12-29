import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { isoDateToPretty } from '../../../domain/date';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useKlagerName } from '../../../hooks/use-klager-name';
import { StyledBehandlingsdetaljer, StyledHeader, StyledPaddedContent } from '../styled-components';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { SubSection } from './sub-section';
import { Type } from './type';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

export const Ankebehandlingsdetaljer = () => {
  const { data: oppgavebehandling, isLoading } = useOppgave();
  const klagerName = useKlagerName();

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const { type, klageInnsendtdato, fraNAVEnhetNavn, fraNAVEnhet, mottattKlageinstans, resultat, ytelse } =
    oppgavebehandling;

  return (
    <StyledBehandlingsdetaljer>
      <StyledPaddedContent>
        <StyledHeader>Behandling</StyledHeader>

        <SubSection label="Klager">{klagerName ?? ''}</SubSection>

        <Type typeId={type} />

        <Ytelse ytelseId={ytelse} />

        <SubSection label="Vedtak klageinstans">{isoDateToPretty(klageInnsendtdato)}</SubSection>
        <SubSection label="Behandlet av">
          {fraNAVEnhetNavn} &mdash; {fraNAVEnhet}
        </SubSection>
        <SubSection label="Anke mottatt dato">{isoDateToPretty(mottattKlageinstans)}</SubSection>

        <UtfallResultat utfall={resultat.utfall} />

        <Lovhjemmel />
      </StyledPaddedContent>
    </StyledBehandlingsdetaljer>
  );
};
