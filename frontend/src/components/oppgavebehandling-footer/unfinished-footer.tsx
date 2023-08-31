import React, { useContext } from 'react';
import { FeilregistrerButton } from '@app/components/oppgavebehandling-footer/feilregistrer-button';
import { FinishButton } from '@app/components/oppgavebehandling-footer/finish-button';
import { NewAnkebehandlingButton } from '@app/components/oppgavebehandling-footer/new-ankebehandling-button';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import { BackLink } from './back-link';
import { DeassignOppgave } from './deassign/deassign-oppgave';
import { VentButton } from './sett-paa-vent/vent-button';
import { FooterType, StyledButtons, StyledFooter } from './styled-components';
import { ValidationSummaryPopup } from './validation-summary-popup';

export const UnfinishedFooter = () => {
  const { validationSectionErrors } = useContext(ValidationErrorContext);
  const { data: oppgave } = useOppgave();

  const footerType =
    validationSectionErrors.length === 0 ? FooterType.UNFINISHED_NO_ERRORS : FooterType.UNFINISHED_WITH_ERRORS;

  if (typeof oppgave === 'undefined') {
    return null;
  }

  return (
    <StyledFooter $type={footerType}>
      <StyledButtons>
        <FinishButton />
        <VentButton />
        <BackLink />
        <Deassign type={oppgave.typeId} show={oppgave.feilregistrering === null} />
        <NewAnkebehandlingButton />
        <FeilregistrerButton />
      </StyledButtons>
      <ValidationSummaryPopup />
    </StyledFooter>
  );
};

const Deassign = ({ type, show }: { type?: SaksTypeEnum; show: boolean }) => {
  if (show && (type === SaksTypeEnum.ANKE || type === SaksTypeEnum.KLAGE)) {
    return <DeassignOppgave />;
  }

  return null;
};
