import { Heading, Loader } from '@navikt/ds-react';
import React from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useKlagerName } from '@app/hooks/use-klager-name';
import { Type } from '../../type/type';
import { StyledBehandlingSection } from '../styled-components';
import { AnkeMottattDato } from './anke-mottatt-dato';
import { BehandlingSection } from './behandling-section';
import { Fullmektig } from './fullmektig/fullmektig';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

export const Ankebehandlingsdetaljer = () => {
  const { data: oppgavebehandling, isLoading } = useOppgave();
  const klagerName = useKlagerName();

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return <Loader />;
  }

  const { typeId, fraNAVEnhetNavn, fraNAVEnhet, resultat, ytelseId } = oppgavebehandling;

  return (
    <StyledBehandlingSection>
      <Heading level="1" size="medium" spacing>
        Behandling
      </Heading>

      <BehandlingSection label="Anker">{klagerName ?? ''}</BehandlingSection>

      <Fullmektig />

      <BehandlingSection label="Type">
        <Type type={typeId}></Type>
      </BehandlingSection>

      <Ytelse ytelseId={ytelseId} />

      <BehandlingSection label="Behandlet av">
        {fraNAVEnhetNavn} &mdash; {fraNAVEnhet}
      </BehandlingSection>

      <AnkeMottattDato />

      <UtfallResultat utfall={resultat.utfallId} />

      <Lovhjemmel />
    </StyledBehandlingSection>
  );
};
