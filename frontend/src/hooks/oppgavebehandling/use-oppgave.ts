import { useGetOppgavebehandlingQuery } from '../../redux-api/oppgavebehandling';
import { useOppgaveId } from './use-oppgave-id';

export const useOppgave = () => {
  const oppgaveId = useOppgaveId();
  return useGetOppgavebehandlingQuery(oppgaveId);
};
