import { useMemo } from 'react';
import { IKodeverkSimpleValue, OppgaveType, Utfall } from '../types/kodeverk';
import { useKodeverkValue } from './use-kodeverk-value';

export const useUtfall = (type?: OppgaveType): [IKodeverkSimpleValue<Utfall>[], boolean] => {
  const sakstyperToUtfall = useKodeverkValue('sakstyperToUtfall');

  return useMemo(() => {
    if (typeof sakstyperToUtfall === 'undefined' || typeof type === 'undefined') {
      return [[], true];
    }

    const utfall = sakstyperToUtfall.find(({ id }) => id === type)?.utfall ?? [];

    return [utfall, false];
  }, [sakstyperToUtfall, type]);
};
