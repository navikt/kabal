import { OppgaveType } from '../../redux-api/oppgavebehandling-common-types';
import { useOppgaveType } from '../use-oppgave-type';

const klagebehandlingUrl = '/api/kabal-api/klagebehandlinger/';
const ankebehandlingUrl = '/api/kabal-anke-api/ankebehandlinger/';

export const useOppgavebehandlingApiUrl = (): string =>
  useOppgaveType() === OppgaveType.ANKEBEHANDLING ? ankebehandlingUrl : klagebehandlingUrl;
