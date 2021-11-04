import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import 'nav-frontend-knapper-style';
import React, { useEffect, useState } from 'react';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
import { useKlagerName } from '../../../../hooks/use-klager-name';
import { ApiError, UNKNOWN_ERROR, isWrappedApiError } from '../../../../redux-api/error-type';
import { useFinishKlagebehandlingMutation } from '../../../../redux-api/oppgave';
import {
  StyledFinishKlagebehandlingBox,
  StyledFinishKlagebehandlingButtons,
  StyledFinishKlagebehandlingText,
} from '../../styled-components';

interface FinishProps {
  cancel: () => void;
  setError: (error: ApiError) => void;
}

export const ConfirmFinish = ({ cancel, setError }: FinishProps) => {
  const klagebehandlingId = useKlagebehandlingId();
  const [finishKlagebehandling, loader] = useFinishKlagebehandlingMutation();
  const klagerName = useKlagerName();
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [hasBeenFinished, setHasBeenFinished] = useState<boolean>(false);

  useEffect(() => {
    if (ref !== null) {
      ref.scrollIntoView();
    }
  }, [ref]);

  const finish = () => {
    finishKlagebehandling({ klagebehandlingId })
      .unwrap()
      .then((res) => {
        setHasBeenFinished(res.isAvsluttetAvSaksbehandler);
      })
      .catch((e) => {
        if (isWrappedApiError(e)) {
          setError(e.data);
        } else {
          setError(UNKNOWN_ERROR);
        }

        setHasBeenFinished(false);
        cancel();
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
