import { useContext, useMemo } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { Role } from '@app/types/bruker';
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
  ytelse?: string,
): ReturnType => {
  const { user } = useContext(StaticDataContext);
  const hasYtelseAccess = useHasYtelseAccess(ytelse);

  return useMemo<ReturnType>(() => {
    const hasMedunderskriver = medunderskriver !== null;
    const isAssigned = tildeltSaksbehandler !== null;
    const isAssignedToSelf = isAssigned && user.navIdent === tildeltSaksbehandler;

    const access: Values = {
      hasYtelseAccess,
      hasOppgavestyringAccess: user.roller.includes(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER),
      hasSaksbehandlerAccess: user.roller.includes(Role.KABAL_SAKSBEHANDLING),
      isMedunderskriver: hasMedunderskriver && user.navIdent === medunderskriver,
      isAssignedToSelf,
      isAssigned,
    };

    const assignOthers = canAssignOthers(access);

    return [
      {
        open: hasYtelseAccess,
        assignSelf: canAssignSelf(access),
        assignOthers,
        deassignSelf: !hasMedunderskriver && isAssignedToSelf,
        deassignOthers: !hasMedunderskriver && assignOthers && isAssigned,
      },
      false,
    ];
  }, [user, medunderskriver, tildeltSaksbehandler, hasYtelseAccess]);
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
