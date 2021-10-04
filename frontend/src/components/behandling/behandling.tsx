import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { IKlagebehandling } from '../../redux-api/oppgave-state-types';
import { IKlagebehandlingUpdate } from '../../redux-api/oppgave-types';
import { PanelContainer } from '../klagebehandling-panels/panel';
import { Behandlingsdetaljer } from './behandlingsdetaljer/behandlingsdetaljer';
import { Behandlingsdialog } from './behandlingsdialog/behandlingsdialog';
import { StyledContainer } from './styled-components';

interface BehandlingProps {
  shown: boolean;
  klagebehandling?: IKlagebehandling;
  onChange: (klagebehandlingUpdate: Partial<IKlagebehandlingUpdate>) => void;
  isLoading: boolean;
}

export const Behandling = ({ isLoading, shown, klagebehandling, onChange }: BehandlingProps) => {
  if (!shown) {
    return null;
  }

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  return (
    <PanelContainer width={40}>
      <StyledContainer>
        <Behandlingsdetaljer klagebehandling={klagebehandling} onChange={onChange} />
        <Behandlingsdialog />
      </StyledContainer>
    </PanelContainer>
  );
};
