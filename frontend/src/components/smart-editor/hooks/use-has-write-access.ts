import { useMemo } from 'react';
import { DuaActionEnum } from '@/hooks/dua-access/access';
import { useLazyDuaAccess } from '@/hooks/dua-access/use-dua-access';
import { useParentDocument } from '@/hooks/use-parent-document';
import type { ISmartDocumentOrAttachment } from '@/types/documents/documents';

export const useHasWriteAccess = (props: ISmartDocumentOrAttachment | null): boolean => {
  const parent = useParentDocument(props?.parentId ?? null);
  const getDuaAccess = useLazyDuaAccess();

  return useMemo(() => {
    if (props === null) {
      return false;
    }

    const { creator, type, templateId } = props;
    const writeAccessError = getDuaAccess({ creator, type, templateId }, DuaActionEnum.WRITE, parent);

    return writeAccessError === null;
  }, [props, getDuaAccess, parent]);
};
