import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyLong, Button } from '@navikt/ds-react';
import React, { useContext, useMemo, useState } from 'react';
import { Direction, PopupContainer } from '@app/components/popup-container/popup-container';
import { isReduxValidationResponse } from '@app/functions/error-type-guard';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useFinishOppgavebehandlingMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { useFagsystemer } from '@app/simple-api-state/use-kodeverk';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import { IFinishOppgavebehandlingParams } from '@app/types/oppgavebehandling/params';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import { StyledFinishOppgaveButtons } from './styled-components';

interface FinishProps {
  cancel: () => void;
  show: boolean;
}

const getFinishText = (isOpphevetAnkeInTrygderettern: boolean, isModernized: boolean) => {
  if (isOpphevetAnkeInTrygderettern) {
    return isModernized
      ? 'Nei, fullfør uten å opprette ny oppgave i Kabal.'
      : 'Nei, fullfør uten å opprette ny oppgave i Kabal. Husk å sende oppgave i Gosys.';
  }

  return 'Fullfør';
};

export const ConfirmFinish = ({ cancel, show }: FinishProps) => {
  const { data: oppgave } = useOppgave();
  const text = useText();
  const isModernized = useIsModernized();

  if (!show || oppgave === undefined) {
    return null;
  }

  const isOpphevetInTrygderetten =
    oppgave.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN && oppgave.resultat.utfallId === UtfallEnum.OPPHEVET;

  const finishText = getFinishText(isOpphevetInTrygderetten, isModernized);

  return (
    <PopupContainer close={cancel} direction={Direction.RIGHT}>
      <BodyLong>{text}</BodyLong>
      <StyledFinishOppgaveButtons $width={isOpphevetInTrygderetten ? 650 : 400}>
        {isOpphevetInTrygderetten ? <FinishOpphevetTRWithNyBehandling /> : null}
        <FinishButton>{finishText}</FinishButton>
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
    </PopupContainer>
  );
};

const useIsModernized = (): boolean => {
  const { data: oppgave } = useOppgave();
  const { data: fagsystemer } = useFagsystemer();

  return useMemo(() => {
    if (oppgave === undefined || fagsystemer === undefined) {
      return false;
    }

    const fagsystem = fagsystemer.find(({ id }) => id === oppgave.fagsystemId);

    return fagsystem?.modernized === true;
  }, [oppgave, fagsystemer]);
};

const useText = (): string => {
  const { data: oppgave } = useOppgave();
  const isModernized = useIsModernized();

  if (oppgave === undefined) {
    return '';
  }

  const { typeId, resultat } = oppgave;
  const { utfallId } = resultat;

  if (typeId === SaksTypeEnum.KLAGE) {
    return isModernized
      ? 'Du fullfører nå klagebehandlingen. Klagebehandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.'
      : 'Du fullfører nå klagebehandlingen. Klagebehandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen. Husk at du også må oppdatere oppgaven i Gosys med beskjed til vedtaksenheten om utfall i saken.';
  }

  if (typeId === SaksTypeEnum.ANKE) {
    if (!isModernized && (utfallId === UtfallEnum.MEDHOLD || utfallId === UtfallEnum.OPPHEVET)) {
      return 'Du fullfører nå ankebehandlingen. Ankebehandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen. Husk at du må sende en oppgave i Gosys med beskjed til vedtaksenheten om utfall i saken.';
    }

    if (utfallId === UtfallEnum.INNSTILLING_STADFESTELSE || utfallId === UtfallEnum.INNSTILLING_AVVIST) {
      return 'Bekreft at du har gjennomført overføring til Trygderetten i Gosys, før du fullfører behandlingen i Kabal. Ankebehandlingen kan ikke redigeres når den er fullført.';
    }

    if (utfallId === UtfallEnum.DELVIS_MEDHOLD) {
      return isModernized
        ? 'Bekreft at du har gjennomført overføring til Trygderetten i Gosys for den delen av saken du ikke har omgjort, før du fullfører behandlingen i Kabal. Ankebehandlingen kan ikke redigeres når den er fullført.'
        : 'Bekreft at du har gjennomført overføring til Trygderetten i Gosys for den delen av saken du ikke har omgjort, før du fullfører behandlingen i Kabal. Ankebehandlingen kan ikke redigeres når den er fullført. Husk at du må sende en oppgave i Gosys med beskjed til vedtaksenheten om utfall i saken.';
    }

    return 'Du fullfører nå ankebehandlingen. Ankebehandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
  }

  if (typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
    if (utfallId === UtfallEnum.HENVIST) {
      return 'Du har valgt «henvist» som resultat fra Trygderetten. Du fullfører nå registrering av resultatet. Når du trykker «Fullfør», vil Kabal opprette en ny ankeoppgave som du skal behandle. Du finner oppgaven under «Søk på person». Vær oppmerksom på at det kan ta noen minutter før ankebehandlingen er opprettet.';
    }

    if (utfallId === UtfallEnum.OPPHEVET) {
      return 'Du har valgt «opphevet» som resultat fra Trygderetten. Du fullfører nå registrering av resultatet. Skal klageinstansen behandle saken på nytt?';
    }

    return isModernized
      ? 'Du fullfører nå registrering av utfall/resultat fra Trygderetten. Registreringen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre registreringen.'
      : 'Du fullfører nå registrering av utfall/resultat fra Trygderetten. Registreringen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre registreringen. Husk at du må sende en oppgave i Gosys med beskjed om utfallet av behandlingen hos Trygderetten.';
  }

  return 'Du fullfører nå behandlingen. Behandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
};

const FinishOpphevetTRWithNyBehandling = () => (
  <FinishButton nyBehandling>Ja, fullfør og opprett ny ankeoppgave i Kabal.</FinishButton>
);

interface FinishButtonProps {
  nyBehandling?: boolean;
  children: string;
}

const FinishButton = ({ children, nyBehandling = false }: FinishButtonProps) => {
  const [finishOppgavebehandling, loader] = useFinishOppgavebehandlingMutation();
  const [hasBeenFinished, setHasBeenFinished] = useState<boolean>(false);
  const errorContext = useContext(ValidationErrorContext);
  const { data: oppgave, isLoading } = useOppgave();

  if (isLoading || oppgave === undefined) {
    return null;
  }

  const finish = async () => {
    if (typeof oppgave === 'undefined') {
      return;
    }

    const params: IFinishOppgavebehandlingParams =
      oppgave.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN && oppgave.resultat.utfallId === UtfallEnum.OPPHEVET
        ? {
            oppgaveId: oppgave.id,
            typeId: oppgave.typeId,
            utfall: oppgave.resultat.utfallId,
            kvalitetsvurderingId: oppgave.kvalitetsvurderingReference?.id ?? null,
            nyBehandling,
          }
        : {
            oppgaveId: oppgave.id,
            kvalitetsvurderingId: oppgave.kvalitetsvurderingReference?.id ?? null,
            nyBehandling: false,
          };

    finishOppgavebehandling(params)
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
      {children}
    </Button>
  );
};
