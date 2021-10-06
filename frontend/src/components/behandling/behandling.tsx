import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { IKlagebehandling } from '../../redux-api/oppgave-state-types';
import { PanelContainer } from '../klagebehandling-panels/panel';
import { Behandlingsdetaljer } from './behandlingsdetaljer/behandlingsdetaljer';
import { Behandlingsdialog } from './behandlingsdialog/behandlingsdialog';
import { StyledContainer } from './styled-components';

interface BehandlingProps {
  shown: boolean;
  klagebehandling?: IKlagebehandling;
  isLoading: boolean;
}

export const Behandling = ({ isLoading, shown, klagebehandling }: BehandlingProps) => {
  if (!shown) {
    return null;
  }

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  return (
    <PanelContainer>
      <StyledContainer>
        <Behandlingsdetaljer klagebehandling={klagebehandling} />
        <Behandlingsdialog klagebehandling={klagebehandling} />
      </StyledContainer>
    </PanelContainer>
  );
};
