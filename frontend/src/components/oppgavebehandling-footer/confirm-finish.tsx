import { UpdateInGosys } from '@app/components/oppgavebehandling-footer/update-in-gosys/update-in-gosys';
import { Direction, PopupContainer } from '@app/components/popup-container/popup-container';
import { isReduxValidationResponse } from '@app/functions/error-type-guard';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useFinishOppgavebehandlingMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import type { IFinishOppgavebehandlingParams } from '@app/types/oppgavebehandling/params';
import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, HStack } from '@navikt/ds-react';
import { useContext, useState } from 'react';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';

interface CancelButtonProps {
  cancel: () => void;
}

interface FinishProps extends CancelButtonProps {
  show: boolean;
}

const getFinishText = (requiresGosysOppgave: boolean) =>
  requiresGosysOppgave
    ? 'Nei, fullfør uten å opprette ny behandling i Kabal. Husk å sende oppgave i Gosys.'
    : 'Nei, fullfør uten å opprette ny behandling i Kabal.';

const Buttons = ({ cancel }: CancelButtonProps) => {
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    return null;
  }

  const { typeId, resultat } = oppgave;
  const { utfallId } = resultat;

  switch (typeId) {
    case SaksTypeEnum.KLAGE:
    case SaksTypeEnum.ANKE:
    case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
      return (
        <HStack align="center" gap="2" width="400px">
          {oppgave.requiresGosysOppgave ? (
            <UpdateInGosys>Oppdater oppgaven i Gosys og fullfør</UpdateInGosys>
          ) : (
            <FinishButton>Fullfør</FinishButton>
          )}
          <CancelButton cancel={cancel} />
        </HStack>
      );
    case SaksTypeEnum.OMGJØRINGSKRAV: {
      switch (utfallId) {
        case UtfallEnum.MEDHOLD_ETTER_FORVALTNINGSLOVEN_35:
          return (
            <HStack align="center" gap="2" width="400px">
              {oppgave.requiresGosysOppgave ? (
                <UpdateInGosys>Oppdater oppgaven i Gosys og fullfør</UpdateInGosys>
              ) : (
                <FinishButton>Fullfør</FinishButton>
              )}
              <CancelButton cancel={cancel} />
            </HStack>
          );

        default:
          return (
            <HStack align="center" gap="2" width="400px">
              <FinishButton>Fullfør</FinishButton>
              <CancelButton cancel={cancel} />
            </HStack>
          );
      }
    }
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN: {
      switch (utfallId) {
        case UtfallEnum.MEDHOLD:
        case UtfallEnum.DELVIS_MEDHOLD:
        case UtfallEnum.STADFESTELSE:
        case UtfallEnum.AVVIST:
        case UtfallEnum.HEVET:
          return (
            <HStack align="center" gap="2" width="400px">
              {oppgave.requiresGosysOppgave ? (
                <UpdateInGosys>Oppdater oppgaven i Gosys og fullfør</UpdateInGosys>
              ) : (
                <FinishButton>Fullfør</FinishButton>
              )}
              <CancelButton cancel={cancel} />
            </HStack>
          );
        case UtfallEnum.OPPHEVET:
          return (
            <HStack align="center" gap="2" width="650px">
              <FinishButton nyBehandling>Ja, fullfør og opprett ny behandling i Kabal</FinishButton>
              <UpdateInGosys>{getFinishText(oppgave.requiresGosysOppgave)}</UpdateInGosys>
              <CancelButton cancel={cancel} />
            </HStack>
          );
        case UtfallEnum.HENVIST:
          return (
            <HStack align="center" gap="2" width="400px">
              <FinishButton>Fullfør</FinishButton>
              <CancelButton cancel={cancel} />
            </HStack>
          );
      }
    }
  }
};

