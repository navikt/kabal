import { Hovedknapp } from 'nav-frontend-knapper';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useIsFullfoert } from '../../hooks/use-is-fullfoert';
import { useOppgaveId } from '../../hooks/use-oppgave-id';
import { useLazyValidateQuery } from '../../redux-api/oppgavebehandling';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import { BackLink } from './back-link';
import { ConfirmFinish } from './confirm-finish';
import { StyledButtons, StyledUnfinishedErrorFooter, StyledUnfinishedNoErrorFooter } from './styled-components';
import { ValidationSummaryPopup } from './validation-summary-popup';

export const UnfinishedKlageFooter = () => {
  const canEdit = useCanEdit();
  const oppgaveId = useOppgaveId();
  const [validate, { data, isFetching }] = useLazyValidateQuery();
  const errorContext = useContext(ValidationErrorContext);
  const [showConfirmFinish, setConfirmFinish] = useState(false);
  const isFullfoert = useIsFullfoert();
  const { data: oppgave } = useOppgave();

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

  if (typeof oppgave === 'undefined') {
    return null;
  }

  const Wrapper = hasErrors ? StyledUnfinishedErrorFooter : StyledUnfinishedNoErrorFooter;

  return (
    <Wrapper>
      <StyledButtons>
        <Hovedknapp
          mini
          disabled={!canEdit || isFullfoert || showConfirmFinishDisplay}
          onClick={() => {
            validate(oppgaveId);
            setConfirmFinish(true);
          }}
          spinner={isFetching}
          autoDisableVedSpinner
          data-testid="complete-button"
        >
          Fullfør
        </Hovedknapp>
        <ConfirmFinishDisplay show={showConfirmFinishDisplay} cancel={() => setConfirmFinish(false)} />
        <BackLink />
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
