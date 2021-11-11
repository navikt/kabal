import React from 'react';
import { PanelContainer } from '../klagebehandling-panels/panel';
import { Kvalitetsskjema } from './kvalitetsskjema';
import { Header, KvalitetsVurderingContainer } from './styled-components';

interface KvalitetsvurderingProps {
  shown: boolean;
}

export const Kvalitetsvurdering = ({ shown }: KvalitetsvurderingProps): JSX.Element | null => {
  if (!shown) {
    return null;
  }

  return (
    <PanelContainer data-testid="kvalitetsvurdering-panel">
      <KvalitetsVurderingContainer>
        <Header>Kvalitetsvurdering</Header>
        <Kvalitetsskjema />
      </KvalitetsVurderingContainer>
    </PanelContainer>
  );
};
