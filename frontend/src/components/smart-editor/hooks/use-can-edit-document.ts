import { StaticDataContext } from '@app/components/app/static-data-context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { type IUserData, Role } from '@app/types/bruker';
import { FlowState } from '@app/types/oppgave-common';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { useContext, useMemo } from 'react';

export const useCanManageDocument = (templateId: TemplateIdEnum): boolean => {
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return useMemo<boolean>(
    () => isSuccess && canEditDocument(templateId, oppgave, user),
    [oppgave, isSuccess, templateId, user],
  );
};

export const useCanEditDocument = (templateId: TemplateIdEnum): boolean => {
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return useMemo<boolean>(
    () => isSuccess && canEditDocument(templateId, oppgave, user),
    [oppgave, isSuccess, templateId, user],
  );
};

const isRol = (oppgave: IOppgavebehandling, user: IUserData): boolean =>
  oppgave.rol.employee?.navIdent === user.navIdent;

const rolCanEdit = (oppgave: IOppgavebehandling, user: IUserData): boolean =>
  isRol(oppgave, user) && oppgave.avsluttetAvSaksbehandlerDate === null && oppgave.rol?.flowState === FlowState.SENT;

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
export const canEditDocument = (templateId: TemplateIdEnum, oppgave: IOppgavebehandling, user: IUserData): boolean => {
  if (templateId === TemplateIdEnum.ROL_ANSWERS) {
    return rolCanEdit(oppgave, user);
  }

  const hasSaksbehandlerRole = user.roller.includes(Role.KABAL_SAKSBEHANDLING);

  if (oppgave.avsluttetAvSaksbehandlerDate !== null) {
    return hasSaksbehandlerRole;
  }

  const isAssignedSaksbehandler = oppgave.saksbehandler?.navIdent === user.navIdent;
  const isMu = oppgave.medunderskriver?.employee?.navIdent === user.navIdent;
  const sentToMu = oppgave.medunderskriver.flowState === FlowState.SENT;

  if (templateId === TemplateIdEnum.ROL_QUESTIONS) {
    if (isRol(oppgave, user)) {
      return false;
    }

    if (oppgave.rol?.flowState === FlowState.SENT) {
      return false;
    }

    if (isAssignedSaksbehandler) {
      return !sentToMu;
    }

    if (isMu) {
      return sentToMu;
    }
  }

  if (isMu) {
    return sentToMu;
  }

  if (sentToMu) {
    return false;
  }

  const isFinished = oppgave.avsluttetAvSaksbehandlerDate !== null;

  return (!isFinished && isAssignedSaksbehandler) || (isFinished && hasSaksbehandlerRole);
};
