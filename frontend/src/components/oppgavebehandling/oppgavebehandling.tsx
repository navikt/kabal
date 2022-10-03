import React, { useState } from 'react';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { OppgaveType, Utfall } from '../../types/kodeverk';
import { ValidationErrorProvider } from '../kvalitetsvurdering/validation-error-context';
import { OppgavebehandlingControls } from '../oppgavebehandling-controls/oppgavebehandling-controls';
import { Footer } from '../oppgavebehandling-footer/footer';
import { OppgavebehandlingPanels } from '../oppgavebehandling-panels/oppgavebehandling-panels';
import { PanelToggles } from './types';

export const Oppgavebehandling = () => {
  const { data: oppgave } = useOppgave();

  const utfall = oppgave?.resultat.utfall;
  const type = oppgave?.type;

  const hideKvalitetsvurdering =
    type === OppgaveType.ANKE_I_TRYGDERETTEN ||
    utfall === Utfall.TRUKKET ||
    utfall === Utfall.RETUR ||
    utfall === Utfall.UGUNST;

  const switches: PanelToggles = {
    documents: true,
    smartEditor: true,
    behandling: true,
    kvalitetsvurdering: !hideKvalitetsvurdering,
  };

  const [toggles, setPanelToggles] = useState<PanelToggles>(switches);

  const setPanel = (panel: keyof PanelToggles, showContent: boolean) =>
    setPanelToggles({ ...toggles, [panel]: showContent });

  return (
    <ValidationErrorProvider>
      <OppgavebehandlingControls setPanel={setPanel} toggles={toggles} switches={switches} />
      <OppgavebehandlingPanels toggles={toggles} switches={switches} />
      <Footer />
    </ValidationErrorProvider>
  );
};
