import { LocalAlert, VStack } from '@navikt/ds-react';
import { RolReadOnly } from '@/components/behandling/behandlingsdialog/rol/read-only';
import { SelectRol } from '@/components/behandling/behandlingsdialog/rol/select-rol';
import { SendToRol } from '@/components/behandling/behandlingsdialog/rol/send-to-rol';
import { SendToSaksbehandler } from '@/components/behandling/behandlingsdialog/rol/send-to-saksbehandler';
import { SKELETON } from '@/components/behandling/behandlingsdialog/rol/skeleton';
import { RolStateText } from '@/components/behandling/behandlingsdialog/rol/state-text';
import { TakeFromRol } from '@/components/behandling/behandlingsdialog/rol/take-from-rol';
import { TakeFromSaksbehandler } from '@/components/behandling/behandlingsdialog/rol/take-from-saksbehandler';
import { hasFortroligStatus } from '@/domain/is-fortrolig';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useIsFeilregistrert } from '@/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@/hooks/use-is-fullfoert';
import { useIsAssignedRol } from '@/hooks/use-is-rol';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { FlowState } from '@/types/oppgave-common';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

export const Rol = () => {
  const { data, isSuccess } = useOppgave();

  return isSuccess ? <RolInternal oppgave={data} /> : SKELETON;
};

interface Props {
  oppgave: IOppgavebehandling;
}

const RolInternal = ({ oppgave }: Props) => {
  const isSaksbehandler = useIsTildeltSaksbehandler();
  const isAssignedRol = useIsAssignedRol();
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();

  const { rol, sakenGjelder } = oppgave;

  const canEdit =
    !isFinished &&
    !isFeilregistrert &&
    (isSaksbehandler || (isAssignedRol && oppgave.rol.flowState !== FlowState.NOT_SENT));

  if (!canEdit) {
    if (rol.employee === null) {
      return null;
    }

    return (
      <Container>
        <RolReadOnly rol={rol} />
      </Container>
    );
  }

  if (hasFortroligStatus(sakenGjelder.statusList)) {
    return (
      <LocalAlert status="warning" size="small" className="my-2">
        <LocalAlert.Header>
          <LocalAlert.Title>Rådgivende overlege</LocalAlert.Title>
        </LocalAlert.Header>
        <LocalAlert.Content>
          Du kan ikke sende til rådgivende overlege fordi saken gjelder en bruker med fortrolig adresse.
        </LocalAlert.Content>
      </LocalAlert>
    );
  }

  return (
    <Container>
      <SelectRol oppgaveId={oppgave.id} isSaksbehandler={isSaksbehandler} rol={oppgave.rol} />
      <RolStateText isSaksbehandler={isSaksbehandler} rol={oppgave.rol} />
      <SendToRol oppgaveId={oppgave.id} isSaksbehandler={isSaksbehandler} rol={rol} />
      <SendToSaksbehandler oppgaveId={oppgave.id} isSaksbehandler={isSaksbehandler} />
      <TakeFromRol oppgaveId={oppgave.id} isSaksbehandler={isSaksbehandler} rol={rol} />
      <TakeFromSaksbehandler oppgaveId={oppgave.id} />
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
