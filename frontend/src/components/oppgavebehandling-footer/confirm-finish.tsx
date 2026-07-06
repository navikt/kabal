import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyLong, Box, Button, Checkbox, HStack, InlineMessage, VStack } from '@navikt/ds-react';
import { useContext, useMemo, useState } from 'react';
import { useIsFakeArenaCase } from '@/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { ValidationErrorContext } from '@/components/kvalitetsvurdering/validation-error-context';
import { UpdateInGosys } from '@/components/oppgavebehandling-footer/update-in-gosys/update-in-gosys';
import { Direction, PopupContainer } from '@/components/popup-container/popup-container';
import { isReduxValidationResponse } from '@/functions/error-type-guard';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useFinishOppgavebehandlingMutation } from '@/redux-api/oppgaver/mutations/behandling';
import { SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';
import type { IFinishOppgavebehandlingParams } from '@/types/oppgavebehandling/params';

interface CancelButtonProps {
  cancel: () => void;
}

interface ButtonsProps extends CancelButtonProps {
  finishDisabled: boolean;
}

interface GosysAwareButtonsProps extends ButtonsProps {
  requiresGosysOppgave: boolean;
}

const Buttons = ({ cancel, finishDisabled }: ButtonsProps) => {
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    return null;
  }

  const { typeId, resultat, requiresGosysOppgave } = oppgave;
  const { utfallId } = resultat;

  switch (typeId) {
    case SaksTypeEnum.KLAGE:
    case SaksTypeEnum.ANKE:
    case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
      return (
        <StandardButtonGroup
          cancel={cancel}
          finishDisabled={finishDisabled}
          requiresGosysOppgave={requiresGosysOppgave}
        />
      );

    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
      switch (utfallId) {
        case UtfallEnum.TRUKKET:
        case UtfallEnum.HENLAGT:
          return <SimpleButtonGroup cancel={cancel} finishDisabled={finishDisabled} />;
        default:
          return (
            <StandardButtonGroup
              cancel={cancel}
              finishDisabled={finishDisabled}
              requiresGosysOppgave={requiresGosysOppgave}
            />
          );
      }

    case SaksTypeEnum.OMGJØRINGSKRAV:
      switch (utfallId) {
        case UtfallEnum.MEDHOLD_ETTER_FORVALTNINGSLOVEN_35:
          return (
            <StandardButtonGroup
              cancel={cancel}
              finishDisabled={finishDisabled}
              requiresGosysOppgave={requiresGosysOppgave}
            />
          );
        default:
          return <SimpleButtonGroup cancel={cancel} finishDisabled={finishDisabled} />;
      }

    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR:
      switch (utfallId) {
        case UtfallEnum.GJENOPPTATT_OPPHEVET:
          return (
            <NyBehandlingButtonGroup
              cancel={cancel}
              finishDisabled={finishDisabled}
              requiresGosysOppgave={requiresGosysOppgave}
            />
          );
        case UtfallEnum.HEVET:
        case UtfallEnum.IKKE_GJENOPPTATT:
        case UtfallEnum.AVVIST:
        case UtfallEnum.GJENOPPTATT_STADFESTET:
          return <SimpleButtonGroup cancel={cancel} finishDisabled={finishDisabled} />;
        default:
          return (
            <StandardButtonGroup
              cancel={cancel}
              finishDisabled={finishDisabled}
              requiresGosysOppgave={requiresGosysOppgave}
            />
          );
      }

    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      switch (utfallId) {
        case UtfallEnum.MEDHOLD:
        case UtfallEnum.DELVIS_MEDHOLD:
        case UtfallEnum.STADFESTELSE:
        case UtfallEnum.AVVIST:
        case UtfallEnum.HEVET:
          return (
            <StandardButtonGroup
              cancel={cancel}
              finishDisabled={finishDisabled}
              requiresGosysOppgave={requiresGosysOppgave}
            />
          );
        case UtfallEnum.OPPHEVET:
          return (
            <TrygderettenOpphevetButtonGroup
              cancel={cancel}
              finishDisabled={finishDisabled}
              requiresGosysOppgave={requiresGosysOppgave}
            />
          );
        case UtfallEnum.HENVIST:
          return <TrygderettenHenvistButtonGroup cancel={cancel} finishDisabled={finishDisabled} />;
      }
  }
};

