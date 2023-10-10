import { Heading } from '@navikt/ds-react';
import React from 'react';
import { ExtraUtfall } from '@app/components/behandling/behandlingsdetaljer/extra-utfall';
import { Saksnummer } from '@app/components/behandling/behandlingsdetaljer/saksnummer';
import { useUpdateFullmektigMutation, useUpdateKlagerMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Part } from '../../part/part';
import { Type } from '../../type/type';
import { StyledBehandlingSection } from '../styled-components';
import { AnkeMottattDato } from './anke-mottatt-dato';
import { BehandlingSection } from './behandling-section';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

interface Props {
  oppgavebehandling: IOppgavebehandling;
}

export const Ankebehandlingsdetaljer = ({ oppgavebehandling }: Props) => {
  const [updateFullmektig, { isLoading: fullmektigIsLoading }] = useUpdateFullmektigMutation();
  const [updateKlager, { isLoading: klagerIsLoading }] = useUpdateKlagerMutation();

  const { typeId, fraNAVEnhetNavn, fraNAVEnhet, resultat, ytelseId, prosessfullmektig, saksnummer } = oppgavebehandling;

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

      <BehandlingSection label="Ytelse">
        <Ytelse ytelseId={ytelseId} />
      </BehandlingSection>

      <Saksnummer saksnummer={saksnummer} />

      <BehandlingSection label="Behandlet av">
        {fraNAVEnhetNavn} &mdash; {fraNAVEnhet}
      </BehandlingSection>

      <AnkeMottattDato />

      <UtfallResultat utfall={resultat.utfallId} oppgaveId={oppgavebehandling.id} />

      <ExtraUtfall
        utfallIdSet={resultat.extraUtfallIdSet}
        mainUtfall={resultat.utfallId}
        oppgaveId={oppgavebehandling.id}
      />

      <Lovhjemmel />
    </StyledBehandlingSection>
  );
};
