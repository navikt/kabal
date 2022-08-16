import React, { useState } from 'react';
import { PanelToggles } from '../klagebehandling/types';
import { ValidationErrorProvider } from '../kvalitetsvurdering/validation-error-context';
import { OppgavebehandlingControls } from '../oppgavebehandling-controls/oppgavebehandling-controls';
import { Footer } from '../oppgavebehandling-footer/footer';
import { OppgavebehandlingPanels } from '../oppgavebehandling-panels/oppgavebehandling-panels';

export const Ankebehandling = () => {
  const [toggles, setPanelToggles] = useState<PanelToggles>({
    documents: {
      showSwitch: true,
      showContent: true,
    },
    smartEditor: {
      showSwitch: true,
      showContent: true,
    },
    behandling: {
      showSwitch: true,
      showContent: true,
    },
    kvalitetsvurdering: {
      showSwitch: true,
      showContent: true,
    },
  });

  const setPanel = (panel: keyof PanelToggles, showContent: boolean) =>
    setPanelToggles({ ...toggles, [panel]: { ...toggles[panel], showContent } });

  return (
    <ValidationErrorProvider>
      <OppgavebehandlingControls setPanel={setPanel} toggles={toggles} />
      <OppgavebehandlingPanels toggles={toggles} />
      <Footer />
    </ValidationErrorProvider>
  );
};
