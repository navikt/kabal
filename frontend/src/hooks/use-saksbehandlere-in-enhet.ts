import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useMemo } from 'react';
import { useGetSaksbehandlereInEnhetQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { IKodeverkSimpleValue } from '@app/types/kodeverk';

export const useSaksbehandlereInEnhet = (enhetId: string | typeof skipToken = skipToken): IKodeverkSimpleValue[] => {
  const { data } = useGetSaksbehandlereInEnhetQuery(enhetId);

  return useMemo<IKodeverkSimpleValue[]>(() => {
    if (typeof data === 'undefined') {
      return [];
    }

    return data.saksbehandlere.map<IKodeverkSimpleValue>(({ navIdent, navn }) => ({
      navn,
      id: navIdent,
    }));
  }, [data]);
};
