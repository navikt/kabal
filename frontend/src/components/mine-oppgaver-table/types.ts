import { SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

export interface Filters {
  sorting: [SortFieldEnum, SortOrderEnum];
}
