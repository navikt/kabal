import { OppgaveType } from '../../types/kodeverk';

export interface Filters {
  types: OppgaveType[];
  ytelser: string[];
  hjemler: string[];
  sortDescending: boolean;
}
