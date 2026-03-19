import { VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { Alert } from '@/components/alert/alert';
import { BehandlingSection } from '@/components/behandling/behandlingsdetaljer/behandling-section';
import { SelectGosysOppgaveModal } from '@/components/behandling/behandlingsdetaljer/select-gosys-oppgave/select-gosys-oppgave';
import { GosysBeskrivelse } from '@/components/gosys/beskrivelse/beskrivelse';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useGetGosysOppgaveQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { GosysStatus, type IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

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
      <VStack gap="space-8">
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
    return <Alert variant="warning">Ingen oppgave fra Gosys er valgt.</Alert>;
  }

  if (status === GosysStatus.FERDIGSTILT) {
    return <Alert variant="warning">Oppgaven fra Gosys er ferdigstilt.</Alert>;
  }

  if (status === GosysStatus.FEILREGISTRERT) {
    return <Alert variant="warning">Oppgaven fra Gosys er feilregistrert.</Alert>;
  }

  return null;
};
