import { HStack } from '@navikt/ds-react';
import { useContext } from 'react';
import { SendToSaksbehandler } from '@/components/behandling/behandlingsdialog/rol/send-to-saksbehandler';
import { TakeFromSaksbehandler } from '@/components/behandling/behandlingsdialog/rol/take-from-saksbehandler';
import { ValidationErrorContext } from '@/components/kvalitetsvurdering/validation-error-context';
import { BackLink } from '@/components/oppgavebehandling-footer/back-link';
import { DeassignOppgave } from '@/components/oppgavebehandling-footer/deassign/deassign-oppgave';
import { FeilregistrerButton } from '@/components/oppgavebehandling-footer/feilregistrer-button';
import { FinishButton } from '@/components/oppgavebehandling-footer/finish-button';
import { NewAnkebehandlingButton } from '@/components/oppgavebehandling-footer/new-ankebehandling-button';
import { VentButton } from '@/components/oppgavebehandling-footer/sett-paa-vent/vent-button';
import { FooterType, StyledFooter } from '@/components/oppgavebehandling-footer/styled-components';
import { ValidationSummaryPopup } from '@/components/oppgavebehandling-footer/validation-summary-popup';
import { isTrygderettenBehandling } from '@/functions/is-trygderetten-sak';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';

export const UnfinishedFooter = () => {
  const { data: oppgave, isSuccess } = useOppgave();
  const isSaksbehandler = useIsTildeltSaksbehandler();
  const footerType = useFooterType();

  if (!isSuccess) {
    return null;
  }

  return (
    <StyledFooter type={footerType}>
      <HStack align="center" justify="space-between" gap="space-16">
        <FinishButton />
        <SendToSaksbehandler oppgaveId={oppgave.id} isSaksbehandler={isSaksbehandler} />
        <TakeFromSaksbehandler oppgaveId={oppgave.id} variant="secondary-neutral" />
        <VentButton />
        <BackLink />
        <DeassignOppgave oppgave={oppgave} />

        {isTrygderettenBehandling(oppgave) ? <NewAnkebehandlingButton oppgave={oppgave} /> : null}

        <FeilregistrerButton />
      </HStack>
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
