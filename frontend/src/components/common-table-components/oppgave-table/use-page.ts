import type {
  OppgaveTableKey,
  StaticOppgaveTableKey,
} from '@app/components/common-table-components/oppgave-table/types';
import { DEFAULT_PAGE } from '@app/hooks/use-oppgave-pagination';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

export const usePage = (
  tableKey: StaticOppgaveTableKey | OppgaveTableKey,
): [number | undefined, (page: number) => void] => {
  const [query, setQuery] = useSearchParams();
  const queryKey = `${tableKey}.p`;
  const page = query.get(queryKey);

  const setPage = useCallback(
    (page: number) => {
      if (page <= DEFAULT_PAGE) {
        setQuery((prev) => {
          prev.delete(queryKey);
          return prev;
        });
      } else {
        setQuery((prev) => {
          prev.set(queryKey, page.toString(10));
          return prev;
        });
      }
    },
    [setQuery, queryKey],
  );

  if (page === null) {
    return [undefined, setPage];
  }

  const parsedPage = Number.parseInt(page, 10);

  if (Number.isNaN(parsedPage) || parsedPage <= DEFAULT_PAGE) {
    return [undefined, setPage];
  }

  return [parsedPage, setPage];
};
