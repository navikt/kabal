import React from 'react';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { PanelToggles } from '../klagebehandling/types';
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
    <TogglePanelButton panel={'details'} checked={toggles.details} setPanel={togglePanel}>
      Details
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
  <ToggleButton pressed={checked} onCheck={(checked) => setPanel(panel, checked)}>
    {children}
  </ToggleButton>
);

interface ToggleButtonProps {
  pressed: boolean;
  children: string;
  onCheck: (checked: boolean) => void;
}

const ToggleButton = ({ pressed, children, onCheck }: ToggleButtonProps) => {
  if (pressed) {
    return (
      <Hovedknapp aria-pressed={pressed} onClick={() => onCheck(!pressed)}>
        {children}
      </Hovedknapp>
    );
  }
  return (
    <Knapp aria-pressed={pressed} onClick={() => onCheck(!pressed)}>
      {children}
    </Knapp>
  );
};
