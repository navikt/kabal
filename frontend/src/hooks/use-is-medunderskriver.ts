import { StaticDataContext } from '@app/components/app/static-data-context';
import { FlowState } from '@app/types/oppgave-common';
import { useContext } from 'react';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useLazyIsAssignedMedunderskriverAndSent = () => {
  const isAssignedMedunderskriver = useIsAssignedMedunderskriver();
  const isSentToMedunderskriver = useIsSentToMedunderskriver();

  return () => isAssignedMedunderskriver && isSentToMedunderskriver;
};

export const useIsAssignedMedunderskriverAndSent = () => {
  const isLazyAssignedMedunderskriverAndSent = useLazyIsAssignedMedunderskriverAndSent();

  return isLazyAssignedMedunderskriverAndSent();
};

export const useLazyIsAssignedMedunderskriver = () => {
  const { user } = useContext(StaticDataContext);
  const { data, isSuccess } = useOppgave();

  return () => isSuccess && data.medunderskriver.employee?.navIdent === user.navIdent;
};

export const useIsAssignedMedunderskriver = () => {
  const isLazyAssignedMedunderskriver = useLazyIsAssignedMedunderskriver();

  return isLazyAssignedMedunderskriver();
};

export const useLazyIsSentToMedunderskriver = () => {
  const { data, isSuccess } = useOppgave();

  return () => isSuccess && getIsSentToMedunderskriver(data.medunderskriver.flowState);
};

export const useIsSentToMedunderskriver = () => {
  const isLazySentToMedunderskriver = useLazyIsSentToMedunderskriver();

  return isLazySentToMedunderskriver();
};

export const getIsSentToMedunderskriver = (medunderskriverFlowState: FlowState): boolean =>
  medunderskriverFlowState === FlowState.SENT;
