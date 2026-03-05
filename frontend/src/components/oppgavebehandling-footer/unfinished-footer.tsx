import { SendToSaksbehandler } from '@app/components/behandling/behandlingsdialog/rol/send-to-saksbehandler';
import { TakeFromSaksbehandler } from '@app/components/behandling/behandlingsdialog/rol/take-from-saksbehandler';
import { ValidationErrorContext } from '@app/components/kvalitetsvurdering/validation-error-context';
import { BackLink } from '@app/components/oppgavebehandling-footer/back-link';
import { DeassignOppgave } from '@app/components/oppgavebehandling-footer/deassign/deassign-oppgave';
import { FeilregistrerButton } from '@app/components/oppgavebehandling-footer/feilregistrer-button';
import { FinishButton } from '@app/components/oppgavebehandling-footer/finish-button';
import { NewAnkebehandlingButton } from '@app/components/oppgavebehandling-footer/new-ankebehandling-button';
import { VentButton } from '@app/components/oppgavebehandling-footer/sett-paa-vent/vent-button';
import { FooterType, StyledFooter } from '@app/components/oppgavebehandling-footer/styled-components';
import { ValidationSummaryPopup } from '@app/components/oppgavebehandling-footer/validation-summary-popup';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { HStack } from '@navikt/ds-react';
import { useContext } from 'react';

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

        {oppgave.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ||
        oppgave.typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR ? (
          <NewAnkebehandlingButton typeId={oppgave.typeId} oppgaveId={oppgave.id} />
        ) : null}

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
