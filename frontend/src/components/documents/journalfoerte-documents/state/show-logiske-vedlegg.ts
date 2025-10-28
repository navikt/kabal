import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useJsonSetting } from '@app/hooks/settings/helpers';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback } from 'react';

type Value = readonly string[];

const INITIAL_ID_LIST: Value = [];

const KEY_PREFIX = 'journalførte-dokumenter/logiske-vedlegg';

export const useShowLogiskeVedlegg = () => {
  const oppgaveId = useOppgaveId();

  if (oppgaveId === skipToken) {
    throw new Error('useShowLogiskeVedlegg must be used within an oppgave context');
  }

  const { value = INITIAL_ID_LIST, ...rest } = useJsonSetting<readonly string[]>(`${KEY_PREFIX}/${oppgaveId}`);

  return { value, ...rest };
};

export const useResetShowLogiskeVedlegg = () => {
  const { setValue } = useShowLogiskeVedlegg();

  return useCallback(() => setValue(INITIAL_ID_LIST), [setValue]);
};
