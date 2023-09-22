import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useGetSmartEditorsQuery } from '@app/redux-api/oppgaver/queries/smart-editor';
import { Role } from '@app/types/bruker';
import { ISmartEditor } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const useSmartEditors = (oppgaveId: string | typeof skipToken): ISmartEditor[] | undefined => {
  const { data, isLoading } = useGetSmartEditorsQuery(oppgaveId === skipToken ? skipToken : { oppgaveId });
  const isRol = useIsRol();
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);

  if (isLoading || typeof data === 'undefined') {
    return undefined;
  }

  const editors: ISmartEditor[] = [];

  if (hasSaksbehandlerRole) {
    editors.push(...data.filter(({ templateId }) => templateId !== TemplateIdEnum.ROL_ANSWERS));
  }

  if (isRol) {
    editors.push(...data.filter(({ templateId }) => templateId === TemplateIdEnum.ROL_ANSWERS));
  }

  return editors;
};
