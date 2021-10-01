import React from 'react';
import { PanelContainer } from '../klagebehandling-panels/panel';
import { Avvik } from './avvik';
import { Oversendelsesbrev } from './oversendelsesbrev/oversendelsesbrev';
import { Header, KvalitetsVurderingContainer } from './styled-components';
import { Utredning } from './utredning/utredning';
import { Vedtak } from './vedtak/vedtak';

interface KvalitetsvurderingProps {
  shown: boolean;
}

export const Kvalitetsvurdering = ({ shown }: KvalitetsvurderingProps): JSX.Element | null => {
  if (!shown) {
    return null;
  }

  return (
    <PanelContainer width={47}>
      <KvalitetsVurderingContainer>
        <Header>Kvalitetsskjema</Header>
        <Oversendelsesbrev />
        <Utredning />
        <Vedtak />
        <Avvik />
      </KvalitetsVurderingContainer>
    </PanelContainer>
  );
};
