import React from 'react';
import { PanelToggles } from '../klagebehandling/types';
import { Switch } from '../switch/switch';
import { ToggleButtonsContainer } from './styled-components';

interface PanelToggleButtonsProps {
  toggles: PanelToggles;
  togglePanel: (panel: keyof PanelToggles, checked: boolean) => void;
}

export const PanelToggleButtons = ({ togglePanel, toggles }: PanelToggleButtonsProps) => (
  <ToggleButtonsContainer data-testid="klagebehandling-control-panel-toggle-buttons">
    <TogglePanelButton
      panel="documents"
      checked={toggles.documents}
      setPanel={togglePanel}
      testId="klagebehandling-control-panel-toggle-documents"
    >
      Dokumenter
    </TogglePanelButton>
    <TogglePanelButton
      panel="smartEditor"
      checked={toggles.smartEditor}
      setPanel={togglePanel}
      testId="klagebehandling-control-panel-toggle-smart-editor"
    >
      Brevutforming
    </TogglePanelButton>
    <TogglePanelButton
      panel="behandling"
      checked={toggles.behandling}
      setPanel={togglePanel}
      testId="klagebehandling-control-panel-toggle-behandling"
    >
      Behandling
    </TogglePanelButton>
    <TogglePanelButton
      panel="kvalitetsvurdering"
      checked={toggles.kvalitetsvurdering}
      setPanel={togglePanel}
      testId="klagebehandling-control-panel-toggle-kvalitetsvurdering"
    >
      Kvalitetsvurdering
    </TogglePanelButton>
  </ToggleButtonsContainer>
);

interface TogglePanelButtonProps {
  setPanel: (panel: keyof PanelToggles, checked: boolean) => void;
  checked: boolean;
  children: string;
  panel: keyof PanelToggles;
  testId?: string;
}

const TogglePanelButton = ({ setPanel, children, checked, panel, testId }: TogglePanelButtonProps): JSX.Element => (
  <Switch checked={checked} onChange={(isChecked) => setPanel(panel, isChecked)} testId={testId}>
    {children}
  </Switch>
);
