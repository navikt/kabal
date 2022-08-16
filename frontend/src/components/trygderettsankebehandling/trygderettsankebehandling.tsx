import React, { useState } from 'react';
import { PanelToggles } from '../klagebehandling/types';
import { ValidationErrorProvider } from '../kvalitetsvurdering/validation-error-context';
import { OppgavebehandlingControls } from '../oppgavebehandling-controls/oppgavebehandling-controls';
import { Footer } from '../oppgavebehandling-footer/footer';
import { TrygderettsankePanels } from './panels';

export const Trygderettsankebehandling = () => {
  const [toggles, setPanelToggles] = useState<PanelToggles>({
    documents: {
      showSwitch: true,
      showContent: true,
    },
    smartEditor: {
      showSwitch: true,
      showContent: false,
    },
    behandling: {
      showSwitch: true,
      showContent: true,
    },
    kvalitetsvurdering: {
      showSwitch: false,
      showContent: false,
    },
  });

  const setPanel = (panel: keyof PanelToggles, showContent: boolean) =>
    setPanelToggles({ ...toggles, [panel]: { ...toggles[panel], showContent } });

  return (
    <ValidationErrorProvider>
      <OppgavebehandlingControls setPanel={setPanel} toggles={toggles} />
      <TrygderettsankePanels toggles={toggles} />
      <Footer />
    </ValidationErrorProvider>
  );
};
