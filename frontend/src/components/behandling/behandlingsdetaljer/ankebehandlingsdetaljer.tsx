import { Heading, Loader } from '@navikt/ds-react';
import React from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useUpdateFullmektigMutation, useUpdateKlagerMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { Part } from '../../part/part';
import { Type } from '../../type/type';
import { StyledBehandlingSection } from '../styled-components';
import { AnkeMottattDato } from './anke-mottatt-dato';
import { BehandlingSection } from './behandling-section';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

export const Ankebehandlingsdetaljer = () => {
  const { data: oppgavebehandling, isLoading } = useOppgave();
  const [updateFullmektig, { isLoading: fullmektigIsLoading }] = useUpdateFullmektigMutation();
  const [updateKlager, { isLoading: klagerIsLoading }] = useUpdateKlagerMutation();

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return <Loader />;
  }

  const { typeId, fraNAVEnhetNavn, fraNAVEnhet, resultat, ytelseId, prosessfullmektig } = oppgavebehandling;

  return (
    <StyledBehandlingSection>
      <Heading level="1" size="medium" spacing>
        Behandling
      </Heading>

      <Part
        isDeletable={false}
        label="Klager"
        part={oppgavebehandling.klager}
        onChange={(klager) => updateKlager({ klager, oppgaveId: oppgavebehandling.id })}
        isLoading={klagerIsLoading}
      />

      <Part
        isDeletable
        label="Fullmektig"
        part={prosessfullmektig}
        onChange={(fullmektig) => updateFullmektig({ fullmektig, oppgaveId: oppgavebehandling.id })}
        isLoading={fullmektigIsLoading}
      />

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
