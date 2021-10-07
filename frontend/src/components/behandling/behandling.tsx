import React from 'react';
import { PanelContainer } from '../klagebehandling-panels/panel';
import { Behandlingsdetaljer } from './behandlingsdetaljer/behandlingsdetaljer';
import { Behandlingsdialog } from './behandlingsdialog/behandlingsdialog';
import { StyledContainer } from './styled-components';

interface BehandlingProps {
  shown: boolean;
}

export const Behandling = ({ shown }: BehandlingProps) => {
  if (!shown) {
    return null;
  }

  return (
    <PanelContainer>
      <StyledContainer>
        <Behandlingsdetaljer />
        <Behandlingsdialog />
      </StyledContainer>
    </PanelContainer>
  );
};
