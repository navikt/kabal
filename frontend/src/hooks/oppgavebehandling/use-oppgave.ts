import { useGetOppgavebehandlingQuery } from '../../redux-api/oppgavebehandling';
import { useOppgaveId } from '../use-oppgave-id';
import { useOppgaveType } from '../use-oppgave-type';

export const useOppgave = () => {
  const type = useOppgaveType();
  const oppgaveId = useOppgaveId();
  return useGetOppgavebehandlingQuery({ oppgaveId, type });
};
