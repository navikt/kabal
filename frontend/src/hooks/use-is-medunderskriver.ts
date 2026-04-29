import { useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { FlowState, type MuFlowState } from '@/types/oppgave-common';

const useLazyIsAssignedMedunderskriverAndSent = () => {
  const isAssignedMedunderskriver = useIsAssignedMedunderskriver();
  const isSentToMedunderskriver = useIsSentToMedunderskriver();

  return () => isAssignedMedunderskriver && isSentToMedunderskriver;
};

export const useIsAssignedMedunderskriverAndSent = () => {
  const isLazyAssignedMedunderskriverAndSent = useLazyIsAssignedMedunderskriverAndSent();

  return isLazyAssignedMedunderskriverAndSent();
};

const useLazyIsAssignedMedunderskriver = () => {
  const { user } = useContext(StaticDataContext);
  const { data, isSuccess } = useOppgave();

  return () => isSuccess && data.medunderskriver.employee?.navIdent === user.navIdent;
};

export const useIsAssignedMedunderskriver = () => {
  const isLazyAssignedMedunderskriver = useLazyIsAssignedMedunderskriver();

  return isLazyAssignedMedunderskriver();
};

const useLazyIsSentToMedunderskriver = () => {
  const { data, isSuccess } = useOppgave();

  return () => isSuccess && getIsSentToMedunderskriver(data.medunderskriver.flowState);
};

export const useIsSentToMedunderskriver = () => {
  const isLazySentToMedunderskriver = useLazyIsSentToMedunderskriver();

  return isLazySentToMedunderskriver();
};

const getIsSentToMedunderskriver = (medunderskriverFlowState: MuFlowState): boolean =>
  medunderskriverFlowState === FlowState.SENT;
