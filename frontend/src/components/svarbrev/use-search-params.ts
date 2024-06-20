import { SortState } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ALL_TYPES, ActiveEnum, TypeFilter, isActiveValue, isTypeFilter } from '@app/components/svarbrev/filters';

export const useSvarbrevSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const ytelseFilter = searchParams.get(QueryKeys.YTELSE_FILTER) ?? '';
  const setYtelseFilter = useCallback(
    (value: string) => {
      setSearchParams((s) => {
        if (value.length === 0) {
          s.delete(QueryKeys.YTELSE_FILTER);
        } else {
          s.set(QueryKeys.YTELSE_FILTER, value);
          s.set(QueryKeys.SORT_KEY, SortKey.YTELSE_SCORE);
          s.set(QueryKeys.SORT_DIRECTION, SortDirection.DESCENDING);
        }

        return s;
      });
    },
    [setSearchParams],
  );

  const textFilter = searchParams.get(QueryKeys.TEXT_FILTER) ?? '';
  const setTextFilter = useCallback(
    (value: string) => {
      setSearchParams((s) => {
        if (value.length === 0) {
          s.delete(QueryKeys.TEXT_FILTER);
        } else {
          s.set(QueryKeys.TEXT_FILTER, value);
          s.set(QueryKeys.SORT_KEY, SortKey.TEXT_SCORE);
          s.set(QueryKeys.SORT_DIRECTION, SortDirection.DESCENDING);
        }

        return s;
      });
    },
    [setSearchParams],
  );

  const rawTypeFilter = searchParams.get(QueryKeys.TYPE_FILTER);
  const typeFilter = isTypeFilter(rawTypeFilter) ? rawTypeFilter : ALL_TYPES;
  const setTypeFilter = useCallback(
    (value: TypeFilter) => {
      setSearchParams((s) => {
        if (value === ALL_TYPES) {
          s.delete(QueryKeys.TYPE_FILTER);
        } else {
          s.set(QueryKeys.TYPE_FILTER, value);
        }

        return s;
      });
    },
    [setSearchParams],
  );

  const rawActiveFilter = searchParams.get(QueryKeys.ACTIVE_FILTER);
  const activeFilter = isActiveValue(rawActiveFilter) ? rawActiveFilter : ActiveEnum.ALL;
  const setActiveFilter = useCallback(
    (value: ActiveEnum) => {
      setSearchParams((s) => {
        if (value === ActiveEnum.ALL) {
          s.delete(QueryKeys.ACTIVE_FILTER);
        } else {
          s.set(QueryKeys.ACTIVE_FILTER, value);
        }

        return s;
      });
    },
    [setSearchParams],
  );

  const rawSortKey = searchParams.get(QueryKeys.SORT_KEY);
  const sortKey = isSortKey(rawSortKey) ? rawSortKey : SortKey.YTELSE;
  const rawSortDirection = searchParams.get(QueryKeys.SORT_DIRECTION);
  const sortDirection = isSortDirection(rawSortDirection) ? rawSortDirection : SortDirection.ASCENDING;

  const sort: SortState = useMemo(
    () => ({
      orderBy: sortKey,
      direction: sortDirection,
    }),
    [sortKey, sortDirection],
  );

  const setSort = useCallback(
    (sortState: SortState | undefined) => {
      setSearchParams((s) => {
        s.set(QueryKeys.SORT_KEY, sortState?.orderBy ?? SortKey.YTELSE);
        s.set(QueryKeys.SORT_DIRECTION, sortState?.direction ?? SortDirection.ASCENDING);

        return s;
      });
    },
    [setSearchParams],
  );

  return {
    ytelseFilter,
    setYtelseFilter,
    textFilter,
    setTextFilter,
    typeFilter,
    setTypeFilter,
    activeFilter,
    setActiveFilter,
    sort,
    setSort,
  };
};

enum QueryKeys {
  YTELSE_FILTER = 'ytelse',
  TEXT_FILTER = 'tekst',
  TYPE_FILTER = 'type',
  ACTIVE_FILTER = 'aktiv',
  SORT_KEY = 'sorter-etter',
  SORT_DIRECTION = 'sorter-retning',
}

export enum SortDirection {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

const SORT_DIRECTIONS = Object.values(SortDirection);
const isSortDirection = (direction: string | null): direction is SortDirection =>
  SORT_DIRECTIONS.some((d) => d === direction);

export enum SortKey {
  YTELSE = 'ytelse',
  TIME = 'behandlingstid',
  MODIFIED = 'sist-endret',
  YTELSE_SCORE = 'ytelse-score',
  TEXT_SCORE = 'tekst-score',
}

const SORT_KEYS = Object.values(SortKey);
export const isSortKey = (key: string | null): key is SortKey => SORT_KEYS.some((k) => k === key);

export const getDefaultSortDirection = (sortKey: SortKey): SortDirection => {
  switch (sortKey) {
    case SortKey.YTELSE:
      return SortDirection.ASCENDING;
    case SortKey.TIME:
    case SortKey.MODIFIED:
    case SortKey.YTELSE_SCORE:
    case SortKey.TEXT_SCORE:
      return SortDirection.DESCENDING;
    default:
      return SortDirection.ASCENDING;
  }
};
