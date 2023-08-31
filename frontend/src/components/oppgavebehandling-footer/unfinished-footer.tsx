import React, { useContext } from 'react';
import { SendToSaksbehandler } from '@app/components/behandling/behandlingsdialog/rol/send-to-saksbehandler';
import { TakeFromSaksbehandler } from '@app/components/behandling/behandlingsdialog/rol/take-from-saksbehandler';
import { FeilregistrerButton } from '@app/components/oppgavebehandling-footer/feilregistrer-button';
import { FinishButton } from '@app/components/oppgavebehandling-footer/finish-button';
import { NewAnkebehandlingButton } from '@app/components/oppgavebehandling-footer/new-ankebehandling-button';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import { BackLink } from './back-link';
import { DeassignOppgave } from './deassign/deassign-oppgave';
import { VentButton } from './sett-paa-vent/vent-button';
import { FooterType, StyledButtons, StyledFooter } from './styled-components';
import { ValidationSummaryPopup } from './validation-summary-popup';

export const UnfinishedFooter = () => {
  const { validationSectionErrors } = useContext(ValidationErrorContext);
  const { data: oppgave } = useOppgave();
  const isSaksbehandler = useIsSaksbehandler();

  const footerType =
    validationSectionErrors.length === 0 ? FooterType.UNFINISHED_NO_ERRORS : FooterType.UNFINISHED_WITH_ERRORS;

  if (typeof oppgave === 'undefined') {
    return null;
  }

  return (
    <StyledFooter $type={footerType}>
      <StyledButtons>
        <FinishButton />
        <SendToSaksbehandler oppgaveId={oppgave.id} rol={oppgave.rol} isSaksbehandler={isSaksbehandler} />
        <TakeFromSaksbehandler oppgaveId={oppgave.id} rol={oppgave.rol} variant="secondary" />
        <VentButton />
        <BackLink />
        <DeassignOppgave />
        <NewAnkebehandlingButton />
        <FeilregistrerButton />
      </StyledButtons>
      <ValidationSummaryPopup />
    </StyledFooter>
  );
};
