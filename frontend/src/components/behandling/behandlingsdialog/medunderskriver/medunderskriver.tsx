import { LocalAlert, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { MedunderskriverReadOnly } from '@/components/behandling/behandlingsdialog/medunderskriver/read-only';
import { SelectMedunderskriver } from '@/components/behandling/behandlingsdialog/medunderskriver/select-medunderskriver';
import { SendToMedunderskriver } from '@/components/behandling/behandlingsdialog/medunderskriver/send-to-medunderskriver';
import { SendToSaksbehandler } from '@/components/behandling/behandlingsdialog/medunderskriver/send-to-saksbehandler';
import { SKELETON } from '@/components/behandling/behandlingsdialog/medunderskriver/skeleton';
import { MedunderskriverStateText } from '@/components/behandling/behandlingsdialog/medunderskriver/state-text';
import { TakeFromMedunderskriver } from '@/components/behandling/behandlingsdialog/medunderskriver/take-from-medunderskriver';
import { TakeFromSaksbehandler } from '@/components/behandling/behandlingsdialog/medunderskriver/take-from-saksbehandler';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFeilregistrert } from '@/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@/hooks/use-is-fullfoert';

export const Medunderskriver = () => {
  const oppgaveId = useOppgaveId();
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();

  if (oppgaveIsLoading || oppgave === undefined || oppgaveId === skipToken) {
    return SKELETON;
  }

  const { typeId, medunderskriver } = oppgave;

  const isReadOnly = isFinished || isFeilregistrert;

  if (isReadOnly) {
    if (medunderskriver.employee === null) {
      return null;
    }

    return (
      <Container>
        <MedunderskriverReadOnly typeId={typeId} medunderskriver={medunderskriver} />
      </Container>
    );
  }

  if (oppgave.fortrolig) {
    return (
      <LocalAlert status="warning" size="small" className="my-2">
        <LocalAlert.Header>
          <LocalAlert.Title>Medunderskriver</LocalAlert.Title>
        </LocalAlert.Header>
        <LocalAlert.Content>
          Du kan ikke sende til medunderskriver fordi saken gjelder en bruker med fortrolig adresse.
        </LocalAlert.Content>
      </LocalAlert>
    );
  }

  return (
    <Container>
      <SelectMedunderskriver oppgaveId={oppgaveId} medunderskriver={medunderskriver} typeId={typeId} />
      <MedunderskriverStateText medunderskriver={medunderskriver} typeId={typeId} />
      <SendToMedunderskriver oppgaveId={oppgaveId} medunderskriver={medunderskriver} typeId={typeId} />
      <SendToSaksbehandler oppgaveId={oppgaveId} medunderskriver={medunderskriver} />
      <TakeFromMedunderskriver oppgaveId={oppgaveId} medunderskriver={medunderskriver} typeId={typeId} />
      <TakeFromSaksbehandler oppgaveId={oppgaveId} medunderskriver={medunderskriver} />
    </Container>
  );
};

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => (
  <VStack gap="space-8" marginBlock="space-0 space-1">
    {children}
  </VStack>
);
