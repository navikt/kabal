import { OppgaveType } from '../../redux-api/oppgavebehandling-common-types';
import { useOppgaveType } from '../use-oppgave-type';

export const useOppgavebehandlingApiUrl = (): string => {
  const type = useOppgaveType();

  const klagebehandlingUrl = '/api/kabal-api/klagebehandlinger/';
  const ankebehandlingUrl = '/api/kabal-anke-api/ankebehandlinger/';

  return type === OppgaveType.ANKEBEHANDLING ? ankebehandlingUrl : klagebehandlingUrl;
};
