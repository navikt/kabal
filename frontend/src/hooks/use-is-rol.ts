import { useContext, useMemo } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useIsRol = () => {
  const { data: oppgave, isSuccess } = useOppgave();
  const isRolWithAnyFlowState = useIsRolWithAnyFlowState();

  return useMemo(() => {
    if (!isSuccess) {
      return false;
    }

    return (
      isRolWithAnyFlowState &&
      (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
      oppgave.rol.flowState !== FlowState.NOT_SENT
    );
  }, [oppgave, isSuccess, isRolWithAnyFlowState]);
};

export const useIsRolWithAnyFlowState = () => {
  const { data: oppgave, isSuccess } = useOppgave();

  const { user } = useContext(StaticDataContext);

  return useMemo(() => {
    if (!isSuccess) {
      return false;
    }

    return (
      (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
      oppgave.rol.employee !== null &&
      oppgave.rol.employee.navIdent === user.navIdent
    );
  }, [oppgave, isSuccess, user]);
};
