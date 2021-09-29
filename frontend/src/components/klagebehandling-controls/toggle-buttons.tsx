import React from 'react';
import { PanelToggles } from '../klagebehandling/types';
import { ToggleButtonsContainer } from './styled-components';
import { Switch } from '../switch/switch';

interface PanelToggleButtonsProps {
  toggles: PanelToggles;
  togglePanel: (panel: keyof PanelToggles, checked: boolean) => void;
}

export const PanelToggleButtons = ({ togglePanel, toggles }: PanelToggleButtonsProps) => (
  <ToggleButtonsContainer>
    <TogglePanelButton panel={'documents'} checked={toggles.documents} setPanel={togglePanel}>
      Dokumenter
    </TogglePanelButton>
    <TogglePanelButton panel={'brevutforming'} checked={toggles.brevutforming} setPanel={togglePanel}>
      Brevutforming
    </TogglePanelButton>
    <TogglePanelButton panel={'behandling'} checked={toggles.behandling} setPanel={togglePanel}>
      Behandling
    </TogglePanelButton>
  </ToggleButtonsContainer>
);

interface TogglePanelButtonProps {
  setPanel: (panel: keyof PanelToggles, checked: boolean) => void;
  checked: boolean;
  children: string;
  panel: keyof PanelToggles;
}

const TogglePanelButton = ({ setPanel, children, checked, panel }: TogglePanelButtonProps): JSX.Element => (
  <Switch checked={checked} onChange={(checked) => setPanel(panel, checked)}>
    {children}
  </Switch>
);
