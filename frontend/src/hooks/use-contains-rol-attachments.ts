import { useMemo } from 'react';
import { CreatorRole, IMainDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

/**
 * Only checks attachments to ROL question documents.
 *
 * Checks if the given question document contains attachments from the ROL role.
 *
 * If the document is not a ROL question document, it will return `false`.
 *
 * Returns `true` while loading.
 */
export const useContainsRolAttachments = (document: IMainDocument | null, siblings: IMainDocument[]): boolean =>
  useMemo(() => getContainsRolAttachments(document, siblings), [document, siblings]);

const getContainsRolAttachments = (document: IMainDocument | null, siblings: IMainDocument[]): boolean => {
  if (document === null) {
    return true;
  }

  if (document.isSmartDokument && document.templateId === TemplateIdEnum.ROL_QUESTIONS) {
    return siblings.some((d) => {
      if (d.parentId === document.id) {
        return d.creator.creatorRole === CreatorRole.KABAL_ROL;
      }

      return false;
    });
  }

  return false;
};
