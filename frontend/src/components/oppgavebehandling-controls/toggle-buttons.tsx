import { Switch } from '@navikt/ds-react';
import React from 'react';
import { PanelToggles } from '../oppgavebehandling/types';
import { ToggleButtonsContainer } from './styled-components';

interface PanelToggleButtonsProps {
  toggles: PanelToggles;
  switches: PanelToggles;
  togglePanel: (panel: keyof PanelToggles, checked: boolean) => void;
}

export const PanelToggleButtons = ({ togglePanel, toggles, switches }: PanelToggleButtonsProps) => (
  <ToggleButtonsContainer data-testid="klagebehandling-control-panel-toggle-buttons">
    <TogglePanelButton
      panel="documents"
      checked={toggles.documents}
      show={switches.documents}
      setPanel={togglePanel}
      testId="klagebehandling-control-panel-toggle-documents"
    >
      Dokumenter
    </TogglePanelButton>
    <TogglePanelButton
      panel="smartEditor"
      checked={toggles.smartEditor}
      show={switches.smartEditor}
      setPanel={togglePanel}
      testId="klagebehandling-control-panel-toggle-smart-editor"
    >
      Brevutforming
    </TogglePanelButton>
    <TogglePanelButton
      panel="behandling"
      checked={toggles.behandling}
      show={switches.behandling}
      setPanel={togglePanel}
      testId="klagebehandling-control-panel-toggle-behandling"
    >
      Behandling
    </TogglePanelButton>
    <TogglePanelButton
      panel="kvalitetsvurdering"
      checked={toggles.kvalitetsvurdering}
      show={switches.kvalitetsvurdering}
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
