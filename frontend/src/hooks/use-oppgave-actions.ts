import { useMemo } from 'react';
import { useUser } from '../simple-api-state/use-user';
import { Role } from '../types/bruker';
import { useHasYtelseAccess } from './use-has-ytelse-access';

interface Actions {
  open: boolean;
  assignSelf: boolean;
  assignOthers: boolean;
  deassign: boolean;
}

type ReturnType = [Actions, false] | [undefined, true];

// eslint-disable-next-line import/no-unused-modules
export const useOppgaveActions = (ytelse: string, tildeltSaksbehandler: string | null): ReturnType => {
  const { data: user, isLoading: isUserLoading } = useUser();
  const [hasYtelseAccess, isYtesleLoading] = useHasYtelseAccess(ytelse);

  const isLoading = isUserLoading || isYtesleLoading;

  return useMemo<ReturnType>(() => {
    if (isLoading || typeof user === 'undefined') {
      return [undefined, true];
    }

    const isAssigned = tildeltSaksbehandler !== null;
    const isAssignedToSelf = user.navIdent === tildeltSaksbehandler;
    const isAssignedToOther = isAssigned && !isAssignedToSelf;

    const access: Values = {
      hasYtelseAccess,
      hasOppgavestyringAccess: user.roller.includes(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER),
      hasSaksbehandlerAccess: user.roller.includes(Role.KABAL_SAKSBEHANDLING),
      isAssignedToSelf,
      isAssigned,
      isAssignedToOther,
    };

    const assignOthers = canAssignOthers(access);

    return [
      {
        open: hasYtelseAccess,
        assignSelf: canAssignSelf(access),
        assignOthers,
        deassign: isAssignedToSelf || (assignOthers && isAssignedToOther),
      },
      false,
    ];
  }, [isLoading, user, tildeltSaksbehandler, hasYtelseAccess]);
};

interface Values {
  hasYtelseAccess: boolean;
  hasSaksbehandlerAccess: boolean;
  hasOppgavestyringAccess: boolean;
  isAssigned: boolean;
  isAssignedToSelf: boolean;
  isAssignedToOther: boolean;
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
