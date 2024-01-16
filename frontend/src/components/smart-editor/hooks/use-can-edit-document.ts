import { useContext, useMemo } from 'react';
import { UserContext } from '@app/components/app/user';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const useCanEditDocument = (templateId: TemplateIdEnum): boolean => {
  const { data: oppgave, isLoading: oppgaveIsLoading, isFetching: oppgaveIsFetching } = useOppgave();
  const user = useContext(UserContext);

  return useMemo<boolean>(() => {
    if (oppgaveIsLoading || oppgaveIsFetching) {
      return false;
    }

    if (oppgave === undefined) {
      return false;
    }

    if (oppgave.medunderskriver.flowState === FlowState.SENT) {
      return oppgave.medunderskriver.navIdent === user.navIdent;
    }

    if (
      (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
      oppgave.rol.flowState === FlowState.SENT &&
      templateId === TemplateIdEnum.ROL_QUESTIONS
    ) {
      return false;
    }

    if (
      (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
      oppgave.rol.flowState === FlowState.SENT &&
      templateId === TemplateIdEnum.ROL_ANSWERS &&
      oppgave.rol.navIdent === user.navIdent
    ) {
      return true;
    }

    return oppgave.tildeltSaksbehandlerident === user.navIdent;
  }, [oppgave, oppgaveIsFetching, oppgaveIsLoading, templateId, user]);
};
