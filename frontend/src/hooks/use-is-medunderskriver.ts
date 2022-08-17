import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useMemo } from 'react';
import { useGetMedunderskriverQuery, useGetOppgavebehandlingQuery } from '../redux-api/oppgaver/queries/behandling';
import { useUser } from '../simple-api-state/use-user';
import { useOppgave } from './oppgavebehandling/use-oppgave';
import { useOppgaveId } from './oppgavebehandling/use-oppgave-id';

export const useIsMedunderskriver = () => {
  const { data: userData, isLoading } = useUser();
  const { data: oppgave } = useOppgave();

  return useMemo(() => {
    if (typeof oppgave === 'undefined' || isLoading || typeof userData === 'undefined') {
      return false;
    }

    return oppgave.medunderskriver?.navIdent === userData.navIdent;
  }, [oppgave, userData, isLoading]);
};

export const useCheckIsMedunderskriver = () => {
  const oppgaveId = useOppgaveId();
  const { data: userData, isLoading } = useUser();
  const { data: oppgave } = useGetOppgavebehandlingQuery(oppgaveId);
  const { data: medunderskriver } = useGetMedunderskriverQuery(typeof oppgave === 'undefined' ? skipToken : oppgaveId);

  return useMemo(() => {
    if (isLoading || typeof userData === 'undefined') {
      return false;
    }

    return medunderskriver?.medunderskriver?.navIdent === userData.navIdent;
  }, [medunderskriver?.medunderskriver?.navIdent, userData, isLoading]);
};
