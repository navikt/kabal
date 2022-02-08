import { useMemo } from 'react';
import { IKodeverkSimpleValue, OppgaveType, Utfall } from '../types/kodeverk';
import { useKodeverkValue } from './use-kodeverk-value';

export const useUtfall = (type?: OppgaveType): IKodeverkSimpleValue<Utfall>[] => {
  const utfall = useKodeverkValue('utfall');

  return useMemo(() => {
    if (typeof utfall === 'undefined' || typeof type === 'undefined') {
      return [];
    }

    if (type === OppgaveType.KLAGE) {
      return utfall;
    }

    return utfall.filter(({ id }) => id !== Utfall.AVVIST);
  }, [type, utfall]);
};
