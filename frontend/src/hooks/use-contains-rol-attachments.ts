import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Role } from '@app/types/bruker';
import { IMainDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { useOppgaveId } from './oppgavebehandling/use-oppgave-id';

/**
 * Only checks attachments to ROL question documents.
 *
 * Checks if the given question document contains attachments from the ROL role.
 *
 * If the document is not a ROL question document, it will return `false`.
 *
 * Returns `true` while loading.
 */
export const useContainsRolAttachments = (document: IMainDocument | null): boolean => {
  const oppgaveId = useOppgaveId();
  const { data: documents } = useGetDocumentsQuery(oppgaveId);

  if (documents === undefined || document === null) {
    return true;
  }

  if (document.isSmartDokument && document.templateId === TemplateIdEnum.ROL_QUESTIONS) {
    return documents.some((d) => {
      if (d.parentId === document.id) {
        return d.creatorRole === Role.KABAL_ROL;
      }

      return false;
    });
  }

  return false;
};
