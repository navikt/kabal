import { useMemo } from 'react';
import { useUser } from '@app/simple-api-state/use-user';
import { Role } from '@app/types/bruker';
import { useHasYtelseAccess } from './use-has-ytelse-access';

interface Actions {
  open: boolean;
  assignSelf: boolean;
  assignOthers: boolean;
  deassign: boolean;
}

type ReturnType = [Actions, false] | [undefined, true];

export const useOppgaveActions = (
  tildeltSaksbehandler: string | null,
  hasMedunderskriver: boolean,
  ytelse?: string
): ReturnType => {
  const { data: user, isLoading: isUserLoading } = useUser();
  const [hasYtelseAccess, isYtelseLoading] = useHasYtelseAccess(ytelse);

  const isLoading = isUserLoading || isYtelseLoading;

  return useMemo<ReturnType>(() => {
    if (isLoading || typeof user === 'undefined') {
      return [undefined, true];
    }

    const isAssigned = tildeltSaksbehandler !== null;
    const isAssignedToSelf = isAssigned && user.navIdent === tildeltSaksbehandler;

    const access: Values = {
      hasYtelseAccess,
      hasOppgavestyringAccess: user.roller.includes(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER),
      hasSaksbehandlerAccess: user.roller.includes(Role.KABAL_SAKSBEHANDLING),
      isAssignedToSelf,
      isAssigned,
    };

    const assignOthers = canAssignOthers(access);

    return [
      {
        open: hasYtelseAccess,
        assignSelf: canAssignSelf(access),
        assignOthers,
        deassign: !hasMedunderskriver && (isAssignedToSelf || (assignOthers && isAssigned)),
      },
      false,
    ];
  }, [isLoading, user, tildeltSaksbehandler, hasYtelseAccess, hasMedunderskriver]);
};

interface Values {
  hasYtelseAccess: boolean;
  hasSaksbehandlerAccess: boolean;
  hasOppgavestyringAccess: boolean;
  isAssigned: boolean;
  isAssignedToSelf: boolean;
}

const canAssignSelf = ({ hasYtelseAccess, hasSaksbehandlerAccess, isAssigned }: Values): boolean => {
  if (!hasSaksbehandlerAccess) {
    return false;
  }

  if (!hasYtelseAccess) {
    return false;
  }

  return !isAssigned;
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
