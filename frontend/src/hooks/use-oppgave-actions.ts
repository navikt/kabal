import { StaticDataContext } from '@app/components/app/static-data-context';
import { Role } from '@app/types/bruker';
import { FlowState } from '@app/types/oppgave-common';
import { useContext, useMemo } from 'react';
import { useHasYtelseAccess } from './use-has-ytelse-access';

interface Actions {
  open: boolean;
  assignSelf: boolean;
  assignOthers: boolean;
  deassignSelf: boolean;
  deassignOthers: boolean;
}

type ReturnType = [Actions, false] | [undefined, true];

export const useOppgaveActions = (
  tildeltSaksbehandler: string | null,
  medunderskriver: string | null,
  medunderskriverFlowState: FlowState | null,
  rolFlowState: FlowState,
  ytelse?: string,
): ReturnType => {
  const { user } = useContext(StaticDataContext);
  const hasYtelseAccess = useHasYtelseAccess(ytelse);

  return useMemo<ReturnType>(() => {
    const medunderskriverInvolved = medunderskriverFlowState === FlowState.SENT;
    const rolInvolved = rolFlowState === FlowState.SENT;
    const isAssigned = tildeltSaksbehandler !== null;
    const isAssignedToSelf = isAssigned && user.navIdent === tildeltSaksbehandler;

    const access: Values = {
      hasYtelseAccess,
      hasOppgavestyringAccess: user.roller.includes(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER),
      hasSaksbehandlerAccess: user.roller.includes(Role.KABAL_SAKSBEHANDLING),
      isMedunderskriver: user.navIdent === medunderskriver,
      isAssignedToSelf,
      isAssigned,
    };

    const assignOthers = canAssignOthers(access);

    return [
      {
        open: hasYtelseAccess,
        assignSelf: canAssignSelf(access),
        assignOthers,
        deassignSelf: !(medunderskriverInvolved || rolInvolved) && isAssignedToSelf,
        deassignOthers: !(medunderskriverInvolved || rolInvolved) && assignOthers && isAssigned,
      },
      false,
    ];
  }, [
    medunderskriverFlowState,
    rolFlowState,
    tildeltSaksbehandler,
    user.navIdent,
    user.roller,
    hasYtelseAccess,
    medunderskriver,
  ]);
};

const canAssignSelf = ({
  hasYtelseAccess,
  hasSaksbehandlerAccess,
  isAssignedToSelf,
  isMedunderskriver,
}: Values): boolean => {
  if (!hasSaksbehandlerAccess) {
    return false;
  }

  if (!hasYtelseAccess) {
    return false;
  }

  if (isMedunderskriver) {
    return false;
  }

  return !isAssignedToSelf;
};

const canAssignOthers = ({ isAssignedToSelf, hasSaksbehandlerAccess, hasOppgavestyringAccess }: Values): boolean => {
  if (hasOppgavestyringAccess) {
    return true;
  }

  if (hasSaksbehandlerAccess && isAssignedToSelf) {
    return true;
  }

  return false;
};

interface Values {
  hasYtelseAccess: boolean;
  hasSaksbehandlerAccess: boolean;
  hasOppgavestyringAccess: boolean;
  isMedunderskriver: boolean;
  isAssigned: boolean;
  isAssignedToSelf: boolean;
}
