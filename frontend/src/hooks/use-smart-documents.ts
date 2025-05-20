import { useHasRole } from '@app/hooks/use-has-role';
import { useIsAssignedRol } from '@app/hooks/use-is-rol';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Role } from '@app/types/bruker';
import type { ISmartDocumentOrAttachment } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { skipToken } from '@reduxjs/toolkit/query';

export const useSmartDocuments = (oppgaveId: string | typeof skipToken): ISmartDocumentOrAttachment[] | undefined => {
  const { data, isLoading } = useGetDocumentsQuery(oppgaveId);
  const isAssignedRol = useIsAssignedRol();
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);

  if (isLoading || typeof data === 'undefined') {
    return undefined;
  }

  const documents: ISmartDocumentOrAttachment[] = [];

  if (hasSaksbehandlerRole) {
    for (const document of data) {
      if (document.isSmartDokument && document.templateId !== TemplateIdEnum.ROL_ANSWERS) {
        documents.push(document);
      }
    }
  }

  if (isAssignedRol) {
    for (const document of data) {
      if (document.isSmartDokument && document.templateId === TemplateIdEnum.ROL_ANSWERS) {
        documents.push(document);
      }
    }
  }

  return documents.toSorted((a, b) => a.created.localeCompare(b.created));
};
