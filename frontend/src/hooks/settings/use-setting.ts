import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IShownDocument } from '@app/components/show-document/types';
import { useUser } from '@app/simple-api-state/use-user';
import { Journalposttype } from '@app/types/arkiverte-documents';
import { useOppgaveId } from '../oppgavebehandling/use-oppgave-id';
import { SETTINGS_MANAGER } from './manager';

interface Setting<T = string> {
  value: T | undefined;
  setValue: (value: T) => void;
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

  const setValue = (newValue: string) => {
    if (key !== null) {
      SETTINGS_MANAGER.set(key, newValue);
    }
  };

  const remove = () => {
    if (key !== null) {
      SETTINGS_MANAGER.remove(key);
    }
  };

  return { value, setValue, remove, isLoading };
};

const useBooleanSetting = (property: string): Setting<boolean> => {
  const { value, setValue, ...rest } = useSetting(property);

  return {
    value: value === undefined ? undefined : value === 'true',
    setValue: (newValue: boolean) => setValue(newValue ? 'true' : 'false'),
    ...rest,
  };
};

const useNumberSetting = (property: string): Setting<number> => {
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
    setValue: (newValue: number) => setValue(newValue.toString(10)),
    ...rest,
  };
};

const useJsonSetting = <T>(property: string): Setting<T> => {
  const { value, setValue, ...rest } = useSetting(property);

  return {
    value: value === undefined ? undefined : (JSON.parse(value) as T),
    setValue: (newValue: T) => setValue(JSON.stringify(newValue)),
    ...rest,
  };
};

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
export const useDocumentsPdfViewed = () => useJsonSetting<IShownDocument>(useOppgavePath('tabs/documents/pdf/viewed'));
export const useDocumentsPdfWidth = () => useNumberSetting(useOppgavePath('tabs/documents/pdf/width'));
export const useDocumentsExpanded = () => useBooleanSetting(useOppgavePath('tabs/documents/expanded'));

// Oppgavebehandling documents filters
export const useDocumentsFilterTema = () => useJsonSetting<string[]>(useOppgavePath('tabs/documents/filters/tema'));

export const useDocumentsFilterDato = () => {
  const { value, ...rest } = useJsonSetting<[string, string]>(useOppgavePath('tabs/documents/filters/dato'));

  return {
    ...rest,
    value: Array.isArray(value) && value.length === 2 && value.every((v) => typeof v === 'string') ? value : undefined,
  };
};

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

// Oppgavebehandling smart editor
export const useSmartEditorActiveDocument = () => useSetting(useOppgavePath('tabs/smart-editor/active_document'));
export const useSmartEditorGodeFormuleringerOpen = () =>
  useBooleanSetting(useOppgavePath('tabs/smart-editor/gode_formuleringer_open'));
