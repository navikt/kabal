import { useMyPlateEditorState } from '@app/plate/types';
import type { BaseRange } from 'slate';

// Workaround while we are waiting for https://github.com/udecode/plate/issues/4140
export const useSelection = (editorId?: string): BaseRange | null => {
  const { selection } = useMyPlateEditorState(editorId);

  return selection;
};
