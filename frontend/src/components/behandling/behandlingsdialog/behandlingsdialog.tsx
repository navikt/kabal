import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import React from 'react';
import { StyledBehandlingsdialog, StyledSubHeader } from '../styled-components';

export const Behandlingsdialog = () => (
  <StyledBehandlingsdialog>
    <StyledSubHeader>Behandlingsdialog</StyledSubHeader>

    <Knapp mini>Send til medunderskriver</Knapp>
    <AlertStripe type="info">Sendt til medunderskriver</AlertStripe>
  </StyledBehandlingsdialog>
);
