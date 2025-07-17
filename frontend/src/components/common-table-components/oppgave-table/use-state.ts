import {
  isShortSortField,
  isShortSortOrder,
  SHORT_TO_SORT_FIELD,
  SHORT_TO_SORT_ORDER,
  ShortParamKey,
} from '@app/components/common-table-components/oppgave-table/compression';
import type { OppgaveTableKey } from '@app/components/common-table-components/oppgave-table/types';
import { isSaksTypeEnum, type SaksTypeEnum } from '@app/types/kodeverk';
import {
  type CommonOppgaverParams,
  type CommonOppgaverParamsKey,
  SortFieldEnum,
  SortOrderEnum,
} from '@app/types/oppgaver';
import { useCallback, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';

export type SetParams = <K extends CommonOppgaverParamsKey>(key: K, paramsUpdate: CommonOppgaverParams[K]) => void;

interface OppgaveTableState {
  params: CommonOppgaverParams;
  setParams: SetParams;
}

export const useOppgaveTableState = (
  tableKey: OppgaveTableKey,
  defaultParams: Partial<CommonOppgaverParams>,
): OppgaveTableState => {
  const [query, setQuery] = useSearchParams();

  // Saksdata
  const [typer, setTyper] = useState<SaksTypeEnum[] | undefined>(
    getTyperParam(query, tableKey) ?? defaultParams.typer ?? DEFAULT_PARAMS.typer,
  );
  const [ytelser, setYtelser] = useState<string[] | undefined>(
    getArrayParam(query, `${tableKey}.${ShortParamKey.YTELSER}`) ?? defaultParams.ytelser ?? DEFAULT_PARAMS.ytelser,
  );
  const [hjemler, setHjemler] = useState<string[] | undefined>(
    getArrayParam(query, `${tableKey}.${ShortParamKey.HJEMLER}`) ?? defaultParams.hjemler ?? DEFAULT_PARAMS.hjemler,
  );
  const [registreringshjemler, setRegistreringshjemler] = useState<string[] | undefined>(
    getArrayParam(query, `${tableKey}.${ShortParamKey.REGISTRERINGSHEMLER}`) ??
      defaultParams.registreringshjemler ??
      DEFAULT_PARAMS.registreringshjemler,
  );

  // Tildeling
  const [tildelteSaksbehandlere, setTildelteSaksbehandlere] = useState<string[] | undefined>(
    getArrayParam(query, `${tableKey}.${ShortParamKey.TILDELTE_SAKSBEHANDLERE}`) ??
      defaultParams.tildelteSaksbehandlere ??
      DEFAULT_PARAMS.tildelteSaksbehandlere,
  );
  const [medunderskrivere, setMedunderskrivere] = useState<string[] | undefined>(
    getArrayParam(query, `${tableKey}.${ShortParamKey.MEDUNDERSKRIVERE}`) ??
      defaultParams.medunderskrivere ??
      DEFAULT_PARAMS.medunderskrivere,
  );
  const [tildelteRol, setTildelteRol] = useState<string[] | undefined>(
    getArrayParam(query, `${tableKey}.${ShortParamKey.TILDELTE_ROL}`) ??
      defaultParams.tildelteRol ??
      DEFAULT_PARAMS.tildelteRol,
  );

  // Sortering
  const [rekkefoelge, setRekkefoelge] = useState<SortOrderEnum>(
    getSortOrderParam(query, tableKey) ?? defaultParams.rekkefoelge ?? DEFAULT_PARAMS.rekkefoelge,
  );
  const [sortering, setSortering] = useState<SortFieldEnum>(
    getSortFieldParam(query, tableKey) ?? defaultParams.sortering ?? DEFAULT_PARAMS.sortering,
  );

  // Ferdigstilt
  const [ferdigstiltFrom, setFerdigstiltFrom] = useState<string | undefined>(
    getStringParam(query, `${tableKey}.${ShortParamKey.FERDIGSTILT_FROM}`) ??
      defaultParams.ferdigstiltFrom ??
      DEFAULT_PARAMS.ferdigstiltFrom,
  );
  const [ferdigstiltTo, setFerdigstiltTo] = useState<string | undefined>(
    getStringParam(query, `${tableKey}.${ShortParamKey.FERDIGSTILT_TO}`) ??
      defaultParams.ferdigstiltTo ??
      DEFAULT_PARAMS.ferdigstiltTo,
  );

  // Returnert
  const [returnertFrom, setReturnertFrom] = useState<string | undefined>(
    getStringParam(query, `${tableKey}.${ShortParamKey.RETURNERT_FROM}`) ??
      defaultParams.returnertFrom ??
      DEFAULT_PARAMS.returnertFrom,
  );
  const [returnertTo, setReturnertTo] = useState<string | undefined>(
    getStringParam(query, `${tableKey}.${ShortParamKey.RETURNERT_TO}`) ??
      defaultParams.returnertTo ??
      DEFAULT_PARAMS.returnertTo,
  );

  // Frist
  const [fristFrom, setFristFrom] = useState<string | undefined>(
    getStringParam(query, `${tableKey}.${ShortParamKey.FRIST_FROM}`) ??
      defaultParams.fristFrom ??
      DEFAULT_PARAMS.fristFrom,
  );
  const [fristTo, setFristTo] = useState<string | undefined>(
    getStringParam(query, `${tableKey}.${ShortParamKey.FRIST_TO}`) ?? defaultParams.fristTo ?? DEFAULT_PARAMS.fristTo,
  );

  // Varslet frist
  const [varsletFristFrom, setVarsletFristFrom] = useState<string | undefined>(
    getStringParam(query, `${tableKey}.${ShortParamKey.VARSLT_FRIST_FROM}`) ??
      defaultParams.varsletFristFrom ??
      DEFAULT_PARAMS.varsletFristFrom,
  );
  const [varsletFristTo, setVarsletFristTo] = useState<string | undefined>(
    getStringParam(query, `${tableKey}.${ShortParamKey.VARSLT_FRIST_TO}`) ??
      defaultParams.varsletFristTo ??
      DEFAULT_PARAMS.varsletFristTo,
  );

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

  const setParams = useCallback(
    <K extends CommonOppgaverParamsKey>(key: K, value: CommonOppgaverParams[K]) => {
      switch (key) {
        case 'typer':
          setTyper(value as SaksTypeEnum[]);
          setArrayQuery(query, `${tableKey}.${ShortParamKey.TYPER}`, value as SaksTypeEnum[]);
          break;
        case 'ytelser':
          setYtelser(value as string[]);
          setArrayQuery(query, `${tableKey}.${ShortParamKey.YTELSER}`, value as string[]);
          break;
        case 'hjemler':
          setHjemler(value as string[]);
          setArrayQuery(query, `${tableKey}.${ShortParamKey.HJEMLER}`, value as string[]);
          break;
        case 'registreringshjemler':
          setRegistreringshjemler(value as string[]);
          setArrayQuery(query, `${tableKey}.${ShortParamKey.REGISTRERINGSHEMLER}`, value as string[]);
          break;
        case 'tildelteSaksbehandlere':
          setTildelteSaksbehandlere(value as string[]);
          setArrayQuery(query, `${tableKey}.${ShortParamKey.TILDELTE_SAKSBEHANDLERE}`, value as string[]);
          break;
        case 'medunderskrivere':
          setMedunderskrivere(value as string[]);
          setArrayQuery(query, `${tableKey}.${ShortParamKey.MEDUNDERSKRIVERE}`, value as string[]);
          break;
        case 'tildelteRol':
          setTildelteRol(value as string[]);
          setArrayQuery(query, `${tableKey}.${ShortParamKey.TILDELTE_ROL}`, value as string[]);
          break;
        case 'rekkefoelge':
          setRekkefoelge(value as SortOrderEnum);
          setStringQuery(query, `${tableKey}.${ShortParamKey.REKKEFOELGE}`, value as SortOrderEnum);
          break;
        case 'sortering':
          setSortering(value as SortFieldEnum);
          setStringQuery(query, `${tableKey}.${ShortParamKey.SORTERING}`, value as SortFieldEnum);
          break;
        case 'ferdigstiltFrom':
          setFerdigstiltFrom(value as string);
          setStringQuery(query, `${tableKey}.${ShortParamKey.FERDIGSTILT_FROM}`, value as string);
          break;
        case 'ferdigstiltTo':
          setFerdigstiltTo(value as string);
          setStringQuery(query, `${tableKey}.${ShortParamKey.FERDIGSTILT_TO}`, value as string);
          break;
        case 'returnertFrom':
          setReturnertFrom(value as string);
          setStringQuery(query, `${tableKey}.${ShortParamKey.RETURNERT_FROM}`, value as string);
          break;
        case 'returnertTo':
          setReturnertTo(value as string);
          setStringQuery(query, `${tableKey}.${ShortParamKey.RETURNERT_TO}`, value as string);
          break;
        case 'fristFrom':
          setFristFrom(value as string);
          setStringQuery(query, `${tableKey}.${ShortParamKey.FRIST_FROM}`, value as string);
          break;
        case 'fristTo':
          setFristTo(value as string);
          setStringQuery(query, `${tableKey}.${ShortParamKey.FRIST_TO}`, value as string);
          break;
        case 'varsletFristFrom':
          setVarsletFristFrom(value as string);
          setStringQuery(query, `${tableKey}.${ShortParamKey.VARSLT_FRIST_FROM}`, value as string);
          break;
        case 'varsletFristTo':
          setVarsletFristTo(value as string);
          setStringQuery(query, `${tableKey}.${ShortParamKey.VARSLT_FRIST_TO}`, value as string);
          break;
      }

      updateUrlQuery(query);
    },
    [query, tableKey, updateUrlQuery],
  );

  return {
    params: {
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
    },
    setParams,
  };
};

const ARRAY_SEPARATOR = '~';

// Getters for URL parameters

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

// Setters for URL parameters

const setArrayQuery = (query: URLSearchParams, key: string, values: string[] | undefined) => {
  if (values !== undefined && values.length > 0) {
    query.set(key, values.join(ARRAY_SEPARATOR));
  } else {
    query.delete(key);
  }
};

const setStringQuery = (query: URLSearchParams, key: string, value: string | undefined) => {
  if (value !== undefined && value.length > 0) {
    query.set(key, value);
  } else {
    query.delete(key);
  }
};

const DEFAULT_PARAMS: CommonOppgaverParams = {
  rekkefoelge: SortOrderEnum.DESC,
  sortering: SortFieldEnum.FRIST,
};
