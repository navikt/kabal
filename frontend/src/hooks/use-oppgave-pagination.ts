import { useRestrictedNumberSetting } from '@app/hooks/settings/helpers';
import type { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useMemo, useState } from 'react';

interface OppgavePagination {
  from: number;
  to: number;
  total: number;
  page: number;
  pageSize: number;
  oppgaver: string[];
  setPage: (page: number) => void;
}

const DEFAULT_VALUE = 10;
const VALUES = [DEFAULT_VALUE, 20, 50, 100, 250];
export const PAGE_SIZE_OPTIONS = VALUES.map((v) => v.toString(10));

export const restrictPageSize = (value: number | undefined) => {
  if (value === undefined) {
    return DEFAULT_VALUE;
  }

  return VALUES.includes(value) ? value : DEFAULT_VALUE;
};

export const useOppgavePagination = (
  settingsKey: OppgaveTableRowsPerPage,
  allOppgaver: string[] = [],
): OppgavePagination => {
  const [page, setPage] = useState(1);
  const { value: pageSize } = useRestrictedNumberSetting(settingsKey, restrictPageSize);

  const total = allOppgaver.length;
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
