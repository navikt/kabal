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

// Utility functions for URL query management
const useUrlQueryManager = () => {
  const [query, setQuery] = useSearchParams();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const updateUrlQuery = useCallback(
    (query: URLSearchParams) => {
      if (debounceTimeout.current !== null) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        setQuery(query, { preventScrollReset: true, replace: true });
        debounceTimeout.current = null;
      }, 300);
    },
    [setQuery],
  );

  return { query, updateUrlQuery };
};

// Individual hooks for each parameter

export const useOppgaveTableTyper = (tableKey: OppgaveTableKey, defaultValue?: SaksTypeEnum[]) => {
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [typer, setTyper] = useState<SaksTypeEnum[] | undefined>(
    getTyperParam(query, tableKey) ?? defaultValue ?? DEFAULT_PARAMS.typer,
  );

  const setTyperWithQuery = useCallback(
    (value: SaksTypeEnum[] | undefined) => {
      setTyper(value);
      updateUrlQuery(setArrayQuery(query, `${tableKey}.${ShortParamKey.TYPER}`, value));
    },
    [query, tableKey, updateUrlQuery],
  );

  return [typer, setTyperWithQuery] as const;
};

export const useOppgaveTableYtelser = (tableKey: OppgaveTableKey, defaultValue?: string[]) => {
  const key = `${tableKey}.${ShortParamKey.YTELSER}`;
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [ytelser, setYtelser] = useState<string[] | undefined>(
    getArrayParam(query, key) ?? defaultValue ?? DEFAULT_PARAMS.ytelser,
  );

  const setYtelserWithQuery = useCallback(
    (value: string[] | undefined) => {
      setYtelser(value);
      updateUrlQuery(setArrayQuery(query, key, value));
    },
    [query, key, updateUrlQuery],
  );

  return [ytelser, setYtelserWithQuery] as const;
};

export const useOppgaveTableHjemler = (tableKey: OppgaveTableKey, defaultValue?: string[]) => {
  const key = `${tableKey}.${ShortParamKey.HJEMLER}`;
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [hjemler, setHjemler] = useState<string[] | undefined>(
    getArrayParam(query, key) ?? defaultValue ?? DEFAULT_PARAMS.hjemler,
  );

  const setHjemlerWithQuery = useCallback(
    (value: string[] | undefined) => {
      setHjemler(value);
      updateUrlQuery(setArrayQuery(query, key, value));
    },
    [query, key, updateUrlQuery],
  );

  return [hjemler, setHjemlerWithQuery] as const;
};

export const useOppgaveTableRegistreringshjemler = (tableKey: OppgaveTableKey, defaultValue?: string[]) => {
  const key = `${tableKey}.${ShortParamKey.REGISTRERINGSHEMLER}`;
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [registreringshjemler, setRegistreringshjemler] = useState<string[] | undefined>(
    getArrayParam(query, key) ?? defaultValue ?? DEFAULT_PARAMS.registreringshjemler,
  );

  const setRegistreringshjemlerWithQuery = useCallback(
    (value: string[] | undefined) => {
      setRegistreringshjemler(value);
      updateUrlQuery(setArrayQuery(query, key, value));
    },
    [query, key, updateUrlQuery],
  );

  return [registreringshjemler, setRegistreringshjemlerWithQuery] as const;
};

export const useOppgaveTableTildelteSaksbehandlere = (tableKey: OppgaveTableKey, defaultValue?: string[]) => {
  const key = `${tableKey}.${ShortParamKey.TILDELTE_SAKSBEHANDLERE}`;
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [tildelteSaksbehandlere, setTildelteSaksbehandlere] = useState<string[] | undefined>(
    getArrayParam(query, key) ?? defaultValue ?? DEFAULT_PARAMS.tildelteSaksbehandlere,
  );

  const setTildelteSaksbehandlereWithQuery = useCallback(
    (value: string[] | undefined) => {
      setTildelteSaksbehandlere(value);
      updateUrlQuery(setArrayQuery(query, key, value));
    },
    [query, key, updateUrlQuery],
  );

  return [tildelteSaksbehandlere, setTildelteSaksbehandlereWithQuery] as const;
};

