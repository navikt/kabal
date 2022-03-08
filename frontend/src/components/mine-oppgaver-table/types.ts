import { SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';

export interface Filters {
  sorting: [SortFieldEnum, SortOrderEnum];
}
