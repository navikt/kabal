import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import 'nav-frontend-knapper-style';
import React, { useContext, useEffect, useState } from 'react';
import { isReduxValidationResponse } from '../../functions/error-type-guard';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { useKlagerName } from '../../hooks/use-klager-name';
import { useOppgaveId } from '../../hooks/use-oppgave-id';
import { useFinishOppgavebehandlingMutation } from '../../redux-api/oppgavebehandling';
import { OppgaveType } from '../../types/kodeverk';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import {
  StyledFinishKlagebehandlingBox,
  StyledFinishKlagebehandlingButtons,
  StyledFinishKlagebehandlingText,
} from './styled-components';

interface FinishProps {
  cancel: () => void;
}

export const ConfirmFinish = ({ cancel }: FinishProps) => {
  const oppgaveId = useOppgaveId();
  const [finishOppgavebehandling, loader] = useFinishOppgavebehandlingMutation();
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
    <StyledFinishKlagebehandlingBox ref={setRef}>
      <OppgavebehandlingText klagerName={klagerName} />
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

interface OppgavebehandlingTextProps {
  klagerName: string | null;
}

const OppgavebehandlingText = ({ klagerName }: OppgavebehandlingTextProps) => {
  const { data: oppgave } = useOppgave();

  if (typeof oppgave === 'undefined') {
    return null;
  }

  if (oppgave.type === OppgaveType.KLAGEBEHANDLING) {
    return (
      <StyledFinishKlagebehandlingText>
        Du fullfører nå klagebehandlingen, brevet sendes til {klagerName ?? 'søker'} og klagebehandlingen kan ikke
        redigeres. Bekreft at du faktisk ønsker å fullføre behandlingen.
      </StyledFinishKlagebehandlingText>
    );
  }

  return (
    <StyledFinishKlagebehandlingText>
      Du fullfører nå ankebehandlingen, brevet sendes til {klagerName ?? 'søker'} og ankebehandlingen kan ikke
      redigeres. Bekreft at du faktisk ønsker å fullføre behandlingen.
    </StyledFinishKlagebehandlingText>
  );
};
