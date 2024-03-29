import { useContext, useMemo } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsRol = () => {
  const { data: oppgave, isLoading } = useOppgave();

  const { user } = useContext(StaticDataContext);

  return useMemo(() => {
    if (isLoading || oppgave === undefined) {
      return false;
    }

    return (
      (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
      oppgave.rol.employee !== null &&
      oppgave.rol.flowState !== FlowState.NOT_SENT &&
      oppgave.rol.employee.navIdent === user.navIdent
    );
  }, [oppgave, isLoading, user]);
};
