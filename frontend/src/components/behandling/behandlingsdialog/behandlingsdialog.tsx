import React from 'react';
import { StyledBehandlingsdialog, StyledSubHeader } from '../styled-components';
import { Medunderskriver } from './medunderskriver/medunderskriver';
import { Messages } from './messages/messages';

export const Behandlingsdialog = () => (
  <StyledBehandlingsdialog>
    <StyledSubHeader>Behandlingsdialog</StyledSubHeader>
    <Medunderskriver />
    <Messages />
  </StyledBehandlingsdialog>
);
