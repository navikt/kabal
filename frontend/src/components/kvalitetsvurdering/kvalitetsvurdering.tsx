import React from 'react';
import { SECTION_KEY } from '../../functions/error-type-guard';
import { useSectionTitle } from '../../hooks/use-section-title';
import { PanelContainer, PanelHeader } from '../oppgavebehandling-panels/styled-components';
import { Kvalitetsskjema } from './kvalitetsskjema';
import { KvalitetsVurderingContainer } from './styled-components';

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
        <PanelHeader>{header}</PanelHeader>
        <Kvalitetsskjema />
      </KvalitetsVurderingContainer>
    </PanelContainer>
  );
};