interface GosysAwareFinishButtonProps {
  requiresGosysOppgave: boolean;
  disabled: boolean;
  children: string;
  // Text for the `UpdateInGosys` trigger button. Defaults to the standard "update and finish" wording, but some
  // button groups (e.g. a "no" option in a yes/no choice) keep the same text regardless of `requiresGosysOppgave`.
  gosysChildren?: string;
}

// Renders `UpdateInGosys` when the oppgave requires a Gosys oppgave to be updated, otherwise a plain `FinishButton`.
const GosysAwareFinishButton = ({
  requiresGosysOppgave,
  disabled,
  children,
  gosysChildren = 'Oppdater oppgaven i Gosys og fullfør',
}: GosysAwareFinishButtonProps) =>
  requiresGosysOppgave ? (
    <UpdateInGosys disabled={disabled}>{gosysChildren}</UpdateInGosys>
  ) : (
    <FinishButton disabled={disabled}>{children}</FinishButton>
  );

// The most common button group: a single, Gosys-aware "Fullfør" button and a cancel button.
const StandardButtonGroup = ({ cancel, finishDisabled, requiresGosysOppgave }: GosysAwareButtonsProps) => (
  <HStack align="center" gap="space-8" width="400px">
    <GosysAwareFinishButton requiresGosysOppgave={requiresGosysOppgave} disabled={finishDisabled}>
      Fullfør
    </GosysAwareFinishButton>
    <CancelButton cancel={cancel} />
  </HStack>
);

// A "Fullfør" button that is never Gosys-aware, used when the Gosys oppgave should be ignored regardless.
const SimpleButtonGroup = ({ cancel, finishDisabled }: ButtonsProps) => (
  <HStack align="center" gap="space-8" width="400px">
    <FinishButton disabled={finishDisabled}>Fullfør</FinishButton>
    <CancelButton cancel={cancel} />
  </HStack>
);

// Offers a choice between creating a new behandling in Kabal or finishing without one. Unlike `StandardButtonGroup`,
// the "no" option keeps the same text whether or not it opens the Gosys update dialog.
const NyBehandlingButtonGroup = ({ cancel, finishDisabled, requiresGosysOppgave }: GosysAwareButtonsProps) => (
  <HStack align="center" gap="space-8" width="650px">
    <FinishButton nyBehandling disabled={finishDisabled}>
      Ja, fullfør og opprett ny behandling i Kabal
    </FinishButton>

    <GosysAwareFinishButton
      requiresGosysOppgave={requiresGosysOppgave}
      disabled={finishDisabled}
      gosysChildren="Nei, fullfør uten å opprette ny behandling i Kabal"
    >
      Nei, fullfør uten å opprette ny behandling i Kabal
    </GosysAwareFinishButton>

    <CancelButton cancel={cancel} />
  </HStack>
);

const TrygderettenOpphevetButtonGroup = ({ cancel, finishDisabled, requiresGosysOppgave }: GosysAwareButtonsProps) => (
  <VStack gap="space-16" width="650px">
    <Box asChild background="accent-moderate" padding="space-16" borderColor="accent" borderRadius="8" borderWidth="1">
      <VStack gap="space-8">
        <FinishButton nyBehandling disabled={finishDisabled}>
          Ja, fullfør og opprett ny behandling i Kabal
        </FinishButton>
        <InlineMessage status="info" size="small">
          Husk at du må be merkantil om å opprette en endringsoppgave i Arena knyttet til ankesaken som Trygderetten har
          opphevet.
        </InlineMessage>
      </VStack>
    </Box>

    <GosysAwareFinishButton
      requiresGosysOppgave={requiresGosysOppgave}
      disabled={finishDisabled}
      gosysChildren="Nei, fullfør uten å opprette ny behandling i Kabal"
    >
      Nei, fullfør uten å opprette ny behandling i Kabal
    </GosysAwareFinishButton>

    <CancelButton cancel={cancel} />
  </VStack>
);

const TrygderettenHenvistButtonGroup = ({ cancel, finishDisabled }: ButtonsProps) => (
  <VStack gap="space-16">
    <InlineMessage status="info">
      Husk at du må be merkantil om å opprette en endringsoppgave i Arena knyttet til ankesaken som Trygderetten har
      henvist.
    </InlineMessage>
    <SimpleButtonGroup cancel={cancel} finishDisabled={finishDisabled} />
  </VStack>
);

const CancelButton = ({ cancel }: CancelButtonProps) => (
  <Button
    data-color="neutral"
    className="ml-auto shrink-0"
    variant="secondary"
    type="button"
    size="small"
    onClick={cancel}
    icon={<XMarkIcon aria-hidden />}
  >
    Avbryt
  </Button>
);

