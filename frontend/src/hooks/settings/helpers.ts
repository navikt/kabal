import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { useOppgaveId } from '../oppgavebehandling/use-oppgave-id';
import { SETTINGS_MANAGER } from './manager';

type SetterFn<T> = (oldValue: T | undefined) => T;

export interface Setting<T = string, D = undefined> {
  value: T | D;
  setValue: (value: T | SetterFn<T>) => void;
  remove: () => void;
}

export const useSetting = (property: string, syncBetweenTabs: boolean = false): Setting => {
  const { user } = useContext(StaticDataContext);

  const key = `${user.navIdent}/${property}`;

  const getSnapshot = useCallback(() => SETTINGS_MANAGER.get(key), [key]);

  const [value, subscribe] = useState<string | undefined>(getSnapshot);

  useEffect(() => {
    if (key === null) {
      return;
    }

    if (syncBetweenTabs) {
      SETTINGS_MANAGER.enableSync(key);
    } else {
      SETTINGS_MANAGER.disableSync(key);
    }
  }, [key, syncBetweenTabs]);

  useEffect(() => {
    if (key === null) {
      return;
    }

    return SETTINGS_MANAGER.subscribe(key, subscribe);
  }, [key, subscribe]);

  const setValue = useCallback(
    (newValue: string | ((oldValue: string | undefined) => string)) => {
      if (key !== null) {
        SETTINGS_MANAGER.set(key, typeof newValue === 'string' ? newValue : newValue(value));
      }
    },
    [key, value],
  );

  const remove = useCallback(() => {
    if (key !== null) {
      SETTINGS_MANAGER.remove(key);
    }
  }, [key]);

  return { value, setValue, remove };
};

const booleanToString = (value: boolean): string => (value ? 'true' : 'false');

export const useBooleanSetting = (property: string): Setting<boolean> => {
  const { value, setValue, ...rest } = useSetting(property);

  const parsedValue = value === undefined ? undefined : value === 'true';

  return {
    value: parsedValue,
    setValue: (newValue) => setValue(booleanToString(typeof newValue === 'boolean' ? newValue : newValue(parsedValue))),
    ...rest,
  };
};

export const useNumberSetting = (property: string): Setting<number> => {
  const { value, setValue, remove } = useSetting(property);

  const parsedValue = useMemo(() => {
    if (value === undefined) {
      return undefined;
    }

    const parsed = Number.parseInt(value, 10);

    return Number.isNaN(parsed) ? undefined : parsed;
  }, [value]);

  const _setValue = useCallback(
    (newValue: number | SetterFn<number>) => {
      if (typeof newValue === 'number') {
        setValue(newValue.toString(10));
      } else {
        setValue((oldValue) => {
          const parsed = oldValue === undefined ? undefined : Number.parseInt(oldValue, 10);

          return newValue(Number.isNaN(parsed) ? undefined : parsed).toString(10);
        });
      }
    },
    [setValue],
  );

  return useMemo(() => ({ value: parsedValue, setValue: _setValue, remove }), [_setValue, parsedValue, remove]);
};

export const useJsonSetting = <T>(property: string): Setting<T> => {
  const { value, setValue, ...rest } = useSetting(property);

  const parsedValue = useMemo(() => (value === undefined ? undefined : (JSON.parse(value) as T)), [value]);

  return {
    value: parsedValue,
    setValue: (newValue) => setValue(JSON.stringify(isFunction(newValue) ? newValue(parsedValue) : newValue)),
    ...rest,
  };
};

const isFunction = <T>(value: T | SetterFn<T>): value is SetterFn<T> => typeof value === 'function';

export const useOppgavePath = (property: string): string => {
  const oppgaveId = useOppgaveId();

  if (oppgaveId === skipToken) {
    throw new Error('Cannot use useOppgavePath outside of oppgave context');
  }

  return `oppgaver/${oppgaveId}/${property}`;
};
