import { Hovedknapp } from 'nav-frontend-knapper';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useIsFullfoert } from '../../hooks/use-is-fullfoert';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { useLazyValidateQuery } from '../../redux-api/oppgave';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import { ConfirmFinish } from './confirm-finish';
import { ValidationSummaryPopup } from './validation-summary-popup';

export const KlagebehandlingFooter = () => {
  const canEdit = useCanEdit();
  const klagebehandlingId = useKlagebehandlingId();
  const [validate, { data, isFetching }] = useLazyValidateQuery();
  const errorContext = useContext(ValidationErrorContext);
  const [showConfirmFinish, setConfirmFinish] = useState(false);
  const isFullfoert = useIsFullfoert(klagebehandlingId);

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
            validate(klagebehandlingId);
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

const StyledButtons = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;

  .footer-button {
    width: 200px;
    margin-right: 1em;
  }
`;

const StyledFooter = styled.div`
  display: flex;
  position: sticky;
  bottom: 0em;
  left: 0;
  width: 100%;
  padding-left: 1em;
  padding-right: 1em;
  padding-bottom: 0.5em;
  padding-top: 0.5em;
  justify-content: space-between;
  align-items: center;
  align-content: center;
`;

const StyledFinishedFooter = styled(StyledFooter)`
  border-top: 1px solid #06893a;
  background-color: #cde7d8;
`;

const StyledUnfinishedFooter = styled(StyledFooter)`
  border-top: 1px solid #368da8;
  background-color: #e0f5fb;
`;

const StyledUnfinishedErrorFooter = styled(StyledFooter)`
  border-top: 1px solid #d47b00;
  background-color: #ffe9cc;
`;
