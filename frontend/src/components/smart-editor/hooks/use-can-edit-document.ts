import { useContext, useMemo } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const useCanManageDocument = (templateId: TemplateIdEnum): boolean => {
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return useMemo<boolean>(() => {
    if (!isSuccess) {
      return false;
    }

    if (
      (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
      oppgave.rol?.flowState === FlowState.SENT &&
      templateId === TemplateIdEnum.ROL_QUESTIONS
    ) {
      // No one can edit questions after they have been sent.
      return false;
    }

    if (
      (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
      oppgave.rol.flowState === FlowState.SENT &&
      templateId === TemplateIdEnum.ROL_ANSWERS &&
      oppgave.rol.employee?.navIdent === user.navIdent
    ) {
      // Only ROL can edit answers after they have been sent.
      return true;
    }

    if (oppgave.saksbehandler?.navIdent !== user.navIdent) {
      return false;
    }

    if (oppgave.medunderskriver.flowState === FlowState.SENT) {
      return false;
    }

    // When behandling is sent to ROL, saksbehandler can edit everything except questions.
    if (
      (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
      oppgave.rol?.flowState === FlowState.SENT
    ) {
      return templateId !== TemplateIdEnum.ROL_QUESTIONS;
    }

    return true;
  }, [oppgave, isSuccess, templateId, user]);
};

export const useCanEditDocument = (templateId: TemplateIdEnum): boolean => {
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);
  const canManage = useCanManageDocument(templateId);

  return (
    canManage ||
    (isSuccess &&
      oppgave.medunderskriver.employee?.navIdent === user.navIdent &&
      oppgave.medunderskriver.flowState === FlowState.SENT)
  );
};
