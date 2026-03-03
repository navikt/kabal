import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { useLazyDuaAccess } from '@app/hooks/dua-access/use-dua-access';
import { useParentDocument } from '@app/hooks/use-parent-document';
import type { ISmartDocumentOrAttachment } from '@app/types/documents/documents';
import { useMemo } from 'react';

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
