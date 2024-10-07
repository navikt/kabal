import { BehandlingDebug } from '@app/components/header/user-menu/debug';
import { ValidationErrorProvider } from '../kvalitetsvurdering/validation-error-context';
import { OppgavebehandlingControls } from '../oppgavebehandling-controls/oppgavebehandling-controls';
import { Footer } from '../oppgavebehandling-footer/footer';
import { OppgavebehandlingPanels } from '../oppgavebehandling-panels/oppgavebehandling-panels';

export const Oppgavebehandling = () => (
  <ValidationErrorProvider>
    <OppgavebehandlingControls />
    <OppgavebehandlingPanels />
    <Footer />
    <BehandlingDebug />
  </ValidationErrorProvider>
);
