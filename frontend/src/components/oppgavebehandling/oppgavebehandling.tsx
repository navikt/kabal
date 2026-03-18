import { useEffect } from 'react';
import { resetDocumentIndexes } from '@/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { resetFocusIndex } from '@/components/documents/journalfoerte-documents/keyboard/state/focus';
import { resetKeyboardHelpModal } from '@/components/documents/journalfoerte-documents/keyboard/state/help-modal';
import { resetKeyboardActive } from '@/components/documents/journalfoerte-documents/keyboard/state/keyboard-active';
import { resetSelectionRanges } from '@/components/documents/journalfoerte-documents/keyboard/state/selection';
import { resetShowMetadata } from '@/components/documents/journalfoerte-documents/state/show-metadata';
import { ValidationErrorProvider } from '@/components/kvalitetsvurdering/validation-error-context';
import { OppgavebehandlingControls } from '@/components/oppgavebehandling-controls/oppgavebehandling-controls';
import { Footer } from '@/components/oppgavebehandling-footer/footer';
import { OppgavebehandlingPanels } from '@/components/oppgavebehandling-panels/oppgavebehandling-panels';
import { PanelShortcutsProvider } from '@/components/oppgavebehandling-panels/panel-shortcuts-context';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useTimingMeasurement } from '@/hooks/use-timing-measurement';

export const Oppgavebehandling = () => {
  const oppgaveId = useOppgaveId();
  const { isLoading } = useOppgave();

  useTimingMeasurement('behandling_load_ms', !isLoading);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset states when oppgave changes
  useEffect(
    () => () => {
      resetDocumentIndexes();
      resetFocusIndex();
      resetKeyboardHelpModal();
      resetKeyboardActive();
      resetSelectionRanges();
      resetShowMetadata();
    },
    [oppgaveId],
  );

  return (
    <PanelShortcutsProvider>
      <ValidationErrorProvider>
        <OppgavebehandlingControls />
        <OppgavebehandlingPanels />
        <Footer />
      </ValidationErrorProvider>
    </PanelShortcutsProvider>
  );
};
