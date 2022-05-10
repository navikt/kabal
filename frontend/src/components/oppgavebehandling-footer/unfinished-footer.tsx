import { SuccessStroke } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useOppgaveId } from '../../hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useIsFullfoert } from '../../hooks/use-is-fullfoert';
import { useLazyValidateQuery } from '../../redux-api/oppgaver/queries/behandling';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import { BackLink } from './back-link';
import { ConfirmFinish } from './confirm-finish';
import { DeassignOppgave } from './deassign-oppgave';
import { StyledButtons, StyledUnfinishedErrorFooter, StyledUnfinishedNoErrorFooter } from './styled-components';
import { ValidationSummaryPopup } from './validation-summary-popup';
import { VentButton } from './vent-button';

export const UnfinishedFooter = () => {
  const canEdit = useCanEdit();
  const [validate, { data, isFetching }] = useLazyValidateQuery();
  const errorContext = useContext(ValidationErrorContext);
  const [showConfirmFinish, setConfirmFinish] = useState(false);
  const isFullfoert = useIsFullfoert();
  const oppgaveId = useOppgaveId();

  const hasErrors = useMemo<boolean>(() => {
    if (typeof data === 'undefined') {
      return false;
    }

    return data.sections.length !== 0;
  }, [data]);

  useEffect(() => {
    if (typeof errorContext !== 'undefined' && typeof data !== 'undefined') {
      errorContext.setValidationSectionErrors(data.sections);
    }
  }, [data, errorContext]);

  const showConfirmFinishDisplay = !isFullfoert && showConfirmFinish && !hasErrors && !isFetching;

  const Wrapper = hasErrors ? StyledUnfinishedErrorFooter : StyledUnfinishedNoErrorFooter;

  return (
    <Wrapper>
      <StyledButtons>
        <Button
          type="button"
          size="small"
          disabled={!canEdit || isFullfoert || showConfirmFinishDisplay}
          onClick={() => {
            if (typeof oppgaveId !== 'string') {
              return;
            }

            validate(oppgaveId);
            setConfirmFinish(true);
          }}
          data-testid="complete-button"
          loading={isFetching}
        >
          <SuccessStroke />
          <span>Fullfør</span>
        </Button>
        <ConfirmFinishDisplay show={showConfirmFinishDisplay} cancel={() => setConfirmFinish(false)} />
        <VentButton />
        <BackLink />
        <DeassignOppgave />
      </StyledButtons>
      <ValidationSummaryPopup sections={data?.sections ?? []} hasErrors={hasErrors} />
    </Wrapper>
  );
};

interface ConfirmFinishProps {
  show: boolean;
  cancel: () => void;
}

const ConfirmFinishDisplay = ({ show, cancel }: ConfirmFinishProps) => {
  if (show) {
    return <ConfirmFinish cancel={cancel} />;
  }

  return null;
};
