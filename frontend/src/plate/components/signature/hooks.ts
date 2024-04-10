import { skipToken } from '@reduxjs/toolkit/query';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useGetSignatureQuery } from '@app/redux-api/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const useMedunderskriverSignature = () => {
  const { data: oppgave } = useOppgave();
  const { data: medunderskriverSignature } = useGetSignatureQuery(
    typeof oppgave?.medunderskriver.employee?.navIdent === 'string'
      ? oppgave.medunderskriver.employee.navIdent
      : skipToken,
  );

  if (oppgave === undefined || oppgave.medunderskriver.employee === null || medunderskriverSignature === undefined) {
    return null;
  }

  return medunderskriverSignature;
};

export const useMainSignature = (template: TemplateIdEnum) => {
  const { data: oppgave } = useOppgave();

  const isRolAnswers = template === TemplateIdEnum.ROL_ANSWERS;
  const isRolSakstype = oppgave?.typeId === SaksTypeEnum.KLAGE || oppgave?.typeId === SaksTypeEnum.ANKE;

  const { data: saksbehandlerSignature } = useGetSignatureQuery(
    !isRolAnswers && typeof oppgave?.saksbehandler?.navIdent === 'string' ? oppgave.saksbehandler.navIdent : skipToken,
  );

  const { data: rolSignature } = useGetSignatureQuery(
    isRolAnswers && isRolSakstype ? oppgave.rol.employee?.navIdent ?? skipToken : skipToken,
  );

  if (isRolAnswers) {
    if (oppgave === undefined || !isRolSakstype || oppgave.rol.employee === null || rolSignature === undefined) {
      return null;
    }

    return rolSignature;
  }

  if (oppgave === undefined || oppgave.saksbehandler === null || saksbehandlerSignature === undefined) {
    return null;
  }

  return saksbehandlerSignature;
};
