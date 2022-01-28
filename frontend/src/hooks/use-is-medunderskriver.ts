import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useMemo } from 'react';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { useGetMedunderskriverQuery, useGetOppgavebehandlingQuery } from '../redux-api/oppgavebehandling';
import { useOppgave } from './oppgavebehandling/use-oppgave';
import { useOppgaveId } from './use-oppgave-id';

export const useIsMedunderskriver = () => {
  const { data: userData, isLoading } = useGetBrukerQuery();
  const { data: oppgave } = useOppgave();

  return useMemo(() => {
    if (typeof oppgave === 'undefined' || isLoading || typeof userData === 'undefined') {
      return false;
    }

    return oppgave.medunderskriver?.navIdent === userData.info.navIdent;
  }, [oppgave, userData, isLoading]);
};

export const useCheckIsMedunderskriver = () => {
  const oppgaveId = useOppgaveId();
  const { data: userData, isLoading } = useGetBrukerQuery();
  const { data: oppgave } = useGetOppgavebehandlingQuery(oppgaveId);
  const { data: medunderskriver } = useGetMedunderskriverQuery(typeof oppgave === 'undefined' ? skipToken : oppgaveId);

  return useMemo(() => {
    if (isLoading || typeof userData === 'undefined') {
      return false;
    }

    return medunderskriver?.medunderskriver?.navIdent === userData.info.navIdent;
  }, [medunderskriver?.medunderskriver?.navIdent, userData, isLoading]);
};
