import { OppgaveType } from '../../types/kodeverk';
import { SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';

export interface Filters {
  types: OppgaveType[];
  ytelser: string[];
  hjemler: string[];
  tildeltSaksbehandler: string[];
  sorting: [SortFieldEnum, SortOrderEnum];
}
