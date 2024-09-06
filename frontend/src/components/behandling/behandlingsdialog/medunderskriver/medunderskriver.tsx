import { skipToken } from '@reduxjs/toolkit/query';
import { styled } from 'styled-components';
import { SKELETON } from '@app/components/behandling/behandlingsdialog/medunderskriver/skeleton';
import { TakeFromSaksbehandler } from '@app/components/behandling/behandlingsdialog/medunderskriver/take-from-saksbehandler';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { MedunderskriverReadOnly } from './read-only';
import { SelectMedunderskriver } from './select-medunderskriver';
import { SendToMedunderskriver } from './send-to-medunderskriver';
import { SendToSaksbehandler } from './send-to-saksbehandler';
import { MedunderskriverStateText } from './state-text';
import { TakeFromMedunderskriver } from './take-from-medunderskriver';

export const Medunderskriver = () => {
  const oppgaveId = useOppgaveId();
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();

  if (oppgaveIsLoading || oppgave === undefined || oppgaveId === skipToken) {
    return SKELETON;
  }

  if (oppgave.strengtFortrolig === true) {
    return null;
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

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-2);
  margin-bottom: var(--a-spacing-4);
`;