export const useOppgaveTableMedunderskrivere = (tableKey: OppgaveTableKey, defaultValue?: string[]) => {
  const key = `${tableKey}.${ShortParamKey.MEDUNDERSKRIVERE}`;
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [medunderskrivere, setMedunderskrivere] = useState<string[] | undefined>(
    getArrayParam(query, key) ?? defaultValue ?? DEFAULT_PARAMS.medunderskrivere,
  );

  const setMedunderskrivereWithQuery = useCallback(
    (value: string[] | undefined) => {
      setMedunderskrivere(value);
      updateUrlQuery(setArrayQuery(query, key, value));
    },
    [query, key, updateUrlQuery],
  );

  return [medunderskrivere, setMedunderskrivereWithQuery] as const;
};

export const useOppgaveTableTildelteRol = (tableKey: OppgaveTableKey, defaultValue?: string[]) => {
  const key = `${tableKey}.${ShortParamKey.TILDELTE_ROL}`;
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [tildelteRol, setTildelteRol] = useState<string[] | undefined>(
    getArrayParam(query, key) ?? defaultValue ?? DEFAULT_PARAMS.tildelteRol,
  );

  const setTildelteRolWithQuery = useCallback(
    (value: string[] | undefined) => {
      setTildelteRol(value);
      updateUrlQuery(setArrayQuery(query, key, value));
    },
    [query, key, updateUrlQuery],
  );

  return [tildelteRol, setTildelteRolWithQuery] as const;
};

export const useOppgaveTableSortering = (tableKey: OppgaveTableKey, defaultValue?: SortFieldEnum) => {
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [sortering, setSortering] = useState<SortFieldEnum>(
    getSortFieldParam(query, tableKey) ?? defaultValue ?? DEFAULT_PARAMS.sortering,
  );

  const setSorteringWithQuery = useCallback(
    (value: SortFieldEnum) => {
      setSortering(value);
      updateUrlQuery(setStringQuery(query, `${tableKey}.${ShortParamKey.SORTERING}`, value));
    },
    [query, tableKey, updateUrlQuery],
  );

  return [sortering, setSorteringWithQuery] as const;
};

export const useOppgaveTableRekkefoelge = (tableKey: OppgaveTableKey, defaultValue?: SortOrderEnum) => {
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [rekkefoelge, setRekkefoelge] = useState<SortOrderEnum>(
    getSortOrderParam(query, tableKey) ?? defaultValue ?? DEFAULT_PARAMS.rekkefoelge,
  );

  const setRekkefoelgeWithQuery = useCallback(
    (value: SortOrderEnum) => {
      setRekkefoelge(value);
      updateUrlQuery(setStringQuery(query, `${tableKey}.${ShortParamKey.REKKEFOELGE}`, value));
    },
    [query, tableKey, updateUrlQuery],
  );

  return [rekkefoelge, setRekkefoelgeWithQuery] as const;
};

export const useOppgaveTableFerdigstiltFrom = (tableKey: OppgaveTableKey, defaultValue?: string) => {
  const key = `${tableKey}.${ShortParamKey.FERDIGSTILT_FROM}`;
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [ferdigstiltFrom, setFerdigstiltFrom] = useState<string | undefined>(
    getStringParam(query, key) ?? defaultValue ?? DEFAULT_PARAMS.ferdigstiltFrom,
  );

  const setFerdigstiltFromWithQuery = useCallback(
    (value: string | undefined) => {
      setFerdigstiltFrom(value);
      updateUrlQuery(setStringQuery(query, key, value));
    },
    [query, key, updateUrlQuery],
  );

  return [ferdigstiltFrom, setFerdigstiltFromWithQuery] as const;
};

export const useOppgaveTableFerdigstiltTo = (tableKey: OppgaveTableKey, defaultValue?: string) => {
  const key = `${tableKey}.${ShortParamKey.FERDIGSTILT_TO}`;
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [ferdigstiltTo, setFerdigstiltTo] = useState<string | undefined>(
    getStringParam(query, key) ?? defaultValue ?? DEFAULT_PARAMS.ferdigstiltTo,
  );

  const setFerdigstiltToWithQuery = useCallback(
    (value: string | undefined) => {
      setFerdigstiltTo(value);
      updateUrlQuery(setStringQuery(query, key, value));
    },
    [query, key, updateUrlQuery],
  );

  return [ferdigstiltTo, setFerdigstiltToWithQuery] as const;
};

