import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useMemo } from 'react';
import { IKodeverkVerdi } from '../redux-api/kodeverk';
import { useGetSaksbehandlereInEnhetQuery } from '../redux-api/oppgaver';

export const useSaksbehandlereInEnhet = (enhetId?: string): IKodeverkVerdi[] => {
  const { data } = useGetSaksbehandlereInEnhetQuery(enhetId ?? skipToken);

  return useMemo<IKodeverkVerdi[]>(() => {
    if (typeof data === 'undefined') {
      return [];
    }

    return data.saksbehandlere.map<IKodeverkVerdi>(({ navIdent, navn }) => ({
      navn,
      beskrivelse: navn,
      id: navIdent,
    }));
  }, [data]);
};
