import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useIsRol } from '@app/hooks/use-is-rol';
import { ISmartDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const useFirstEditor = (editors: ISmartDocument[]): ISmartDocument | null => {
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const isRol = useIsRol();

  if (editors === undefined || editors.length === 0) {
    return null;
  }

  if (oppgaveIsLoading || oppgave === undefined) {
    return null;
  }

  if (isRol) {
    return editors.find(({ templateId }) => templateId === TemplateIdEnum.ROL_ANSWERS) ?? null;
  }

  return editors.filter(({ templateId }) => templateId !== TemplateIdEnum.ROL_ANSWERS)[0] ?? null;
};
