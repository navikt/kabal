import { SaksTypeEnum } from '@app/types/kodeverk';
import { SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

export interface Filters {
  types: SaksTypeEnum[];
  ytelser: string[];
  hjemler: string[];
  tildeltSaksbehandler: string[];
  sorting: [SortFieldEnum, SortOrderEnum];
}
