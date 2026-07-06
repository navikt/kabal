import { Box, HStack, InlineMessage, VStack } from '@navikt/ds-react';
import { CancelButton } from '@/components/oppgavebehandling-footer/confirm-finish/cancel-button';
import { FinishButton } from '@/components/oppgavebehandling-footer/confirm-finish/finish-button';
import type { ButtonsProps, GosysAwareButtonsProps } from '@/components/oppgavebehandling-footer/confirm-finish/types';
import { UpdateInGosys } from '@/components/oppgavebehandling-footer/update-in-gosys/update-in-gosys';

interface GosysAwareFinishButtonProps {
  requiresGosysOppgave: boolean;
  disabled: boolean;
  children: string;
  /**
   * Text for the `UpdateInGosys` trigger button. Defaults to the standard "update and finish" wording, but some
   * button groups (e.g. a "no" option in a yes/no choice) keep the same text regardless of `requiresGosysOppgave`.
   */
  gosysChildren?: string;
}

/** Renders `UpdateInGosys` when the oppgave requires a Gosys oppgave to be updated, otherwise a plain `FinishButton`. */
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

/** The most common button group: a single, Gosys-aware "Fullfør" button and a cancel button. */
export const StandardButtonGroup = ({ cancel, finishDisabled, requiresGosysOppgave }: GosysAwareButtonsProps) => (
  <HStack align="center" gap="space-8" width="400px">
    <GosysAwareFinishButton requiresGosysOppgave={requiresGosysOppgave} disabled={finishDisabled}>
      Fullfør
    </GosysAwareFinishButton>
    <CancelButton cancel={cancel} />
  </HStack>
);

/** A "Fullfør" button that is never Gosys-aware, used when the Gosys oppgave should be ignored regardless. */
export const SimpleButtonGroup = ({ cancel, finishDisabled }: ButtonsProps) => (
  <HStack align="center" gap="space-8" width="400px">
    <FinishButton disabled={finishDisabled}>Fullfør</FinishButton>
    <CancelButton cancel={cancel} />
  </HStack>
);

/**
 * Offers a choice between creating a new behandling in Kabal or finishing without one. Unlike `StandardButtonGroup`,
 * the "no" option keeps the same text whether or not it opens the Gosys update dialog.
 */
export const NyBehandlingButtonGroup = ({ cancel, finishDisabled, requiresGosysOppgave }: GosysAwareButtonsProps) => (
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

/**
 * Used for `ANKE_I_TRYGDERETTEN` with utfall `OPPHEVET`. Highlights the "yes" option to create a new behandling in
 * an info box with a reminder to create an Arena endringsoppgave, alongside a Gosys-aware "no" option and cancel.
 */
export const TrygderettenOpphevetButtonGroup = ({
  cancel,
  finishDisabled,
  requiresGosysOppgave,
}: GosysAwareButtonsProps) => (
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

/**
 * Used for `ANKE_I_TRYGDERETTEN` with utfall `HENVIST`. Shows a reminder to create an Arena endringsoppgave above a
 * simple "Fullfør" and cancel button pair.
 */
export const TrygderettenHenvistButtonGroup = ({ cancel, finishDisabled }: ButtonsProps) => (
  <VStack gap="space-16">
    <InlineMessage status="info">
      Husk at du må be merkantil om å opprette en endringsoppgave i Arena knyttet til ankesaken som Trygderetten har
      henvist.
    </InlineMessage>
    <SimpleButtonGroup cancel={cancel} finishDisabled={finishDisabled} />
  </VStack>
);
