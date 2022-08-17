import React, { useState } from 'react';
import { ValidationErrorProvider } from '../kvalitetsvurdering/validation-error-context';
import { OppgavebehandlingControls } from '../oppgavebehandling-controls/oppgavebehandling-controls';
import { TrygderettsankeFooter } from '../oppgavebehandling-footer/trygderettsanke-footer';
import { OppgavebehandlingPanels } from '../oppgavebehandling-panels/oppgavebehandling-panels';
import { PanelToggles } from './types';

export const Trygderettsankebehandling = () => {
  const [toggles, setPanelToggles] = useState<PanelToggles>({
    documents: true,
    smartEditor: false,
    behandling: true,
    kvalitetsvurdering: false,
  });

  const setPanel = (panel: keyof PanelToggles, checked: boolean) => setPanelToggles({ ...toggles, [panel]: checked });

  return (
    <ValidationErrorProvider>
      <OppgavebehandlingControls setPanel={setPanel} toggles={toggles} />
      <OppgavebehandlingPanels toggles={toggles} />
      <TrygderettsankeFooter />
    </ValidationErrorProvider>
  );
};
