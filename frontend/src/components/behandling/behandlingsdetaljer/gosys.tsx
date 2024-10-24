import { useIsModernized } from '@app/hooks/use-is-modernized';
import { useGetGosysOppgaveQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { GosysStatus, type IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Alert, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { BehandlingSection } from './behandling-section';
import { GosysBeskrivelse } from './gosys/beskrivelse';
import { SelectGosysOppgaveModal } from './select-gosys-oppgave/select-gosys-oppgave';

interface Props {
  oppgavebehandling: IOppgavebehandling;
}

export const Gosys = ({ oppgavebehandling }: Props) => {
  const isModernized = useIsModernized();
  const { data: gosysOppgave } = useGetGosysOppgaveQuery(
    oppgavebehandling.gosysOppgaveId === null ? skipToken : oppgavebehandling.id,
  );

  const hasGosysOppgave = oppgavebehandling.gosysOppgaveId !== null;

  return (
    <>
      {!isModernized ? (
        <BehandlingSection label="Oppgave fra Gosys">
          <VStack gap="2">
            <SelectGosysOppgaveModal hasGosysOppgave={hasGosysOppgave} />

            <Warning hasGosysOppgave={hasGosysOppgave} status={gosysOppgave?.status} />

            {hasGosysOppgave && gosysOppgave !== undefined && gosysOppgave.beskrivelse !== null ? (
              <GosysBeskrivelse oppgavebeskrivelse={gosysOppgave.beskrivelse} />
            ) : null}
          </VStack>
        </BehandlingSection>
      ) : null}
    </>
  );
};

interface WarningProps {
  hasGosysOppgave: boolean;
  status?: GosysStatus;
}

const Warning = ({ hasGosysOppgave, status }: WarningProps) => {
  if (!hasGosysOppgave) {
    return (
      <Alert variant="warning" size="small">
        Ingen oppgave fra Gosys er valgt.
      </Alert>
    );
  }

  if (status === GosysStatus.FERDIGSTILT) {
    return (
      <Alert variant="warning" size="small">
        Oppgaven fra Gosys er ferdigstilt.
      </Alert>
    );
  }

  if (status === GosysStatus.FEILREGISTRERT) {
    return (
      <Alert variant="warning" size="small">
        Oppgaven fra Gosys er feilregistrert.
      </Alert>
    );
  }

  return null;
};
