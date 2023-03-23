import { useGetOppgavebehandlingQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { useOppgaveId } from './use-oppgave-id';

export const useOppgave = () => {
  const oppgaveId = useOppgaveId();

  return useGetOppgavebehandlingQuery(oppgaveId);
};
