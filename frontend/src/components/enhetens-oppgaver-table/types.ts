import { OppgaveType } from '../../redux-api/oppgavebehandling-common-types';

export interface Filters {
  types: OppgaveType[];
  ytelser: string[];
  hjemler: string[];
  tildeltSaksbehandler: string[];
  sortDescending: boolean;
}
