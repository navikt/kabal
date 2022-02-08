import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import React, { useContext, useEffect, useState } from 'react';
import { isReduxValidationResponse } from '../../functions/error-type-guard';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '../../hooks/oppgavebehandling/use-oppgave-id';
import { useFinishOppgavebehandlingMutation } from '../../redux-api/oppgavebehandling';
import { OppgaveType, Utfall } from '../../types/kodeverk';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import { StyledFinishOppgaveBox, StyledFinishOppgaveButtons, StyledFinishOppgaveText } from './styled-components';

interface FinishProps {
  cancel: () => void;
}

export const ConfirmFinish = ({ cancel }: FinishProps) => {
  const oppgaveId = useOppgaveId();
  const [finishOppgavebehandling, loader] = useFinishOppgavebehandlingMutation();
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [hasBeenFinished, setHasBeenFinished] = useState<boolean>(false);
  const errorContext = useContext(ValidationErrorContext);

  useEffect(() => {
    if (ref !== null) {
      ref.scrollIntoView();
    }
  }, [ref]);

  const finish = async () => {
    finishOppgavebehandling(oppgaveId)
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
    <StyledFinishOppgaveBox ref={setRef}>
      <OppgavebehandlingText />
      <StyledFinishOppgaveButtons>
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
      </StyledFinishOppgaveButtons>
    </StyledFinishOppgaveBox>
  );
};

const OppgavebehandlingText = () => {
  const { data: oppgave, isLoading } = useOppgave();

  if (isLoading || typeof oppgave === 'undefined') {
    return null;
  }

  if (oppgave.type === OppgaveType.KLAGE) {
    return (
      <StyledFinishOppgaveText>
        Du fullfører nå klagebehandlingen. Klagebehandlingen kan ikke redigeres når den er fullført. Bekreft at du
        faktisk ønsker å fullføre behandlingen.
      </StyledFinishOppgaveText>
    );
  }

  const { utfall } = oppgave.resultat;

  if (utfall === Utfall.STADFESTELSE || utfall === Utfall.AVVIST || utfall === Utfall.DELVIS_MEDHOLD) {
    return (
      <StyledFinishOppgaveText>
        Bekreft at du har gjennomført overføring til Trygderetten i Gosys, før du fullfører behandlingen i Kabal.
        Ankebehandlingen kan ikke redigeres når den er fullført.
      </StyledFinishOppgaveText>
    );
  }

  return (
    <StyledFinishOppgaveText>
      Du fullfører nå ankebehandlingen. Ankebehandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk
      ønsker å fullføre behandlingen.
    </StyledFinishOppgaveText>
  );
};
