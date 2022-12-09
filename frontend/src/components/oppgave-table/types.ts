import { SaksTypeEnum } from '../../types/kodeverk';
import { SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';

export interface Filters {
  types: SaksTypeEnum[];
  ytelser: string[];
  hjemler: string[];
  sorting: [SortFieldEnum, SortOrderEnum];
}
