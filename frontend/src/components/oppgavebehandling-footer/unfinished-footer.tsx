import { SendToSaksbehandler } from '@app/components/behandling/behandlingsdialog/rol/send-to-saksbehandler';
import { TakeFromSaksbehandler } from '@app/components/behandling/behandlingsdialog/rol/take-from-saksbehandler';
import { FeilregistrerButton } from '@app/components/oppgavebehandling-footer/feilregistrer-button';
import { FinishButton } from '@app/components/oppgavebehandling-footer/finish-button';
import { NewAnkebehandlingButton } from '@app/components/oppgavebehandling-footer/new-ankebehandling-button';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useContext } from 'react';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import { BackLink } from './back-link';
import { DeassignOppgave } from './deassign/deassign-oppgave';
import { VentButton } from './sett-paa-vent/vent-button';
import { FooterType, StyledButtons, StyledFooter } from './styled-components';
import { ValidationSummaryPopup } from './validation-summary-popup';

export const UnfinishedFooter = () => {
  const { data: oppgave } = useOppgave();
  const isSaksbehandler = useIsSaksbehandler();
  const footerType = useFooterType();

  if (typeof oppgave === 'undefined') {
    return null;
  }

  return (
    <StyledFooter $type={footerType}>
      <StyledButtons>
        <FinishButton />
        <SendToSaksbehandler oppgaveId={oppgave.id} isSaksbehandler={isSaksbehandler} />
        <TakeFromSaksbehandler oppgaveId={oppgave.id} variant="secondary" />
        <VentButton />
        <BackLink />
        <DeassignOppgave oppgave={oppgave} />
        <NewAnkebehandlingButton />
        <FeilregistrerButton />
      </StyledButtons>
      <ValidationSummaryPopup />
    </StyledFooter>
  );
};

const useFooterType = () => {
  const { validationSectionErrors } = useContext(ValidationErrorContext);
  const { data } = useOppgave();

  if (validationSectionErrors.length > 0) {
    return FooterType.UNFINISHED_WITH_ERRORS;
  }

  if (data?.sattPaaVent !== null) {
    return FooterType.SATT_PAA_VENT;
  }

  return FooterType.UNFINISHED_NO_ERRORS;
};
