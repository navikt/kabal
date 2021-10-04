import React from 'react';
import { PanelToggles } from '../klagebehandling/types';
import { Switch } from '../switch/switch';
import { ToggleButtonsContainer } from './styled-components';

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
    <TogglePanelButton panel={'kvalitetsvurdering'} checked={toggles.kvalitetsvurdering} setPanel={togglePanel}>
      Kvalitetsvurdering
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
  <Switch checked={checked} onChange={(isChecked) => setPanel(panel, isChecked)}>
    {children}
  </Switch>
);
