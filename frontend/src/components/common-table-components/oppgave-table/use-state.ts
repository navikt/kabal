import {
  isShortSortField,
  isShortSortOrder,
  PARAMS_KEY_TO_SHORT,
  SHORT_TO_SORT_FIELD,
  SHORT_TO_SORT_ORDER,
  ShortParamKey,
  SORT_FIELD_TO_SHORT,
  SORT_ORDER_TO_SHORT,
} from '@app/components/common-table-components/oppgave-table/compression';
import type { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import {
  type CommonOppgaverParams,
  type CommonOppgaverParamsKey,
  isSortFieldEnum,
  isSortOrderEnum,
  SortFieldEnum,
  SortOrderEnum,
} from '@app/types/oppgaver';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

export type SetParams = (paramsUpdate: Partial<CommonOppgaverParams>) => void;

interface OppgaveTableState {
  params: CommonOppgaverParams;
  setParams: SetParams;
}

export const useOppgaveTableState = (
  tableKey: OppgaveTableKey,
  defaultParams: Partial<CommonOppgaverParams>,
): OppgaveTableState => {
  const [query, setQuery] = useSearchParams();

  const [state, setState] = useState<CommonOppgaverParams>({
    ...DEFAULT_PARAMS,
    ...defaultParams,
    ...fromUrlParams(query, tableKey),
  });

  const setParams = useCallback(
    (paramsUpdate: Partial<CommonOppgaverParams>) => setState((prevState) => ({ ...prevState, ...paramsUpdate })),
    [],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setQuery((urlParams) => toUrlParams(urlParams, tableKey, state), { preventScrollReset: true, replace: true });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [state, setQuery, tableKey]);

  return { params: state, setParams };
};

const toUrlParams = (urlParams: URLSearchParams, tableKey: OppgaveTableKey, newParams: CommonOppgaverParams) => {
  for (const paramKey of COMMON_OPPGAVER_PARAMS_KEYS) {
    const value = newParams[paramKey];
    const shortKey = PARAMS_KEY_TO_SHORT[paramKey];

    if (value === undefined) {
      urlParams.delete(`${tableKey}.${shortKey}`); // Delete parameter if value is undefined
      continue; // Skip further processing for this key
    }

    // Sort order value
    if (shortKey === ShortParamKey.REKKEFOELGE) {
      if (typeof value === 'string' && isSortOrderEnum(value)) {
        urlParams.set(`${tableKey}.${shortKey}`, SORT_ORDER_TO_SHORT[value]);
      } else {
        urlParams.delete(`${tableKey}.${shortKey}`); // Remove if not a valid sort order
      }
      continue; // Skip further processing for this key
    }

    // Sort field value
    if (shortKey === ShortParamKey.SORTERING) {
      if (typeof value === 'string' && isSortFieldEnum(value)) {
        urlParams.set(`${tableKey}.${shortKey}`, SORT_FIELD_TO_SHORT[value]);
      } else {
        urlParams.delete(`${tableKey}.${shortKey}`); // Remove if not a valid sort field
      }
      continue; // Skip further processing for this key
    }

    // Array value
    if (Array.isArray(value)) {
      if (value.length > 0) {
        urlParams.set(`${tableKey}.${shortKey}`, value.join('~'));
      } else {
        urlParams.delete(`${tableKey}.${shortKey}`); // Remove if the array is empty
      }
      continue; // Skip further processing for this key
    }

    // String value
    if (value.length > 0) {
      urlParams.set(`${tableKey}.${shortKey}`, value);
    } else {
      urlParams.delete(`${tableKey}.${shortKey}`); // Remove if the string is empty
    }
  }

  return urlParams;
};

const fromUrlParams = (query: URLSearchParams, tableKey: OppgaveTableKey): Partial<CommonOppgaverParams> => {
  const entries: [CommonOppgaverParamsKey, string | number | string[]][] = [];

  const shortSortOrder = query.get(`${tableKey}.${ShortParamKey.REKKEFOELGE}`);

  if (shortSortOrder !== null && isShortSortOrder(shortSortOrder)) {
    entries.push(['rekkefoelge', SHORT_TO_SORT_ORDER[shortSortOrder]]);
  }

  const shortSortField = query.get(`${tableKey}.${ShortParamKey.SORTERING}`);

  if (shortSortField !== null && isShortSortField(shortSortField)) {
    entries.push(['sortering', SHORT_TO_SORT_FIELD[shortSortField]]);
  }

  for (const paramKey of GENERIC_COMMON_OPPGAVER_PARAMS_KEYS) {
    const shortKey = PARAMS_KEY_TO_SHORT[paramKey];
    const queryKey = `${tableKey}.${shortKey}`;
    const queryValue = query.get(queryKey);

    if (queryValue === null) {
      continue; // Skip if the query parameter is not present
    }

    const value = ARRAY_PARAMS.has(paramKey) ? queryValue.split('~') : queryValue.trim();

    if (value.length > 0) {
      entries.push([paramKey, value]);
    }
  }

  return Object.fromEntries(entries);
};

const DEFAULT_PARAMS: CommonOppgaverParams = {
  rekkefoelge: SortOrderEnum.DESC,
  sortering: SortFieldEnum.FRIST,
};

const ARRAY_PARAMS = new Set([
  'typer',
  'ytelser',
  'hjemler',
  'registreringshjemler',
  'tildelteSaksbehandlere',
  'medunderskrivere',
  'tildelteRol',
]);

const COMMON_OPPGAVER_PARAMS_KEYS = Object.keys(PARAMS_KEY_TO_SHORT) as CommonOppgaverParamsKey[];

const SPECIAL_COMMON_OPPGAVER_PARAMS_KEYS: CommonOppgaverParamsKey[] = ['rekkefoelge', 'sortering'];
const GENERIC_COMMON_OPPGAVER_PARAMS_KEYS: CommonOppgaverParamsKey[] = COMMON_OPPGAVER_PARAMS_KEYS.filter(
  (key) => !SPECIAL_COMMON_OPPGAVER_PARAMS_KEYS.includes(key),
);