export const ConfirmFinish = ({ cancel }: CancelButtonProps) => {
  const text = useText();
  const { data: oppgave } = useOppgave();
  const [arenaConfirmed, setArenaConfirmed] = useState(false);
  const isFakeArenaCase = useIsFakeArenaCase();

  if (oppgave === undefined) {
    return null;
  }

  return (
    <PopupContainer close={cancel} direction={Direction.RIGHT}>
      <BodyLong>{text}</BodyLong>
      <ConfirmArenaCheckbox typeId={oppgave.typeId} confirmed={arenaConfirmed} setConfirmed={setArenaConfirmed} />
      <Buttons cancel={cancel} finishDisabled={isFakeArenaCase && !arenaConfirmed} />
    </PopupContainer>
  );
};

interface ConfirmArenaCheckboxProps {
  typeId: SaksTypeEnum;
  confirmed: boolean;
  setConfirmed: (confirmed: boolean) => void;
}

const ConfirmArenaCheckbox = ({ typeId, confirmed, setConfirmed }: ConfirmArenaCheckboxProps) => {
  const isFakeArenaCase = useIsFakeArenaCase();

  const text = useMemo(() => {
    switch (typeId) {
      case SaksTypeEnum.KLAGE:
      case SaksTypeEnum.ANKE:
      case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
        return 'Jeg bekrefter at saken er besluttet i Arena.';
      case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
        return 'Jeg bekrefter at jeg har registrert utfallet fra Trygderetten i Arena';
      default:
        return null;
    }
  }, [typeId]);

  if (!isFakeArenaCase || text === null) {
    return null;
  }

  return (
    <Checkbox onChange={(e) => setConfirmed(e.target.checked)} checked={confirmed}>
      {text}
    </Checkbox>
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
        return 'Bekreft at du har gjennomført overføring til Trygderetten før du fullfører behandlingen i Kabal. Ankebehandlingen kan ikke redigeres når den er fullført.';
      }

      if (utfallId === UtfallEnum.DELVIS_MEDHOLD) {
        return 'Bekreft at du har gjennomført overføring til Trygderetten for den delen av saken du ikke har omgjort, før du fullfører behandlingen i Kabal. Ankebehandlingen kan ikke redigeres når den er fullført.';
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
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK: {
      if (
        utfallId === UtfallEnum.INNSTILLING_GJENOPPTAS ||
        utfallId === UtfallEnum.INNSTILLING_IKKE_GJENOPPTAS ||
        utfallId === UtfallEnum.INNSTILLING_AVVIST
      ) {
        return 'Bekreft at du har gjennomført overføring til Trygderetten, før du fullfører behandlingen av begjæringen om gjenopptak i Kabal. Behandlingen kan ikke redigeres når den er fullført.';
      }

      return 'Du fullfører nå behandlingen av begjæringen om gjenopptak. Behandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
    }
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR:
      if (utfallId === UtfallEnum.GJENOPPTATT_OPPHEVET) {
        return 'Du har valgt «opphevet» som resultat fra Trygderetten. Du fullfører nå registrering av resultatet. Skal klageinstansen behandle saken på nytt?';
      }

      return 'Du fullfører nå registrering av utfall/resultat fra Trygderetten. Registreringen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre registreringen.';
  }
};

interface FinishButtonProps {
  nyBehandling?: boolean;
  children: string;
  disabled: boolean;
}

const FinishButton = ({ children, nyBehandling = false, disabled }: FinishButtonProps) => {
  const [finishOppgavebehandling, loader] = useFinishOppgavebehandlingMutation();
  const [hasBeenFinished, setHasBeenFinished] = useState<boolean>(false);
  const errorContext = useContext(ValidationErrorContext);
  const { data: oppgave, isLoading } = useOppgave();

  if (isLoading || oppgave === undefined) {
    return null;
  }

  const finish = async () => {
    const params: IFinishOppgavebehandlingParams =
      (oppgave.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN && oppgave.resultat.utfallId === UtfallEnum.OPPHEVET) ||
      (oppgave.typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR &&
        oppgave.resultat.utfallId === UtfallEnum.GJENOPPTATT_OPPHEVET)
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
      disabled={hasBeenFinished || loader.isLoading || disabled}
      icon={<CheckmarkIcon aria-hidden />}
      className="w-fit [grid-area:left]"
    >
      {children}
    </Button>
  );
};
