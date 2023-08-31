import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useUser } from '@app/simple-api-state/use-user';
import { ISmartEditor } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const useFirstEditor = (editors: ISmartEditor[]): ISmartEditor | null => {
  const { data: user, isLoading: userIsLoading } = useUser();
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();

  if (editors === undefined || editors.length === 0) {
    return null;
  }

  if (userIsLoading || oppgaveIsLoading || user === undefined || oppgave === undefined) {
    return null;
  }

  const isRol = oppgave.rol.navIdent === user.navIdent;

  if (isRol) {
    return editors.find(({ templateId }) => templateId === TemplateIdEnum.ROL_NOTAT) ?? null;
  }

  return editors[0] ?? null;
};
