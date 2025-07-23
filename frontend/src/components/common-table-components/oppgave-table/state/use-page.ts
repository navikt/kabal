import type {
  OppgaveTableKey,
  StaticOppgaveTableKey,
} from '@app/components/common-table-components/oppgave-table/types';
import { DEFAULT_PAGE } from '@app/hooks/use-oppgave-pagination';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router';

export const usePageQueryParam = (
  tableKey: StaticOppgaveTableKey | OppgaveTableKey,
): [number, (page: number) => void] => {
  const queryKey = `${tableKey}.p`;
  const [query, setQuery] = useSearchParams();
  const [page, setPageState] = useState(() => parsePage(query.get(queryKey)));
  const { search } = useLocation();

  const setPage = useCallback(
    (page: number) => {
      if (page <= DEFAULT_PAGE) {
        setPageState(DEFAULT_PAGE);
        setQuery((prev) => {
          prev.delete(queryKey);
          return prev;
        });
      } else {
        setPageState(page);
        setQuery((prev) => {
          prev.set(queryKey, page.toString(10));
          return prev;
        });
      }
    },
    [setQuery, queryKey],
  );

  useEffect(() => {
    const changedQuery = new URLSearchParams(search);

    setPageState(parsePage(changedQuery.get(queryKey)));
  }, [search, queryKey]);

  return [page, setPage];
};

const parsePage = (page: string | null): number => {
  if (page === null) {
    return DEFAULT_PAGE;
  }

  const parsedPage = Number.parseInt(page, 10);

  if (Number.isNaN(parsedPage)) {
    return DEFAULT_PAGE;
  }

  return Math.max(parsedPage, DEFAULT_PAGE);
};
