import { useGetOppgavebehandlingQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { useOppgaveId } from './use-oppgave-id';

export const useOppgave = (explicitOppgaveId?: string) => {
  const implicitOppgaveId = useOppgaveId();

  return useGetOppgavebehandlingQuery(explicitOppgaveId ?? implicitOppgaveId);
};
