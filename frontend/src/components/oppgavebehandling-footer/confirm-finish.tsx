import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useContext, useEffect, useState } from 'react';
import { isReduxValidationResponse } from '@app/functions/error-type-guard';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useFinishOppgavebehandlingMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import { StyledFinishOppgaveBox, StyledFinishOppgaveButtons, StyledFinishOppgaveText } from './styled-components';

interface FinishProps {
  cancel: () => void;
}

export const ConfirmFinish = ({ cancel }: FinishProps) => {
  const { data: oppgave } = useOppgave();
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
    if (typeof oppgave === 'undefined') {
      return;
    }

    finishOppgavebehandling({
      oppgaveId: oppgave.id,
      kvalitetsvurderingId: oppgave.kvalitetsvurderingReference?.id ?? null,
    })
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
          icon={<CheckmarkIcon aria-hidden />}
        >
          Fullfør
        </Button>
        <Button
          variant="secondary"
          type="button"
          size="small"
          onClick={cancel}
          data-testid="cancel-finish-klagebehandling-button"
          icon={<XMarkIcon aria-hidden />}
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

  if (oppgave.type === SaksTypeEnum.KLAGE) {
    return (
      <StyledFinishOppgaveText>
        Du fullfører nå klagebehandlingen. Klagebehandlingen kan ikke redigeres når den er fullført. Bekreft at du
        faktisk ønsker å fullføre behandlingen.
      </StyledFinishOppgaveText>
    );
  }

  const { utfall } = oppgave.resultat;

  if (oppgave.type === SaksTypeEnum.ANKE) {
    if (utfall === UtfallEnum.INNSTILLING_STADFESTELSE || utfall === UtfallEnum.INNSTILLING_AVVIST) {
      return (
        <StyledFinishOppgaveText>
          Bekreft at du har gjennomført overføring til Trygderetten i Gosys, før du fullfører behandlingen i Kabal.
          Ankebehandlingen kan ikke redigeres når den er fullført.
        </StyledFinishOppgaveText>
      );
    }

    if (utfall === UtfallEnum.DELVIS_MEDHOLD) {
      return (
        <StyledFinishOppgaveText>
          Bekreft at du har gjennomført overføring til Trygderetten i Gosys for den delen av saken du ikke har omgjort,
          før du fullfører behandlingen i Kabal. Ankebehandlingen kan ikke redigeres når den er fullført.
        </StyledFinishOppgaveText>
      );
    }
  }

  return (
    <StyledFinishOppgaveText>
      Du fullfører nå ankebehandlingen. Ankebehandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk
      ønsker å fullføre behandlingen.
    </StyledFinishOppgaveText>
  );
};
