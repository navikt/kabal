import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetOppgavebehandlingQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';

export const useOppgave = (explicitOppgaveId?: string) => {
  const implicitOppgaveId = useOppgaveId();

  return useGetOppgavebehandlingQuery(explicitOppgaveId ?? implicitOppgaveId);
};
