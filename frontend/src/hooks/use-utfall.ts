import { useMemo } from 'react';
import { IKodeverkSimpleValue, OppgaveType, Utfall } from '../types/kodeverk';
import { useKodeverkValue } from './use-kodeverk-value';

export const useUtfall = (type: OppgaveType): IKodeverkSimpleValue<Utfall>[] => {
  const utfall = useKodeverkValue('utfall');

  return useMemo(() => {
    if (typeof utfall === 'undefined') {
      return [];
    }

    if (type === OppgaveType.KLAGEBEHANDLING) {
      return utfall;
    }

    return utfall.filter(({ id }) => id !== Utfall.AVVIST);
  }, [type, utfall]);
};
