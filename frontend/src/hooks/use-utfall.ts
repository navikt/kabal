import { useMemo } from 'react';
import { IKodeverkSimpleValue, OppgaveType, Utfall } from '../types/kodeverk';
import { useKodeverkValue } from './use-kodeverk-value';

export const useUtfall = (type?: OppgaveType): [IKodeverkSimpleValue<Utfall>[], boolean] => {
  const utfall = useKodeverkValue('utfall');

  return useMemo(() => {
    if (typeof utfall === 'undefined' || typeof type === 'undefined') {
      return [[], true];
    }

    if (type === OppgaveType.KLAGE) {
      return [utfall, false];
    }

    if (type === OppgaveType.ANKE) {
      return [utfall.filter(({ id }) => id !== Utfall.AVVIST), false];
    }

    return [utfall.filter(({ id }) => !(id === Utfall.UGUNST || id === Utfall.RETUR)), false];
  }, [type, utfall]);
};
