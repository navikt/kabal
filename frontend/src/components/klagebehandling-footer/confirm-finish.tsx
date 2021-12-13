import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import 'nav-frontend-knapper-style';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { isReduxValidationResponse } from '../../functions/error-type-guard';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { useKlagerName } from '../../hooks/use-klager-name';
import { useFinishKlagebehandlingMutation } from '../../redux-api/oppgave';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';

interface FinishProps {
  cancel: () => void;
}

export const ConfirmFinish = ({ cancel }: FinishProps) => {
  const klagebehandlingId = useKlagebehandlingId();
  const [finishKlagebehandling, loader] = useFinishKlagebehandlingMutation();
  const klagerName = useKlagerName();
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [hasBeenFinished, setHasBeenFinished] = useState<boolean>(false);
  const errorContext = useContext(ValidationErrorContext);

  useEffect(() => {
    if (ref !== null) {
      ref.scrollIntoView();
    }
  }, [ref]);

  const finish = async () => {
    finishKlagebehandling({ klagebehandlingId })
      .unwrap()
      .then((res) => {
        setHasBeenFinished(res.isAvsluttetAvSaksbehandler);
        errorContext?.setValidationSectionErrors([]);
      })
      .catch((error) => {
        if (typeof errorContext !== 'undefined' && isReduxValidationResponse(error)) {
          errorContext.setValidationSectionErrors(error.data.sections);
        }
      });
  };

  return (
    <StyledFinishKlagebehandlingBox ref={setRef}>
      <StyledFinishKlagebehandlingText>
        Du fullfører nå klagebehandlingen, brevet sendes til {klagerName ?? 'søker'} og klagebehandlingen kan ikke
        redigeres. Bekreft at du faktisk ønsker å fullføre behandlingen.
      </StyledFinishKlagebehandlingText>
      <StyledFinishKlagebehandlingButtons>
        <Hovedknapp
          mini
          onClick={finish}
          spinner={hasBeenFinished || loader.isLoading}
          disabled={hasBeenFinished || loader.isLoading}
          data-testid="confirm-finish-klagebehandling-button"
        >
          Fullfør
        </Hovedknapp>
        <Knapp mini onClick={cancel} data-testid="cancel-finish-klagebehandling-button">
          Avbryt
        </Knapp>
      </StyledFinishKlagebehandlingButtons>
    </StyledFinishKlagebehandlingBox>
  );
};

export const StyledFinishKlagebehandlingButtons = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledFinishKlagebehandlingText = styled.p`
  margin: 0 0 1em;
  white-space: normal;
`;

export const StyledFinishKlagebehandlingBox = styled.div`
  position: fixed;
  bottom: 1em;
  border: 1px solid #0067c5;
  padding: 1em;
  background-color: #fff;
  width: 400px;
`;