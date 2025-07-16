import {
  isShortSortField,
  isShortSortOrder,
  SHORT_TO_SORT_FIELD,
  SHORT_TO_SORT_ORDER,
  ShortParamKey,
  SORT_FIELD_TO_SHORT,
  SORT_ORDER_TO_SHORT,
} from '@app/components/common-table-components/oppgave-table/state/short-names';
import type { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import type { SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

const SORTING_SEPARATOR = '-';

export const useOppgaveTableSorting = (
  tableKey: OppgaveTableKey,
  defaultSortField: SortFieldEnum,
  defaultSortOrder: SortOrderEnum,
) => {
  const [query, setQuery] = useSearchParams();
  const sortingKey = `${tableKey}.${ShortParamKey.SORTERING}`;
  const [currentSortField = defaultSortField, currentSortOrder = defaultSortOrder] = fromSortingParam(
    query.get(sortingKey),
  );

  const [sortField, setSortField] = useState<SortFieldEnum>(currentSortField);
  const [sortOrder, setSortOrder] = useState<SortOrderEnum>(currentSortOrder);

  const setSortering = (newSortField: SortFieldEnum, newSortOrder: SortOrderEnum) => {
    setSortField(newSortField);
    setSortOrder(newSortOrder);

    const value = `${SORT_FIELD_TO_SHORT[newSortField]}${SORTING_SEPARATOR}${SORT_ORDER_TO_SHORT[newSortOrder]}`;
    query.set(sortingKey, value);
    setQuery(query);
  };

  return { sortField, sortOrder, setSortering } as const;
};

const fromSortOrderParam = (value: string | undefined): SortOrderEnum | undefined =>
  value !== undefined && isShortSortOrder(value) ? SHORT_TO_SORT_ORDER[value] : undefined;

const fromSortFieldParam = (value: string | undefined): SortFieldEnum | undefined =>
  value !== undefined && isShortSortField(value) ? SHORT_TO_SORT_FIELD[value] : undefined;

export const fromSortingParam = (value: string | null): [SortFieldEnum, SortOrderEnum] | [undefined, undefined] => {
  if (value === null) {
    return [undefined, undefined];
  }

  const [field, order] = value.split(SORTING_SEPARATOR);
  const sortField = fromSortFieldParam(field);
  const sortOrder = fromSortOrderParam(order);

  if (sortField !== undefined && sortOrder !== undefined) {
    return [sortField, sortOrder];
  }

  return [undefined, undefined];
};
