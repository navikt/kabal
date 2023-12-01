import { useGetOppgavebehandlingQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { useOppgaveId } from './use-oppgave-id';

export const useOppgave = (oppgaveId?: string) => {
  const implicitOppgaveId = useOppgaveId();

  return useGetOppgavebehandlingQuery(oppgaveId ?? implicitOppgaveId);
};
