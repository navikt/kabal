import { useRestrictedNumberSetting } from '@app/hooks/settings/helpers';
import type { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useMemo } from 'react';

interface OppgavePagination {
  from: number;
  to: number;
  total: number;
  page: number;
  pageSize: number;
  oppgaver: string[];
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

export const DEFAULT_PAGE = 1;

export const useOppgavePagination = (
  settingsKey: OppgaveTableRowsPerPage,
  allOppgaver: string[],
  page: number,
): OppgavePagination => {
  const { value: pageSize } = useRestrictedNumberSetting(settingsKey, restrictPageSize);

  const total = allOppgaver.length;

  const offsetFromEnd = total % pageSize;
  const maxFrom = total - (offsetFromEnd === 0 ? pageSize : offsetFromEnd);
  const from = Math.min((page - 1) * pageSize, maxFrom);

  const to = Math.min(total, from + pageSize);

  const oppgaver = useMemo(() => allOppgaver.slice(from, to), [allOppgaver, from, to]);

  const maxPage = Math.ceil(total / pageSize);

  return {
    oppgaver,
    from: from + 1,
    to,
    total,
    pageSize,
    page: Math.min(page, maxPage),
  };
};
