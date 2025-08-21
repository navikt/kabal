import { ShortParamKey } from '@app/components/common-table-components/oppgave-table/state/short-names';
import type { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import { isSaksTypeEnum, type SaksTypeEnum } from '@app/types/kodeverk';
import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router';

// Generic hook for URL query parameter management
const useUrlQueryParam = <T>(
  key: string,
  getter: (key: string | null) => T | undefined,
  setter: (query: URLSearchParams, key: string, value: T | undefined) => void,
  defaultValue?: T,
) => {
  const [query, setQuery] = useSearchParams();
  const [value, setValue] = useState<T | undefined>(getter(query.get(key)) ?? defaultValue);

  const setStateWithQuery = useCallback(
    (value: T | undefined) => {
      setValue(value); // Set state immediately
      setter(query, key, value); // Update the query parameter
      setQuery(query); // Set the updated query in the URL
    },
    [query, key, setter, setQuery],
  );

  return [value, setStateWithQuery] as const;
};

// Individual hooks for each parameter

export const useOppgaveTableTyper = (tableKey: OppgaveTableKey, defaultValue?: SaksTypeEnum[]) =>
  useUrlQueryParam(`${tableKey}.${ShortParamKey.TYPER}`, fromTyperParam, setArrayQuery, defaultValue);

export const useOppgaveTableYtelser = (tableKey: OppgaveTableKey, defaultValue?: string[]) =>
  useUrlQueryParam(`${tableKey}.${ShortParamKey.YTELSER}`, fromArrayParam, setArrayQuery, defaultValue);

export const useOppgaveTableHjemler = (tableKey: OppgaveTableKey, defaultValue?: string[]) =>
  useUrlQueryParam(`${tableKey}.${ShortParamKey.HJEMLER}`, fromArrayParam, setArrayQuery, defaultValue);

export const useOppgaveTableRegistreringshjemler = (tableKey: OppgaveTableKey, defaultValue?: string[]) =>
  useUrlQueryParam(`${tableKey}.${ShortParamKey.REGISTRERINGSHJEMLER}`, fromArrayParam, setArrayQuery, defaultValue);

export const useOppgaveTableTildelteSaksbehandlere = (tableKey: OppgaveTableKey, defaultValue?: string[]) =>
  useUrlQueryParam(`${tableKey}.${ShortParamKey.TILDELTE_SAKSBEHANDLERE}`, fromArrayParam, setArrayQuery, defaultValue);

export const useOppgaveTableMedunderskrivere = (tableKey: OppgaveTableKey, defaultValue?: string[]) =>
  useUrlQueryParam(`${tableKey}.${ShortParamKey.MEDUNDERSKRIVERE}`, fromArrayParam, setArrayQuery, defaultValue);

export const useOppgaveTableTildelteRol = (tableKey: OppgaveTableKey, defaultValue?: string[]) =>
  useUrlQueryParam(`${tableKey}.${ShortParamKey.TILDELTE_ROL}`, fromArrayParam, setArrayQuery, defaultValue);

export const useOppgaveTablePaaVentReasons = (tableKey: OppgaveTableKey, defaultValue?: string[]) =>
  useUrlQueryParam(`${tableKey}.${ShortParamKey.PAA_VENT_REASONS}`, fromArrayParam, setArrayQuery, defaultValue);

// Helper functions for URL parameter management

const setArrayQuery = (query: URLSearchParams, key: string, value: string[] | undefined) => {
  if (value === undefined || value.length === 0) {
    query.delete(key);
  } else {
    query.set(key, value.join(ARRAY_SEPARATOR));
  }
};

export const fromTyperParam = (value: string | null): SaksTypeEnum[] | undefined =>
  value !== null ? value.split(ARRAY_SEPARATOR).filter(isSaksTypeEnum) : undefined;

export const fromArrayParam = (value: string | null): string[] | undefined =>
  value !== null ? value.split(ARRAY_SEPARATOR) : undefined;

const ARRAY_SEPARATOR = '~';
