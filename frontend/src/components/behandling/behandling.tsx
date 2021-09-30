import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetKlagebehandlingQuery } from '../../redux-api/oppgave';
import { PanelContainer } from '../klagebehandling-panels/panel';
import { Behandlingsdialog } from './behandlingsdialog';
import { StyledContainer } from './styled-components';
import { Behandlingsdetaljer } from './behandlingsdetaljer';

interface BehandlingProps {
  shown: boolean;
}

export const Behandling = ({ shown }: BehandlingProps) => {
  const { id } = useParams<{ id: string }>();
  const { data: klagebehandling, isLoading } = useGetKlagebehandlingQuery(id);

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  if (!shown) {
    return null;
  }

  return (
    <PanelContainer>
      <StyledContainer>
        <Behandlingsdetaljer klagebehandling={klagebehandling} />
        <Behandlingsdialog />
      </StyledContainer>
    </PanelContainer>
  );
};
