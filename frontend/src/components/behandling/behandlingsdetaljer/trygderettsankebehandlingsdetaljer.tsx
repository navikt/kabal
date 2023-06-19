import { Heading, Loader } from '@navikt/ds-react';
import React from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useUpdateFullmektigMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { Part } from '../../part/part';
import { Type } from '../../type/type';
import { StyledBehandlingSection } from '../styled-components';
import { BehandlingSection } from './behandling-section';
import { KjennelseMottatt } from './kjennelse-mottatt';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { SendtTilTrygderetten } from './sendt-til-trygderetten';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

export const Trygderettsankebehandlingsdetaljer = () => {
  const { data: oppgavebehandling, isLoading } = useOppgave();
  const [updateFullmektig, { isLoading: fullmektigIsLoading }] = useUpdateFullmektigMutation();

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return <Loader />;
  }

  const { typeId, resultat, ytelseId, prosessfullmektig } = oppgavebehandling;

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

      <Ytelse ytelseId={ytelseId} />

      <SendtTilTrygderetten />

      <KjennelseMottatt />

      <UtfallResultat utfall={resultat.utfallId} />

      <Lovhjemmel />
    </StyledBehandlingSection>
  );
};
