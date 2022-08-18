import React from 'react';
import { PanelHeader } from '../../oppgavebehandling-panels/styled-components';
import { StyledBehandlingsdialog } from '../styled-components';
import { Medunderskriver } from './medunderskriver/medunderskriver';
import { Messages } from './messages/messages';

export const Behandlingsdialog = () => (
  <StyledBehandlingsdialog>
    <PanelHeader>Behandlingsdialog</PanelHeader>
    <Medunderskriver />
    <Messages />
  </StyledBehandlingsdialog>
);
