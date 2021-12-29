import { OppgaveType } from '../../redux-api/oppgavebehandling-common-types';

export interface Filters {
  types: OppgaveType[];
  ytelser: string[];
  hjemler: string[];
  sortDescending: boolean;
}
