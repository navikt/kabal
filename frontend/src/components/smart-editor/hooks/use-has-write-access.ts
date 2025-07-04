import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { useLazyDuaAccess } from '@app/hooks/dua-access/use-dua-access';
import { useParentDocument } from '@app/hooks/use-parent-document';
import type { ISmartDocumentOrAttachment } from '@app/types/documents/documents';
import { useMemo } from 'react';

export const useHasWriteAccess = ({ parentId, creator, type, templateId }: ISmartDocumentOrAttachment): boolean => {
  const parent = useParentDocument(parentId);
  const getDuaAccess = useLazyDuaAccess();

  return useMemo(() => {
    const writeAccessError = getDuaAccess({ creator, type, templateId }, DuaActionEnum.WRITE, parent);

    return writeAccessError === null;
  }, [creator, type, templateId, getDuaAccess, parent]);
};
