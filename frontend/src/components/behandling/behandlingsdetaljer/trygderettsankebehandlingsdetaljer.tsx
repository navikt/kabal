import { Loader } from '@navikt/ds-react';
import React from 'react';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useSakspartName } from '../../../hooks/use-klager-name';
import { PanelHeader } from '../../oppgavebehandling-panels/panel';
import { Type } from '../../type/type';
import { StyledBehandlingsdetaljer, StyledPaddedContent } from '../styled-components';
import { BehandlingSection } from './behandling-section';
import { KjennelseMottatt } from './kjennelse-mottatt';
import { Lovhjemmel } from './lovhjemmel/lovhjemmel';
import { SendtTilTrygderetten } from './sendt-til-trygderetten';
import { UtfallResultat } from './utfall-resultat';
import { Ytelse } from './ytelse';

export const Trygderettsankebehandlingsdetaljer = () => {
  const { data: oppgavebehandling, isLoading } = useOppgave();
  const klagerName = useSakspartName('klager');

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return <Loader />;
  }

  const { type, resultat, ytelse } = oppgavebehandling;

  return (
    <StyledBehandlingsdetaljer>
      <StyledPaddedContent>
        <PanelHeader>Behandling</PanelHeader>

        <BehandlingSection label="Anker">{klagerName ?? ''}</BehandlingSection>

        <BehandlingSection label="Type">
          <Type type={type}></Type>
        </BehandlingSection>

        <Ytelse ytelseId={ytelse} />

        <SendtTilTrygderetten />

        <KjennelseMottatt />

        <UtfallResultat utfall={resultat.utfall} />

        <Lovhjemmel />
      </StyledPaddedContent>
    </StyledBehandlingsdetaljer>
  );
};
