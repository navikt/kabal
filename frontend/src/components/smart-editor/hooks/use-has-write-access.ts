import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { useLazyDuaAccess } from '@app/hooks/dua-access/use-access';
import type { ISmartDocumentOrAttachment } from '@app/types/documents/documents';
import { useMemo } from 'react';

export const useHasWriteAccess = (smartDocument: ISmartDocumentOrAttachment): boolean => {
  const getDuaAccess = useLazyDuaAccess();

  return useMemo(() => {
    const writeAccess = getDuaAccess(smartDocument, DuaActionEnum.WRITE);

    return writeAccess === null;
  }, [smartDocument, getDuaAccess]);
};