const CancelButton = ({ cancel }: CancelButtonProps) => (
  <Button
    className="ml-auto shrink-0"
    variant="secondary-neutral"
    type="button"
    size="small"
    onClick={cancel}
    data-testid="cancel-finish-klagebehandling-button"
    icon={<XMarkIcon aria-hidden />}
  >
    Avbryt
  </Button>
);

export const ConfirmFinish = ({ cancel, show }: FinishProps) => {
  const text = useText();

  if (!show) {
    return null;
  }

  return (
    <PopupContainer close={cancel} direction={Direction.RIGHT}>
      <BodyLong>{text}</BodyLong>
      <Buttons cancel={cancel} />
    </PopupContainer>
  );
};

const useText = (): string => {
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    return '';
  }

  const { typeId, resultat } = oppgave;
  const { utfallId } = resultat;

  switch (typeId) {
    case SaksTypeEnum.KLAGE:
      return 'Du fullfører nå klagebehandlingen. Klagebehandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
    case SaksTypeEnum.ANKE: {
      if (utfallId === UtfallEnum.MEDHOLD || utfallId === UtfallEnum.OPPHEVET) {
        return 'Du fullfører nå ankebehandlingen. Ankebehandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
      }

      if (utfallId === UtfallEnum.INNSTILLING_STADFESTELSE || utfallId === UtfallEnum.INNSTILLING_AVVIST) {
        return 'Bekreft at du har gjennomført overføring til Trygderetten i Gosys, før du fullfører behandlingen i Kabal. Ankebehandlingen kan ikke redigeres når den er fullført.';
      }

      if (utfallId === UtfallEnum.DELVIS_MEDHOLD) {
        return 'Bekreft at du har gjennomført overføring til Trygderetten i Gosys for den delen av saken du ikke har omgjort, før du fullfører behandlingen i Kabal. Ankebehandlingen kan ikke redigeres når den er fullført.';
      }

      return 'Du fullfører nå ankebehandlingen. Ankebehandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
    }
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN: {
      if (utfallId === UtfallEnum.HENVIST) {
        return 'Du har valgt «henvist» som resultat fra Trygderetten. Du fullfører nå registrering av resultatet. Når du trykker «Fullfør», vil Kabal opprette en ny ankeoppgave som du skal behandle. Vær oppmerksom på at det kan ta noen minutter før ankebehandlingen er opprettet.';
      }

      if (utfallId === UtfallEnum.OPPHEVET) {
        return 'Du har valgt «opphevet» som resultat fra Trygderetten. Du fullfører nå registrering av resultatet. Skal klageinstansen behandle saken på nytt?';
      }

      return 'Du fullfører nå registrering av utfall/resultat fra Trygderetten. Registreringen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre registreringen.';
    }
    case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
      return 'Du fullfører nå behandlingen. Behandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
    case SaksTypeEnum.OMGJØRINGSKRAV:
      return 'Du fullfører nå behandlingen av omgjøringskravet. Behandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
  }
};

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
    const params: IFinishOppgavebehandlingParams =
      oppgave.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN && oppgave.resultat.utfallId === UtfallEnum.OPPHEVET
        ? {
            oppgaveId: oppgave.id,
            typeId: oppgave.typeId,
            kvalitetsvurderingId: oppgave.kvalitetsvurderingReference?.id ?? null,
            nyBehandling,
          }
        : {
            oppgaveId: oppgave.id,
            kvalitetsvurderingId: oppgave.kvalitetsvurderingReference?.id ?? null,
            nyBehandling: false,
          };

    try {
      const { isAvsluttetAvSaksbehandler } = await finishOppgavebehandling(params).unwrap();
      setHasBeenFinished(isAvsluttetAvSaksbehandler);
      errorContext?.setValidationSectionErrors([]);
    } catch (error) {
      if (isReduxValidationResponse(error)) {
        errorContext.setValidationSectionErrors(error.data.sections);
      }
    }
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
      className="[grid-area:left]"
    >
      {children}
    </Button>
  );
};
