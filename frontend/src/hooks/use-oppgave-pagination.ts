import { useMemo, useState } from 'react';
import { OppgaveTableRowsPerPage, useNumberSetting } from '@app/hooks/settings/use-setting';

interface OppgavePagination {
  from: number;
  to: number;
  total: number;
  page: number;
  pageSize: number;
  oppgaver: string[];
  setPage: (page: number) => void;
}

export const useOppgavePagination = (
  settingsKey: OppgaveTableRowsPerPage,
  allOppgaver: string[] = [],
  defaultPageSize = 10,
): OppgavePagination => {
  const [page, setPage] = useState(1);
  const { value = defaultPageSize } = useNumberSetting(settingsKey);

  const total = allOppgaver.length;
  const pageSize = value === -1 ? total : value;
  const from = (page - 1) * pageSize;

  const oppgaver = useMemo(() => allOppgaver.slice(from, from + pageSize), [pageSize, from, allOppgaver]);

  return {
    oppgaver,
    from: from + 1,
    to: Math.min(total, from + pageSize),
    total,
    pageSize,
    page,
    setPage,
  };
};
