import { useMemo } from 'react';
import { useGetBrukerQuery } from '../redux-api/bruker';
import { useGetMedunderskriverQuery } from '../redux-api/oppgavebehandling';
import { useOppgave } from './oppgavebehandling/use-oppgave';
import { useOppgaveId } from './use-oppgave-id';
import { useOppgaveType } from './use-oppgave-type';

export const useIsMedunderskriver = () => {
  const { data: userData, isLoading } = useGetBrukerQuery();
  const { data: oppgavebehandling } = useOppgave();

  return useMemo(() => {
    if (typeof oppgavebehandling === 'undefined' || isLoading || typeof userData === 'undefined') {
      return false;
    }

    return oppgavebehandling.medunderskriver?.navIdent === userData.info.navIdent;
  }, [oppgavebehandling, userData, isLoading]);
};

export const useCheckIsMedunderskriver = () => {
  const oppgaveId = useOppgaveId();
  const { data: userData, isLoading } = useGetBrukerQuery();
  const type = useOppgaveType();
  const { data: medunderskriver } = useGetMedunderskriverQuery({ oppgaveId, type });

  return useMemo(() => {
    if (isLoading || typeof userData === 'undefined') {
      return false;
    }

    return medunderskriver?.medunderskriver?.navIdent === userData.info.navIdent;
  }, [medunderskriver?.medunderskriver?.navIdent, userData, isLoading]);
};
