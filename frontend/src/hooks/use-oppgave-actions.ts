import { useContext, useMemo } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { useHasYtelseAccess } from '@/hooks/use-has-ytelse-access';
import { Role } from '@/types/bruker';
import { SaksTypeEnum } from '@/types/kodeverk';
import { FlowState, type MuFlowState } from '@/types/oppgave-common';

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
  medunderskriverFlowState: MuFlowState | null,
  rolFlowState: FlowState,
  typeId: SaksTypeEnum,
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
      hasOppgavestyringAnketeamAccess: user.roller.includes(Role.KABAL_OPPGAVESTYRING_ANKETEAM),
      hasSaksbehandlerAccess: user.roller.includes(Role.KABAL_SAKSBEHANDLING),
      hasAnketeamAccess: user.roller.includes(Role.ANKETEAM),
      isMedunderskriver: user.navIdent === medunderskriver,
      isAssignedToSelf,
      isAssigned,
      typeId,
    };

    const assignOthers = canAssignOthers(access);

    return [
      {
        open: hasYtelseAccess && hasSakstypeAccess(typeId, user.roller),
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
    typeId,
  ]);
};

const canAssignSelf = ({
  hasYtelseAccess,
  hasSaksbehandlerAccess,
  isAssignedToSelf,
  isMedunderskriver,
  hasAnketeamAccess,
  typeId,
}: Values): boolean => {
  if (isAnkeTypeAfter2027(typeId)) {
    return hasAnketeamAccess;
  }

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

const canAssignOthers = ({
  isAssignedToSelf,
  hasSaksbehandlerAccess,
  hasOppgavestyringAccess,
  hasOppgavestyringAnketeamAccess,
  typeId,
}: Values): boolean => {
  if (isAnkeTypeAfter2027(typeId)) {
    return hasOppgavestyringAnketeamAccess;
  }

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
  hasAnketeamAccess: boolean;
  hasOppgavestyringAccess: boolean;
  hasOppgavestyringAnketeamAccess: boolean;
  isMedunderskriver: boolean;
  isAssigned: boolean;
  isAssignedToSelf: boolean;
  typeId: SaksTypeEnum;
}

const hasSakstypeAccess = (typeId: SaksTypeEnum, roles: Role[]): boolean => {
  if (isAnkeTypeAfter2027(typeId)) {
    return roles.includes(Role.ANKETEAM);
  }

  return true;
};

const isAnkeTypeAfter2027 = (typeId: SaksTypeEnum): boolean =>
  typeId === SaksTypeEnum.ANKE_AFTER_2027 || typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027;
