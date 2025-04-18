import { StaticDataContext } from '@app/components/app/static-data-context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useHasRole } from '@app/hooks/use-has-role';
import { useHasYtelseAccess } from '@app/hooks/use-has-ytelse-access';
import { Role } from '@app/types/bruker';
import { FlowState } from '@app/types/oppgave-common';
import { useContext } from 'react';

export const useHasBehandlingAccess = (): boolean => {
  const { user } = useContext(StaticDataContext);
  const { data } = useOppgave();
  const hasYtelseAccess = useHasYtelseAccess(data?.ytelseId);
  const isKrol = useHasRole(Role.KABAL_KROL);

  if (data === undefined) {
    return false;
  }

  if (hasYtelseAccess) {
    return true;
  }

  if (user.navIdent === data.saksbehandler?.navIdent) {
    return true;
  }

  if (user.navIdent === data.medunderskriver?.employee?.navIdent) {
    return true;
  }

  const { rol } = data;

  if (rol.employee === null) {
    return false;
  }

  if (user.navIdent === rol.employee.navIdent) {
    return true;
  }

  if (rol.flowState === FlowState.SENT) {
    return isKrol;
  }

  return false;
};
