import { Close, SuccessStroke } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useContext, useEffect, useState } from 'react';
import { isReduxValidationResponse } from '../../functions/error-type-guard';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '../../hooks/oppgavebehandling/use-oppgave-id';
import { useFinishOppgavebehandlingMutation } from '../../redux-api/oppgaver/mutations/behandling';
import { OppgaveType, Utfall } from '../../types/kodeverk';
import { ValidationErrorContext } from '../kvalitetsvurdering/v1/validation-error-context';
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
    if (oppgaveId === skipToken) {
      return;
    }

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
        <Button
          variant="primary"
          size="small"
          type="button"
          onClick={finish}
          loading={hasBeenFinished || loader.isLoading}
          disabled={hasBeenFinished || loader.isLoading}
          data-testid="confirm-finish-klagebehandling-button"
          icon={<SuccessStroke aria-hidden />}
        >
          Fullfør
        </Button>
        <Button
          variant="secondary"
          type="button"
          size="small"
          onClick={cancel}
          data-testid="cancel-finish-klagebehandling-button"
          icon={<Close aria-hidden />}
        >
          Avbryt
        </Button>
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

  if (oppgave.type === OppgaveType.ANKE && utfall !== Utfall.RETUR) {
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
