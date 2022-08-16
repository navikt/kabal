import { useMemo } from 'react';
import { IKodeverkSimpleValue, OppgaveType, Utfall } from '../types/kodeverk';
import { useKodeverkValue } from './use-kodeverk-value';

export const useUtfall = (type?: OppgaveType): [IKodeverkSimpleValue<Utfall>[], boolean] => {
  const utfall = useKodeverkValue('utfall');

  return useMemo(() => {
    if (typeof utfall === 'undefined' || typeof type === 'undefined') {
      return [[], true];
    }

    if (type === OppgaveType.ANKE_I_TRYGDERETTEN) {
      return [utfall.filter(({ id }) => !(id === Utfall.UGUNST || id === Utfall.RETUR)), false];
    }

    return [
      utfall.filter(
        ({ id }) =>
          !(id === Utfall.HENVISES || id === Utfall.MEDHOLD_I_TRYGDERETTEN || id === Utfall.MEDHOLD_I_KLAGEINSTANSEN)
      ),
      false,
    ];
  }, [type, utfall]);
};
