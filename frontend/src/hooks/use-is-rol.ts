import { StaticDataContext } from '@app/components/app/static-data-context';
import { useHasAnyOfRoles } from '@app/hooks/use-has-role';
import { Role } from '@app/types/bruker';
import { FlowState } from '@app/types/oppgave-common';
import { useContext } from 'react';
import { useOppgave } from './oppgavebehandling/use-oppgave';

/**
 * If the current user is assigned to the case as a ROL and has been sent to ROL.
 * This means the user can answer questions as a ROL.
 */
export const useIsAssignedRolAndSent = () => {
  const isAssignedRol = useIsAssignedRol();
  const isSentToRol = useIsSentToRol();

  return isAssignedRol && isSentToRol;
};
/**
 * If the current user is assigned to the case as a ROL.
 * Not necessarily sent to ROL, just assigned.
 */
export const useIsAssignedRol = (): boolean => {
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return isSuccess && oppgave.rol.employee !== null && oppgave.rol.employee.navIdent === user.navIdent;
};

/**
 * If the current case is sent to ROL.
 * Not necessarily assigned to the current user, just sent.
 */
export const useIsSentToRol = () => {
  const { data: oppgave, isSuccess } = useOppgave();

  return isSuccess && oppgave.rol.flowState === FlowState.SENT;
};

/**
 * If the current case is returned from ROL.
 * Not necessarily assigned to the current user, just returned.
 */
export const useLazyIsReturnedFromRol = () => {
  const { data, isSuccess } = useOppgave();

  return () => isSuccess && data.rol.flowState === FlowState.RETURNED;
};

export const useIsRolOrKrolUser = (): boolean => useHasAnyOfRoles([Role.KABAL_ROL, Role.KABAL_KROL]);
export const useIsKrolUser = (): boolean => useHasAnyOfRoles([Role.KABAL_KROL]);
export const useIsRolUser = (): boolean => useHasAnyOfRoles([Role.KABAL_ROL]);
export const getIsRolUser = (roles: Role[]): boolean => roles.includes(Role.KABAL_ROL);
