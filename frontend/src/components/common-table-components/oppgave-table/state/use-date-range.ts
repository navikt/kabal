import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { ShortParamKey } from '@/components/common-table-components/oppgave-table/state/short-names';
import type { OppgaveTableKey } from '@/components/common-table-components/oppgave-table/types';

const DATE_SEPARATOR = '_';

const useOppgaveTableDateRange = (key: string) => {
  const [query, setQuery] = useSearchParams();
  const [fromQueryValue, toQueryValue] = fromDateRangeParam(query.get(key));

  const [fromDate, setFromDate] = useState<string | undefined>(fromQueryValue);
  const [toDate, setToDate] = useState<string | undefined>(toQueryValue);

  const setDateRange = (from: string | undefined, to: string | undefined) => {
    if (from === undefined && to === undefined) {
      setFromDate(undefined);
      setToDate(undefined);

      query.delete(key);
      return setQuery(query);
    }

    setFromDate(from);
    setToDate(to);

    if (from !== undefined && to !== undefined) {
      query.set(key, `${from}${DATE_SEPARATOR}${to}`);
      return setQuery(query);
    }

    if (from !== undefined) {
      query.set(key, `${from}`);

      return setQuery(query);
    }

    // from === undefined && to !== undefined should never happen
  };

  return { from: fromDate, to: toDate, setDateRange } as const;
};

export const useOppgaveTableFerdigstilt = (tableKey: OppgaveTableKey) =>
  useOppgaveTableDateRange(`${tableKey}.${ShortParamKey.FERDIGSTILT}`);

export const useOppgaveTableReturnert = (tableKey: OppgaveTableKey) =>
  useOppgaveTableDateRange(`${tableKey}.${ShortParamKey.RETURNERT}`);

export const useOppgaveTableFrist = (tableKey: OppgaveTableKey) =>
  useOppgaveTableDateRange(`${tableKey}.${ShortParamKey.FRIST}`);

export const useOppgaveTableVarsletFrist = (tableKey: OppgaveTableKey) =>
  useOppgaveTableDateRange(`${tableKey}.${ShortParamKey.VARSLET_FRIST}`);

export const fromDateRangeParam = (value: string | null): [string | undefined, string | undefined] => {
  if (value === null) {
    return [undefined, undefined];
  }

  const [from, to] = value.split(DATE_SEPARATOR);

  return [from, to];
};
