import React from 'react';
import { SECTION_KEY } from '../../functions/error-type-guard';
import { useSectionTitle } from '../../hooks/use-section-title';
import { PanelContainer } from '../oppgavebehandling-panels/panel';
import { Kvalitetsskjema } from './kvalitetsskjema';
import { Header, KvalitetsVurderingContainer } from './styled-components';

interface KvalitetsvurderingProps {
  shown: boolean;
}

export const Kvalitetsvurdering = ({ shown }: KvalitetsvurderingProps): JSX.Element | null => {
  const header = useSectionTitle(SECTION_KEY.KVALITETSVURDERING);

  if (!shown) {
    return null;
  }

  return (
    <PanelContainer data-testid="kvalitetsvurdering-panel">
      <KvalitetsVurderingContainer>
        <Header>{header}</Header>
        <Kvalitetsskjema />
      </KvalitetsVurderingContainer>
    </PanelContainer>
  );
};
