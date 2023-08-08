import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IShownDocument } from '@app/components/view-pdf/types';
import { useUser } from '@app/simple-api-state/use-user';
import { Journalposttype } from '@app/types/arkiverte-documents';
import { useOppgaveId } from '../oppgavebehandling/use-oppgave-id';
import { SETTINGS_MANAGER } from './manager';

type SetterFn<T> = (oldValue: T | undefined) => T;

interface Setting<T = string, D = undefined> {
  value: T | D;
  setValue: (value: T | SetterFn<T>) => void;
  remove: () => void;
  isLoading: boolean;
}

const useSetting = (property: string): Setting => {
  const { data, isLoading } = useUser();

  const key = useMemo(() => {
    if (isLoading || data === undefined) {
      return null;
    }

    return `${data.navIdent}/${property}`;
  }, [data, isLoading, property]);

  const getSnapshot = useCallback(() => SETTINGS_MANAGER.get(key), [key]);

  const [value, subscribe] = useState<string | undefined>(getSnapshot);

  useEffect(() => {
    if (key === null) {
      return;
    }

    return SETTINGS_MANAGER.subscribe(key, subscribe);
  }, [key, subscribe]);

  const setValue = (newValue: string | ((oldValue: string | undefined) => string)) => {
    if (key !== null) {
      SETTINGS_MANAGER.set(key, typeof newValue === 'string' ? newValue : newValue(value));
    }
  };

  const remove = useCallback(() => {
    if (key !== null) {
      SETTINGS_MANAGER.remove(key);
    }
  }, [key]);

  return { value, setValue, remove, isLoading };
};

const booleanToString = (value: boolean): string => (value ? 'true' : 'false');

const useBooleanSetting = (property: string): Setting<boolean> => {
  const { value, setValue, ...rest } = useSetting(property);

  const parsedValue = value === undefined ? undefined : value === 'true';

  return {
    value: parsedValue,
    setValue: (newValue) => setValue(booleanToString(typeof newValue === 'boolean' ? newValue : newValue(parsedValue))),
    ...rest,
  };
};

export const useNumberSetting = (property: string): Setting<number> => {
  const { value, setValue, ...rest } = useSetting(property);

  const parsedValue = useMemo(() => {
    if (value === undefined) {
      return undefined;
    }

    const parsed = Number.parseInt(value, 10);

    return Number.isNaN(parsed) ? undefined : parsed;
  }, [value]);

  return {
    value: parsedValue,
    setValue: (newValue) =>
      setValue(typeof newValue === 'number' ? newValue.toString(10) : newValue(parsedValue).toString(10)),
    ...rest,
  };
};

const useJsonSetting = <T>(property: string): Setting<T> => {
  const { value, setValue, ...rest } = useSetting(property);

  const parsedValue = useMemo(() => (value === undefined ? undefined : (JSON.parse(value) as T)), [value]);

  return {
    value: parsedValue,
    setValue: (newValue) => setValue(JSON.stringify(isFunction(newValue) ? newValue(parsedValue) : newValue)),
    ...rest,
  };
};

const isFunction = <T>(value: T | SetterFn<T>): value is SetterFn<T> => typeof value === 'function';

const useOppgavePath = (property: string): string => {
  const oppgaveId = useOppgaveId();

  if (oppgaveId === skipToken) {
    throw new Error('Cannot use useOppgavePath outside of oppgave context');
  }

  return `oppgaver/${oppgaveId}/${property}`;
};

// Oppgavebehandling tabs
export const useDocumentsEnabled = () => useBooleanSetting(useOppgavePath('tabs/documents/enabled'));
export const useBehandlingEnabled = () => useBooleanSetting(useOppgavePath('tabs/behandling/enabled'));
export const useSmartEditorEnabled = () => useBooleanSetting(useOppgavePath('tabs/smart-editor/enabled'));
export const useKvalitetsvurderingEnabled = () => useBooleanSetting(useOppgavePath('tabs/kvalitetsvurdering/enabled'));

// Oppgavebehandling documents
export const useDocumentsPdfViewed = () => {
  const { value = [], ...rest } = useJsonSetting<IShownDocument[]>(useOppgavePath('tabs/documents/pdf/viewed'));

  const values = Array.isArray(value) ? value : [value];

  return { value: values, ...rest };
};
export const useDocumentsPdfWidth = () => useNumberSetting(useOppgavePath('tabs/documents/pdf/width'));
export const useDocumentsExpanded = () => useBooleanSetting(useOppgavePath('tabs/documents/expanded'));

// Oppgavebehandling documents filters
export const useDocumentsFilterTema = () => useJsonSetting<string[]>(useOppgavePath('tabs/documents/filters/tema'));

type DateRangeSetting = [string | null, string | null];
const EMPTY_DATE_RANGE: [null, null] = [null, null];

const useDateRangeSetting = (property: string): Setting<DateRangeSetting, DateRangeSetting> => {
  const { value = EMPTY_DATE_RANGE, ...rest } = useJsonSetting<DateRangeSetting>(property);

  return { ...rest, value };
};

export const useDocumentsFilterDato = () => useDateRangeSetting(useOppgavePath('tabs/documents/filters/dato'));

export const useDocumentsAvsenderMottaker = () =>
  useJsonSetting<string[]>(useOppgavePath('tabs/documents/filters/avsender_mottaker'));

const JOURNALPOSTTYPE_LIST = Object.values(Journalposttype);

export const useDocumentsFilterType = () => {
  const { value, ...rest } = useJsonSetting<Journalposttype[]>(useOppgavePath('tabs/documents/filters/type'));

  return {
    ...rest,
    value: Array.isArray(value) ? value.filter((v) => JOURNALPOSTTYPE_LIST.includes(v)) : undefined,
  };
};

export const useDocumentsFilterTitle = () => useSetting(useOppgavePath('tabs/documents/filters/title'));

export const useDocumentsFilterSaksId = () => useJsonSetting<string[]>(useOppgavePath('tabs/documents/filters/saksid'));

export const useDocumentsOnlyIncluded = () => useBooleanSetting(useOppgavePath('tabs/documents/filters/included'));
// Oppgavebehandling smart editor
export const useSmartEditorActiveDocument = () => useSetting(useOppgavePath('tabs/smart-editor/active_document'));
export const useSmartEditorGodeFormuleringerOpen = () =>
  useBooleanSetting(useOppgavePath('tabs/smart-editor/gode_formuleringer_open'));

export enum TableRowsPerPage {
  LEDIGE = 'oppgaver/ledige/rows_per_page',
  MINE_UFERDIGE = 'oppgaver/mine_uferdige/rows_per_page',
  MINE_FERDIGE = 'oppgaver/mine_ferdige/rows_per_page',
  MINE_VENTENDE = 'oppgaver/mine_ventende/rows_per_page',
  ENHETENS_UFERDIGE = 'oppgaver/enhetens_uferdige/rows_per_page',
  ENHETENS_VENTENDE = 'oppgaver/enhetens_ventende/rows_per_page',
  ENHETENS_FERDIGE = 'oppgaver/enhetens_ferdige/rows_per_page',
  SEARCH_ACTIVE = 'oppgaver/search_active/rows_per_page',
  SEARCH_DONE = 'oppgaver/search_done/rows_per_page',
  SEARCH_FEILREGISTRERTE = 'oppgaver/search_feilregistrerte/rows_per_page',
  SEARCH_PAA_VENT = 'oppgaver/search_paa_vent/rows_per_page',

  DOCUMENTS = 'documents/rows_per_page',
}
