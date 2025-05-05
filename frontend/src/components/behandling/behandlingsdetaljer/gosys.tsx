import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useGetGosysOppgaveQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { GosysStatus, type IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Alert, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { GosysBeskrivelse } from '../../gosys/beskrivelse/beskrivelse';
import { BehandlingSection } from './behandling-section';
import { SelectGosysOppgaveModal } from './select-gosys-oppgave/select-gosys-oppgave';

interface Props {
  oppgavebehandling: IOppgavebehandling;
}

export const Gosys = ({ oppgavebehandling }: Props) => {
  const { data: oppgave } = useOppgave();
  const { data: gosysOppgave } = useGetGosysOppgaveQuery(
    oppgavebehandling.gosysOppgaveId === null ? skipToken : oppgavebehandling.id,
  );

  if (oppgave === undefined || !oppgave.requiresGosysOppgave) {
    return null;
  }

  const hasGosysOppgave = oppgavebehandling.gosysOppgaveId !== null;

  return (
    <BehandlingSection label="Oppgave fra Gosys">
      <VStack gap="2">
        <SelectGosysOppgaveModal hasGosysOppgave={hasGosysOppgave} />

        <Warning hasGosysOppgave={hasGosysOppgave} status={gosysOppgave?.status} />

        {hasGosysOppgave && gosysOppgave !== undefined && gosysOppgave.beskrivelse !== null ? (
          <GosysBeskrivelse oppgavebeskrivelse={gosysOppgave.beskrivelse} />
        ) : null}
      </VStack>
    </BehandlingSection>
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