export const useOppgaveTableReturnertFrom = (tableKey: OppgaveTableKey, defaultValue?: string) => {
  const key = `${tableKey}.${ShortParamKey.RETURNERT_FROM}`;
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [returnertFrom, setReturnertFrom] = useState<string | undefined>(
    getStringParam(query, key) ?? defaultValue ?? DEFAULT_PARAMS.returnertFrom,
  );

  const setReturnertFromWithQuery = useCallback(
    (value: string | undefined) => {
      setReturnertFrom(value);
      updateUrlQuery(setStringQuery(query, key, value));
    },
    [query, key, updateUrlQuery],
  );

  return [returnertFrom, setReturnertFromWithQuery] as const;
};

export const useOppgaveTableReturnertTo = (tableKey: OppgaveTableKey, defaultValue?: string) => {
  const key = `${tableKey}.${ShortParamKey.RETURNERT_TO}`;
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [returnertTo, setReturnertTo] = useState<string | undefined>(
    getStringParam(query, key) ?? defaultValue ?? DEFAULT_PARAMS.returnertTo,
  );

  const setReturnertToWithQuery = useCallback(
    (value: string | undefined) => {
      setReturnertTo(value);
      updateUrlQuery(setStringQuery(query, key, value));
    },
    [query, key, updateUrlQuery],
  );

  return [returnertTo, setReturnertToWithQuery] as const;
};

export const useOppgaveTableFristFrom = (tableKey: OppgaveTableKey, defaultValue?: string) => {
  const key = `${tableKey}.${ShortParamKey.FRIST_FROM}`;
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [fristFrom, setFristFrom] = useState<string | undefined>(
    getStringParam(query, key) ?? defaultValue ?? DEFAULT_PARAMS.fristFrom,
  );

  const setFristFromWithQuery = useCallback(
    (value: string | undefined) => {
      setFristFrom(value);
      updateUrlQuery(setStringQuery(query, key, value));
    },
    [query, key, updateUrlQuery],
  );

  return [fristFrom, setFristFromWithQuery] as const;
};

export const useOppgaveTableFristTo = (tableKey: OppgaveTableKey, defaultValue?: string) => {
  const key = `${tableKey}.${ShortParamKey.FRIST_TO}`;
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [fristTo, setFristTo] = useState<string | undefined>(
    getStringParam(query, key) ?? defaultValue ?? DEFAULT_PARAMS.fristTo,
  );

  const setFristToWithQuery = useCallback(
    (value: string | undefined) => {
      setFristTo(value);
      updateUrlQuery(setStringQuery(query, key, value));
    },
    [query, key, updateUrlQuery],
  );

  return [fristTo, setFristToWithQuery] as const;
};

export const useOppgaveTableVarsletFristFrom = (tableKey: OppgaveTableKey, defaultValue?: string) => {
  const key = `${tableKey}.${ShortParamKey.VARSLT_FRIST_FROM}`;
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [varsletFristFrom, setVarsletFristFrom] = useState<string | undefined>(
    getStringParam(query, key) ?? defaultValue ?? DEFAULT_PARAMS.varsletFristFrom,
  );

  const setVarsletFristFromWithQuery = useCallback(
    (value: string | undefined) => {
      setVarsletFristFrom(value);
      updateUrlQuery(setStringQuery(query, key, value));
    },
    [query, key, updateUrlQuery],
  );

  return [varsletFristFrom, setVarsletFristFromWithQuery] as const;
};

export const useOppgaveTableVarsletFristTo = (tableKey: OppgaveTableKey, defaultValue?: string) => {
  const key = `${tableKey}.${ShortParamKey.VARSLT_FRIST_TO}`;
  const { query, updateUrlQuery } = useUrlQueryManager();
  const [varsletFristTo, setVarsletFristTo] = useState<string | undefined>(
    getStringParam(query, key) ?? defaultValue ?? DEFAULT_PARAMS.varsletFristTo,
  );

  const setVarsletFristToWithQuery = useCallback(
    (value: string | undefined) => {
      setVarsletFristTo(value);
      updateUrlQuery(setStringQuery(query, key, value));
    },
    [query, key, updateUrlQuery],
  );

  return [varsletFristTo, setVarsletFristToWithQuery] as const;
};

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
