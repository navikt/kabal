import { useContext, useMemo } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const useCanEditDocument = (templateId: TemplateIdEnum): boolean => {
  const { data: oppgave, isLoading: oppgaveIsLoading, isFetching: oppgaveIsFetching } = useOppgave();
  const { user } = useContext(StaticDataContext);

  return useMemo<boolean>(() => {
    if (oppgaveIsLoading || oppgaveIsFetching || oppgave === undefined) {
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

    return (
      oppgave.saksbehandler?.navIdent === user.navIdent || oppgave.medunderskriver.employee?.navIdent === user.navIdent
    );
  }, [oppgave, oppgaveIsFetching, oppgaveIsLoading, templateId, user]);
};
