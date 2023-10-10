import { Heading } from '@navikt/ds-react';
import React from 'react';
import { ExtraUtfall } from '@app/components/behandling/behandlingsdetaljer/extra-utfall';
import { Saksnummer } from '@app/components/behandling/behandlingsdetaljer/saksnummer';
import { useUpdateFullmektigMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Part } from '../../part/part';
import { Type } from '../../type/type';
import { StyledBehandlingSection } from '../styled-components';
import { BehandlingSection } from './behandling-section';
import { KjennelseMottatt } from './kjennelse-mottatt';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { SendtTilTrygderetten } from './sendt-til-trygderetten';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

interface Props {
  oppgavebehandling: IOppgavebehandling;
}

export const Trygderettsankebehandlingsdetaljer = ({ oppgavebehandling }: Props) => {
  const [updateFullmektig, { isLoading: fullmektigIsLoading }] = useUpdateFullmektigMutation();

  const { typeId, resultat, ytelseId, prosessfullmektig, saksnummer } = oppgavebehandling;

  return (
    <StyledBehandlingSection>
      <Heading level="1" size="medium" spacing>
        Behandling
      </Heading>

      <BehandlingSection label="Anker">{oppgavebehandling.klager.name ?? ''}</BehandlingSection>

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

      <SendtTilTrygderetten />

      <KjennelseMottatt />

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
