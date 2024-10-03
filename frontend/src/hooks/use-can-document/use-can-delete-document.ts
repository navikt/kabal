import { useMemo } from 'react';
import { useCanEditDocument } from '@app/hooks/use-can-document/use-can-edit-document';
import { IMainDocument } from '@app/types/documents/documents';

export const useCanDeleteDocument = (
  document: IMainDocument | null,
  containsRolAttachments: boolean,
  parentDocument?: IMainDocument,
) => {
  const canEdit = useCanEditDocument(document, parentDocument);

  return useMemo(() => {
    if (!canEdit) {
      return false;
    }

    return !containsRolAttachments;
  }, [canEdit, containsRolAttachments]);
};
