import { Heading } from '@navikt/ds-react';
import React from 'react';
import { Type } from '@app/components/type/type';
import { isoDateToPretty } from '@app/domain/date';
import { useUpdateFullmektigMutation, useUpdateKlagerMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Part } from '../../part/part';
import { StyledBehandlingSection } from '../styled-components';
import { BehandlingSection } from './behandling-section';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { MeldingFraVedtaksinstans } from './melding-fra-vedtaksinstans';
import { MottattVedtaksinstans } from './mottatt-vedtaksinstans';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

interface Props {
  oppgavebehandling: IOppgavebehandling;
}

export const Klagebehandlingsdetaljer = ({ oppgavebehandling }: Props) => {
  const [updateFullmektig, { isLoading: fullmektigIsLoading }] = useUpdateFullmektigMutation();
  const [updateKlager, { isLoading: klagerIsLoading }] = useUpdateKlagerMutation();

  const {
    typeId,
    fraNAVEnhetNavn,
    fraNAVEnhet,
    mottattKlageinstans,
    kommentarFraVedtaksinstans,
    resultat,
    ytelseId,
    prosessfullmektig,
  } = oppgavebehandling;

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
