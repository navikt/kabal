import { StaticDataContext } from '@app/components/app/static-data-context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import type { IUserData } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { useContext, useMemo } from 'react';

export const useCanManageDocument = (templateId: TemplateIdEnum, creator: string): boolean => {
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return useMemo<boolean>(
    () => isSuccess && canManageDocument(templateId, oppgave, user, creator),
    [oppgave, isSuccess, templateId, user, creator],
  );
};

const canManageDocument = (
  templateId: TemplateIdEnum,
  oppgave: IOppgavebehandling,
  user: IUserData,
  creator: string,
): boolean => {
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
    return oppgave.avsluttetAvSaksbehandlerDate !== null && saksbehandlerCanEdit(templateId, oppgave, user, creator);
  }

  return saksbehandlerCanEdit(templateId, oppgave, user, creator);
};

const saksbehandlerCanEdit = (
  templateId: TemplateIdEnum,
  oppgave: IOppgavebehandling,
  user: IUserData,
  creator: string,
): boolean => {
  const isCreator = creator === user.navIdent;
  const isFinished = oppgave.avsluttetAvSaksbehandlerDate !== null;
  const isAssigned = oppgave.saksbehandler?.navIdent === user.navIdent;

  const canWrite = (!isFinished && isAssigned) || (isFinished && isCreator);

  if (templateId === TemplateIdEnum.ROL_ANSWERS) {
    return false;
  }

  // When behandling is sent to ROL, saksbehandler can edit everything except questions.
  if (templateId === TemplateIdEnum.ROL_QUESTIONS) {
    return (
      canWrite &&
      (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
      oppgave.rol?.flowState !== FlowState.SENT
    );
  }

  return canWrite && oppgave.medunderskriver?.flowState !== FlowState.SENT;
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

export const useCanEditDocument = (templateId: TemplateIdEnum, creator: string): boolean => {
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return useMemo<boolean>(
    () => isSuccess && canEditDocument(templateId, oppgave, user, creator),
    [oppgave, isSuccess, templateId, user, creator],
  );
};

const muCanEdit = (templateId: TemplateIdEnum, oppgave: IOppgavebehandling): boolean =>
  oppgave.medunderskriver.flowState === FlowState.SENT && templateId !== TemplateIdEnum.ROL_ANSWERS;

export const canEditDocument = (
  templateId: TemplateIdEnum,
  oppgave: IOppgavebehandling,
  user: IUserData,
  creator: string,
): boolean =>
  canManageDocument(templateId, oppgave, user, creator) || (isMu(oppgave, user) && muCanEdit(templateId, oppgave));
