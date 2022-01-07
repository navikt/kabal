import { Hovedknapp } from 'nav-frontend-knapper';
import 'nav-frontend-knapper-style';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useIsFullfoert } from '../../hooks/use-is-fullfoert';
import { useOppgaveId } from '../../hooks/use-oppgave-id';
import { useOppgaveType } from '../../hooks/use-oppgave-type';
import { useLazyValidateQuery } from '../../redux-api/oppgavebehandling';
import { OppgaveType } from '../../types/kodeverk';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import { BackLink } from './back-link';
import { ConfirmFinish } from './confirm-finish';
import { StyledButtons, StyledUnfinishedErrorFooter, StyledUnfinishedNoErrorFooter } from './styled-components';
import { ValidationSummaryPopup } from './validation-summary-popup';

export const UnfinishedFooter = () => {
  const canEdit = useCanEdit();
  const oppgaveId = useOppgaveId();
  const [validate, { data, isFetching }] = useLazyValidateQuery();
  const errorContext = useContext(ValidationErrorContext);
  const [showConfirmFinish, setConfirmFinish] = useState(false);
  const isFullfoert = useIsFullfoert();
  const type = useOppgaveType();

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

  const finishText = type === OppgaveType.KLAGEBEHANDLING ? 'Fullfør' : 'Send innstilling til bruker';

  const children = (
    <>
      <StyledButtons>
        <Hovedknapp
          mini
          disabled={!canEdit || isFullfoert || showConfirmFinishDisplay}
          onClick={() => {
            validate({ oppgaveId, type });
            setConfirmFinish(true);
          }}
          spinner={isFetching}
          autoDisableVedSpinner
          data-testid="complete-button"
          className="footer-button"
        >
          {finishText}
        </Hovedknapp>
        <ConfirmFinishDisplay show={showConfirmFinishDisplay} cancel={() => setConfirmFinish(false)} />
        <BackLink />
      </StyledButtons>
      <ValidationSummaryPopup sections={data?.sections ?? []} hasErrors={hasErrors} />
    </>
  );

  if (hasErrors) {
    return <StyledUnfinishedErrorFooter>{children}</StyledUnfinishedErrorFooter>;
  }

  return <StyledUnfinishedNoErrorFooter>{children}</StyledUnfinishedNoErrorFooter>;
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
