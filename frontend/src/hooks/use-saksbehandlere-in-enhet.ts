import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useMemo } from 'react';
import { useGetSaksbehandlereInEnhetQuery } from '../redux-api/oppgaver';
import { IKodeverkValue } from '../types/kodeverk';

export const useSaksbehandlereInEnhet = (enhetId?: string): IKodeverkValue[] => {
  const { data } = useGetSaksbehandlereInEnhetQuery(enhetId ?? skipToken);

  return useMemo<IKodeverkValue[]>(() => {
    if (typeof data === 'undefined') {
      return [];
    }

    return data.saksbehandlere.map<IKodeverkValue>(({ navIdent, navn }) => ({
      navn,
      beskrivelse: navn,
      id: navIdent,
    }));
  }, [data]);
};
