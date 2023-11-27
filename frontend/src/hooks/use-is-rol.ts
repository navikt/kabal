import { useMemo } from 'react';
import { useGetUserQuery } from '@app/redux-api/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsRol = () => {
  const { data: oppgave, isLoading } = useOppgave();

  const { data: userData, isLoading: userIsLoading } = useGetUserQuery();

  return useMemo(() => {
    if (isLoading || userIsLoading || typeof oppgave === 'undefined' || typeof userData === 'undefined') {
      return false;
    }

    return (
      (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
      oppgave.rol.flowState !== FlowState.NOT_SENT &&
      oppgave.rol.navIdent === userData.navIdent
    );
  }, [oppgave, isLoading, userData, userIsLoading]);
};
