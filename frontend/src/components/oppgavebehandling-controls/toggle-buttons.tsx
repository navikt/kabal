import { Switch } from '@navikt/ds-react';
import React from 'react';
import { PanelToggles } from '../klagebehandling/types';
import { ToggleButtonsContainer } from './styled-components';

interface PanelToggleButtonsProps {
  toggles: PanelToggles;
  togglePanel: (panel: keyof PanelToggles, checked: boolean) => void;
}

export const PanelToggleButtons = ({ togglePanel, toggles }: PanelToggleButtonsProps) => (
  <ToggleButtonsContainer data-testid="klagebehandling-control-panel-toggle-buttons">
    <TogglePanelButton
      panel="documents"
      checked={toggles.documents.showContent}
      show={toggles.documents.showSwitch}
      setPanel={togglePanel}
      testId="klagebehandling-control-panel-toggle-documents"
    >
      Dokumenter
    </TogglePanelButton>
    <TogglePanelButton
      panel="smartEditor"
      checked={toggles.smartEditor.showContent}
      show={toggles.smartEditor.showSwitch}
      setPanel={togglePanel}
      testId="klagebehandling-control-panel-toggle-smart-editor"
    >
      Brevutforming
    </TogglePanelButton>
    <TogglePanelButton
      panel="behandling"
      checked={toggles.behandling.showContent}
      show={toggles.behandling.showSwitch}
      setPanel={togglePanel}
      testId="klagebehandling-control-panel-toggle-behandling"
    >
      Behandling
    </TogglePanelButton>
    <TogglePanelButton
      panel="kvalitetsvurdering"
      checked={toggles.kvalitetsvurdering.showContent}
      show={toggles.kvalitetsvurdering.showSwitch}
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
  show: boolean;
  children: string;
  panel: keyof PanelToggles;
  testId?: string;
}

const TogglePanelButton = ({ show, setPanel, children, checked, panel, testId }: TogglePanelButtonProps) => {
  if (!show) {
    return null;
  }

  return (
    <Switch
      checked={checked}
      size="small"
      onChange={({ target }) => setPanel(panel, target.checked)}
      data-testid={testId}
    >
      {children}
    </Switch>
  );
};
