import type { BaseRange } from 'slate';
import { useMyPlateEditorState } from '@/plate/types';

// Workaround while we are waiting for https://github.com/udecode/plate/issues/4140
export const useSelection = (editorId?: string): BaseRange | null => {
  const { selection } = useMyPlateEditorState(editorId);

  return selection;
};
