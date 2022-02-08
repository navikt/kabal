import React, { useState } from 'react';
import { ValidationErrorProvider } from '../kvalitetsvurdering/validation-error-context';
import { OppgavebehandlingControls } from '../oppgavebehandling-controls/oppgavebehandling-controls';
import { KlageFooter } from '../oppgavebehandling-footer/klage-footer';
import { OppgavebehandlingPanels } from '../oppgavebehandling-panels/oppgavebehandling-panels';
import { PanelToggles } from './types';

export const Klagebehandling = () => {
  const [toggles, setPanelToggles] = useState<PanelToggles>({
    documents: true,
    smartEditor: true,
    behandling: true,
    kvalitetsvurdering: true,
  });

  const setPanel = (panel: keyof PanelToggles, checked: boolean) => setPanelToggles({ ...toggles, [panel]: checked });

  return (
    <ValidationErrorProvider>
      <OppgavebehandlingControls setPanel={setPanel} toggles={toggles} />
      <OppgavebehandlingPanels toggles={toggles} />
      <KlageFooter />
    </ValidationErrorProvider>
  );
};
