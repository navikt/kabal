import { Hovedknapp } from 'nav-frontend-knapper';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useIsFullfoert } from '../../hooks/use-is-fullfoert';
import { useOppgaveId } from '../../hooks/use-oppgave-id';
import { useOppgaveType } from '../../hooks/use-oppgave-type';
import { useLazyValidateQuery } from '../../redux-api/oppgavebehandling';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import { ConfirmFinish } from './confirm-finish';
import {
  StyledButtons,
  StyledFinishedFooter,
  StyledUnfinishedErrorFooter,
  StyledUnfinishedFooter,
} from './styled-components';
import { ValidationSummaryPopup } from './validation-summary-popup';

export const OppgavebehandlingFooter = () => {
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
          Fullfør
        </Hovedknapp>
        <ConfirmFinishDisplay show={showConfirmFinishDisplay} cancel={() => setConfirmFinish(false)} />
        <NavLink to="/mineoppgaver" className="knapp knapp--mini footer-button">
          Tilbake
        </NavLink>
      </StyledButtons>

      <ValidationSummaryPopup sections={data?.sections ?? []} hasErrors={hasErrors} />
    </>
  );

  if (isFullfoert) {
    return <StyledFinishedFooter>{children}</StyledFinishedFooter>;
  }

  if (hasErrors) {
    return <StyledUnfinishedErrorFooter>{children}</StyledUnfinishedErrorFooter>;
  }

  return <StyledUnfinishedFooter>{children}</StyledUnfinishedFooter>;
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
