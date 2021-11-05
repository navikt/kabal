import React, { useState } from 'react';
import { KlagebehandlingControls } from '../klagebehandling-controls/klagebehandling-controls';
import { KlagebehandlingPanels } from '../klagebehandling-panels/klagebehandling-panels';
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
    <>
      <KlagebehandlingControls setPanel={setPanel} toggles={toggles} />
      <KlagebehandlingPanels toggles={toggles} />
    </>
  );
};
