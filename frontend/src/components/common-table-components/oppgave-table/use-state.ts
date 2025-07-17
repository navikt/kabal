import {
  isShortSortField,
  isShortSortOrder,
  SHORT_TO_SORT_FIELD,
  SHORT_TO_SORT_ORDER,
  ShortParamKey,
} from '@app/components/common-table-components/oppgave-table/compression';
import type { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import { isSaksTypeEnum, type SaksTypeEnum } from '@app/types/kodeverk';
import { type CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { useCallback, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';

export type SetTyper = ReturnType<typeof useOppgaveTableTyper>[1];
export type SetYtelser = ReturnType<typeof useOppgaveTableYtelser>[1];
export type SetHjemler = ReturnType<typeof useOppgaveTableHjemler>[1];
export type SetRegistreringshjemler = ReturnType<typeof useOppgaveTableRegistreringshjemler>[1];
export type SetTildelteSaksbehandlere = ReturnType<typeof useOppgaveTableTildelteSaksbehandlere>[1];
export type SetMedunderskrivere = ReturnType<typeof useOppgaveTableMedunderskrivere>[1];
export type SetTildelteRol = ReturnType<typeof useOppgaveTableTildelteRol>[1];
export type SetFerdigstiltFrom = ReturnType<typeof useOppgaveTableFerdigstiltFrom>[1];
export type SetFerdigstiltTo = ReturnType<typeof useOppgaveTableFerdigstiltTo>[1];
export type SetReturnertFrom = ReturnType<typeof useOppgaveTableReturnertFrom>[1];
export type SetReturnertTo = ReturnType<typeof useOppgaveTableReturnertTo>[1];
export type SetFristFrom = ReturnType<typeof useOppgaveTableFristFrom>[1];
export type SetFristTo = ReturnType<typeof useOppgaveTableFristTo>[1];
export type SetVarsletFristFrom = ReturnType<typeof useOppgaveTableVarsletFristFrom>[1];
export type SetVarsletFristTo = ReturnType<typeof useOppgaveTableVarsletFristTo>[1];

export interface TableStateSetters {
  setTyper: SetTyper;
  setYtelser: SetYtelser;
  setHjemler: SetHjemler;
  setRegistreringshjemler: SetRegistreringshjemler;
  setTildelteSaksbehandlere: SetTildelteSaksbehandlere;
  setMedunderskrivere: SetMedunderskrivere;
  setTildelteRol: SetTildelteRol;
  setFerdigstiltFrom: SetFerdigstiltFrom;
  setFerdigstiltTo: SetFerdigstiltTo;
  setReturnertFrom: SetReturnertFrom;
  setReturnertTo: SetReturnertTo;
  setFristFrom: SetFristFrom;
  setFristTo: SetFristTo;
  setVarsletFristFrom: SetVarsletFristFrom;
  setVarsletFristTo: SetVarsletFristTo;
}

export type SetSortering = ReturnType<typeof useOppgaveTableSortering>[1];
export type SetRekkefoelge = ReturnType<typeof useOppgaveTableRekkefoelge>[1];

export interface TableSortingSetters {
  setSortering: SetSortering;
  setRekkefoelge: SetRekkefoelge;
}

const ARRAY_SEPARATOR = '~';

// Default parameters
const DEFAULT_PARAMS: CommonOppgaverParams = {
  rekkefoelge: SortOrderEnum.DESC,
  sortering: SortFieldEnum.FRIST,
};

// Generic hook for URL query parameter management
const useUrlQueryParam = <T>(
  key: string,
  getter: (query: URLSearchParams, key: string) => T | undefined,
  setter: (query: URLSearchParams, key: string, value: T | undefined) => URLSearchParams,
  defaultValue?: T,
) => {
  const [query, setQuery] = useSearchParams();
  const [optimisticValue, setOptimisticValue] = useState<T | undefined>(undefined);

  // Use optimistic value if available, otherwise use URL value or default value
  const currentValue = optimisticValue ?? getter(query, key) ?? defaultValue;

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const updateUrlQuery = useCallback(
    (query: URLSearchParams) => {
      if (debounceTimeout.current !== null) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        setQuery(query, { preventScrollReset: true, replace: true });
        setOptimisticValue(undefined); // Clear optimistic value after URL update
        debounceTimeout.current = null;
      }, 300);
    },
    [setQuery],
  );

  const setStateWithQuery = useCallback(
    (value: T | undefined) => {
      setOptimisticValue(value); // Set optimistic value immediately for UI responsiveness
      updateUrlQuery(setter(query, key, value));
    },
    [query, key, updateUrlQuery, setter],
  );

  return [currentValue, setStateWithQuery] as const;
};

// Individual hooks for each parameter

export const useOppgaveTableTyper = (tableKey: OppgaveTableKey, defaultValue?: SaksTypeEnum[]) =>
  useUrlQueryParam(
    `${tableKey}.${ShortParamKey.TYPER}`,
    (query) => getTyperParam(query, tableKey),
    (query, key, value) => setArrayQuery(query, key, value as string[]),
    defaultValue ?? DEFAULT_PARAMS.typer,
  );

export const useOppgaveTableYtelser = (tableKey: OppgaveTableKey, defaultValue?: string[]) =>
  useUrlQueryParam(
    `${tableKey}.${ShortParamKey.YTELSER}`,
    (query, key) => getArrayParam(query, key),
    (query, key, value) => setArrayQuery(query, key, value),
    defaultValue ?? DEFAULT_PARAMS.ytelser,
  );

export const useOppgaveTableHjemler = (tableKey: OppgaveTableKey, defaultValue?: string[]) =>
  useUrlQueryParam(
    `${tableKey}.${ShortParamKey.HJEMLER}`,
    (query, key) => getArrayParam(query, key),
    (query, key, value) => setArrayQuery(query, key, value),
    defaultValue ?? DEFAULT_PARAMS.hjemler,
  );

export const useOppgaveTableRegistreringshjemler = (tableKey: OppgaveTableKey, defaultValue?: string[]) =>
  useUrlQueryParam(
    `${tableKey}.${ShortParamKey.REGISTRERINGSHEMLER}`,
    (query, key) => getArrayParam(query, key),
    (query, key, value) => setArrayQuery(query, key, value),
    defaultValue ?? DEFAULT_PARAMS.registreringshjemler,
  );

export const useOppgaveTableTildelteSaksbehandlere = (tableKey: OppgaveTableKey, defaultValue?: string[]) =>
  useUrlQueryParam(
    `${tableKey}.${ShortParamKey.TILDELTE_SAKSBEHANDLERE}`,
    (query, key) => getArrayParam(query, key),
    (query, key, value) => setArrayQuery(query, key, value),
    defaultValue ?? DEFAULT_PARAMS.tildelteSaksbehandlere,
  );

export const useOppgaveTableMedunderskrivere = (tableKey: OppgaveTableKey, defaultValue?: string[]) =>
  useUrlQueryParam(
    `${tableKey}.${ShortParamKey.MEDUNDERSKRIVERE}`,
    (query, key) => getArrayParam(query, key),
    (query, key, value) => setArrayQuery(query, key, value),
    defaultValue ?? DEFAULT_PARAMS.medunderskrivere,
  );

export const useOppgaveTableTildelteRol = (tableKey: OppgaveTableKey, defaultValue?: string[]) =>
  useUrlQueryParam(
    `${tableKey}.${ShortParamKey.TILDELTE_ROL}`,
    (query, key) => getArrayParam(query, key),
    (query, key, value) => setArrayQuery(query, key, value),
    defaultValue ?? DEFAULT_PARAMS.tildelteRol,
  );

export const useOppgaveTableSortering = (tableKey: OppgaveTableKey, defaultValue?: SortFieldEnum) => {
  const [sortering, setSortering] = useUrlQueryParam(
    `${tableKey}.${ShortParamKey.SORTERING}`,
    (query) => getSortFieldParam(query, tableKey),
    (query, key, value) => setStringQuery(query, key, value as string),
    defaultValue ?? DEFAULT_PARAMS.sortering,
  );
  return [sortering ?? DEFAULT_PARAMS.sortering, setSortering] as const;
};

export const useOppgaveTableRekkefoelge = (tableKey: OppgaveTableKey, defaultValue?: SortOrderEnum) => {
  const [rekkefoelge, setRekkefoelge] = useUrlQueryParam(
    `${tableKey}.${ShortParamKey.REKKEFOELGE}`,
    (query) => getSortOrderParam(query, tableKey),
    (query, key, value) => setStringQuery(query, key, value as string),
    defaultValue ?? DEFAULT_PARAMS.rekkefoelge,
  );
  return [rekkefoelge ?? DEFAULT_PARAMS.rekkefoelge, setRekkefoelge] as const;
};

export const useOppgaveTableFerdigstiltFrom = (tableKey: OppgaveTableKey, defaultValue?: string) =>
  useUrlQueryParam(
    `${tableKey}.${ShortParamKey.FERDIGSTILT_FROM}`,
    (query, key) => getStringParam(query, key),
    (query, key, value) => setStringQuery(query, key, value),
    defaultValue ?? DEFAULT_PARAMS.ferdigstiltFrom,
  );

export const useOppgaveTableFerdigstiltTo = (tableKey: OppgaveTableKey, defaultValue?: string) =>
  useUrlQueryParam(
    `${tableKey}.${ShortParamKey.FERDIGSTILT_TO}`,
    (query, key) => getStringParam(query, key),
    (query, key, value) => setStringQuery(query, key, value),
    defaultValue ?? DEFAULT_PARAMS.ferdigstiltTo,
  );

export const useOppgaveTableReturnertFrom = (tableKey: OppgaveTableKey, defaultValue?: string) =>
  useUrlQueryParam(
    `${tableKey}.${ShortParamKey.RETURNERT_FROM}`,
    (query, key) => getStringParam(query, key),
    (query, key, value) => setStringQuery(query, key, value),
    defaultValue ?? DEFAULT_PARAMS.returnertFrom,
  );

export const useOppgaveTableReturnertTo = (tableKey: OppgaveTableKey, defaultValue?: string) =>
  useUrlQueryParam(
    `${tableKey}.${ShortParamKey.RETURNERT_TO}`,
    (query, key) => getStringParam(query, key),
    (query, key, value) => setStringQuery(query, key, value),
    defaultValue ?? DEFAULT_PARAMS.returnertTo,
  );

export const useOppgaveTableFristFrom = (tableKey: OppgaveTableKey, defaultValue?: string) =>
  useUrlQueryParam(
    `${tableKey}.${ShortParamKey.FRIST_FROM}`,
    (query, key) => getStringParam(query, key),
    (query, key, value) => setStringQuery(query, key, value),
    defaultValue ?? DEFAULT_PARAMS.fristFrom,
  );

export const useOppgaveTableFristTo = (tableKey: OppgaveTableKey, defaultValue?: string) =>
  useUrlQueryParam(
    `${tableKey}.${ShortParamKey.FRIST_TO}`,
    (query, key) => getStringParam(query, key),
    (query, key, value) => setStringQuery(query, key, value),
    defaultValue ?? DEFAULT_PARAMS.fristTo,
  );

export const useOppgaveTableVarsletFristFrom = (tableKey: OppgaveTableKey, defaultValue?: string) =>
  useUrlQueryParam(
    `${tableKey}.${ShortParamKey.VARSLT_FRIST_FROM}`,
    (query, key) => getStringParam(query, key),
    (query, key, value) => setStringQuery(query, key, value),
    defaultValue ?? DEFAULT_PARAMS.varsletFristFrom,
  );

export const useOppgaveTableVarsletFristTo = (tableKey: OppgaveTableKey, defaultValue?: string) =>
  useUrlQueryParam(
    `${tableKey}.${ShortParamKey.VARSLT_FRIST_TO}`,
    (query, key) => getStringParam(query, key),
    (query, key, value) => setStringQuery(query, key, value),
    defaultValue ?? DEFAULT_PARAMS.varsletFristTo,
  );

// Helper functions for URL parameter management

const getTyperParam = (query: URLSearchParams, tableKey: OppgaveTableKey): SaksTypeEnum[] | undefined => {
  const value = query.get(`${tableKey}.${ShortParamKey.TYPER}`);
  return value !== null ? value.split(ARRAY_SEPARATOR).filter(isSaksTypeEnum) : undefined;
};

const getStringParam = (query: URLSearchParams, key: string): string | undefined => {
  const value = query.get(key);
  return value !== null ? value.trim() : undefined;
};

const getArrayParam = (query: URLSearchParams, key: string): string[] | undefined => {
  const value = query.get(key);
  return value !== null ? value.split(ARRAY_SEPARATOR) : undefined;
};

const getSortOrderParam = (query: URLSearchParams, tableKey: OppgaveTableKey): SortOrderEnum | undefined => {
  const value = query.get(`${tableKey}.${ShortParamKey.REKKEFOELGE}`);
  return value !== null && isShortSortOrder(value) ? SHORT_TO_SORT_ORDER[value] : undefined;
};

const getSortFieldParam = (query: URLSearchParams, tableKey: OppgaveTableKey): SortFieldEnum | undefined => {
  const value = query.get(`${tableKey}.${ShortParamKey.SORTERING}`);
  return value !== null && isShortSortField(value) ? SHORT_TO_SORT_FIELD[value] : undefined;
};

const setArrayQuery = (query: URLSearchParams, key: string, values: string[] | undefined) => {
  if (values !== undefined && values.length > 0) {
    query.set(key, values.join(ARRAY_SEPARATOR));
  } else {
    query.delete(key);
  }

  return query;
};

const setStringQuery = (query: URLSearchParams, key: string, value: string | undefined) => {
  if (value !== undefined && value.length > 0) {
    query.set(key, value);
  } else {
    query.delete(key);
  }

  return query;
};

export const useOppgaveTableState = (
  tableKey: OppgaveTableKey,
  defaultParams: Partial<CommonOppgaverParams> = {},
): CommonOppgaverParams => {
  const [typer] = useOppgaveTableTyper(tableKey, defaultParams.typer);
  const [ytelser] = useOppgaveTableYtelser(tableKey, defaultParams.ytelser);
  const [hjemler] = useOppgaveTableHjemler(tableKey, defaultParams.hjemler);
  const [registreringshjemler] = useOppgaveTableRegistreringshjemler(tableKey, defaultParams.registreringshjemler);
  const [tildelteSaksbehandlere] = useOppgaveTableTildelteSaksbehandlere(
    tableKey,
    defaultParams.tildelteSaksbehandlere,
  );
  const [medunderskrivere] = useOppgaveTableMedunderskrivere(tableKey, defaultParams.medunderskrivere);
  const [tildelteRol] = useOppgaveTableTildelteRol(tableKey, defaultParams.tildelteRol);
  const [sortering] = useOppgaveTableSortering(tableKey, defaultParams.sortering);
  const [rekkefoelge] = useOppgaveTableRekkefoelge(tableKey, defaultParams.rekkefoelge);
  const [ferdigstiltFrom] = useOppgaveTableFerdigstiltFrom(tableKey, defaultParams.ferdigstiltFrom);
  const [ferdigstiltTo] = useOppgaveTableFerdigstiltTo(tableKey, defaultParams.ferdigstiltTo);
  const [returnertFrom] = useOppgaveTableReturnertFrom(tableKey, defaultParams.returnertFrom);
  const [returnertTo] = useOppgaveTableReturnertTo(tableKey, defaultParams.returnertTo);
  const [fristFrom] = useOppgaveTableFristFrom(tableKey, defaultParams.fristFrom);
  const [fristTo] = useOppgaveTableFristTo(tableKey, defaultParams.fristTo);
  const [varsletFristFrom] = useOppgaveTableVarsletFristFrom(tableKey, defaultParams.varsletFristFrom);
  const [varsletFristTo] = useOppgaveTableVarsletFristTo(tableKey, defaultParams.varsletFristTo);

  return {
    typer,
    ytelser,
    hjemler,
    registreringshjemler,
    tildelteSaksbehandlere,
    medunderskrivere,
    tildelteRol,
    rekkefoelge,
    sortering,
    ferdigstiltFrom,
    ferdigstiltTo,
    returnertFrom,
    returnertTo,
    fristFrom,
    fristTo,
    varsletFristFrom,
    varsletFristTo,
  };
};
