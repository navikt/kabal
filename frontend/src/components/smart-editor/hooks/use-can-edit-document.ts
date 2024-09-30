import { useContext, useMemo } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { IUserData } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const useCanManageDocument = (templateId: TemplateIdEnum): boolean => {
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return useMemo<boolean>(
    () => isSuccess && canManageDocument(templateId, oppgave, user),
    [oppgave, isSuccess, templateId, user],
  );
};

const canManageDocument = (templateId: TemplateIdEnum, oppgave: IOppgavebehandling, user: IUserData): boolean => {
  if (
    (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
    oppgave.rol?.flowState === FlowState.SENT &&
    templateId === TemplateIdEnum.ROL_QUESTIONS
  ) {
    // No one can edit ROL questions after they have been sent.
    return false;
  }

  if (isRol(oppgave, user)) {
    return rolCanEdit(templateId, oppgave);
  }

  if (isMu(oppgave, user)) {
    return false;
  }

  return saksbehandlerCanEdit(templateId, oppgave, user);
};

const saksbehandlerCanEdit = (templateId: TemplateIdEnum, oppgave: IOppgavebehandling, user: IUserData): boolean => {
  if (oppgave.saksbehandler?.navIdent !== user.navIdent) {
    return false;
  }

  if (templateId === TemplateIdEnum.ROL_ANSWERS) {
    return false;
  }

  // When behandling is sent to ROL, saksbehandler can edit everything except questions.
  if (templateId === TemplateIdEnum.ROL_QUESTIONS) {
    return (
      (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
      oppgave.rol?.flowState !== FlowState.SENT
    );
  }

  return oppgave.medunderskriver?.flowState !== FlowState.SENT;
};

const isMu = (oppgave: IOppgavebehandling, user: IUserData): boolean =>
  oppgave.medunderskriver?.employee?.navIdent === user.navIdent;

const isRol = (oppgave: IOppgavebehandling, user: IUserData): boolean =>
  (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
  oppgave.rol.employee?.navIdent === user.navIdent;

// Only ROL can edit answers after they have been sent.
const rolCanEdit = (templateId: TemplateIdEnum, oppgave: IOppgavebehandling): boolean =>
  (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
  oppgave.rol.flowState === FlowState.SENT &&
  templateId === TemplateIdEnum.ROL_ANSWERS;

export const useCanEditDocument = (templateId: TemplateIdEnum): boolean => {
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return useMemo<boolean>(
    () => isSuccess && canEditDocument(templateId, oppgave, user),
    [oppgave, isSuccess, templateId, user],
  );
};

const muCanEdit = (templateId: TemplateIdEnum, oppgave: IOppgavebehandling): boolean =>
  oppgave.medunderskriver.flowState === FlowState.SENT && templateId !== TemplateIdEnum.ROL_ANSWERS;

export const canEditDocument = (templateId: TemplateIdEnum, oppgave: IOppgavebehandling, user: IUserData): boolean =>
  canManageDocument(templateId, oppgave, user) || (isMu(oppgave, user) && muCanEdit(templateId, oppgave));
