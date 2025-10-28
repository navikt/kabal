import { resetDocumentIndexes } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { resetFocusIndex } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { resetKeyboardHelpModal } from '@app/components/documents/journalfoerte-documents/keyboard/state/help-modal';
import { resetKeyboardActive } from '@app/components/documents/journalfoerte-documents/keyboard/state/keyboard-active';
import { resetSelectionRanges } from '@app/components/documents/journalfoerte-documents/keyboard/state/selection';
import { resetShowMetadata } from '@app/components/documents/journalfoerte-documents/state/show-metadata';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useEffect } from 'react';
import { ValidationErrorProvider } from '../kvalitetsvurdering/validation-error-context';
import { OppgavebehandlingControls } from '../oppgavebehandling-controls/oppgavebehandling-controls';
import { Footer } from '../oppgavebehandling-footer/footer';
import { OppgavebehandlingPanels } from '../oppgavebehandling-panels/oppgavebehandling-panels';

export const Oppgavebehandling = () => {
  const oppgaveId = useOppgaveId();

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
    <ValidationErrorProvider>
      <OppgavebehandlingControls />
      <OppgavebehandlingPanels />
      <Footer />
    </ValidationErrorProvider>
  );
};
