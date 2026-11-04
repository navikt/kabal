import type { TRange } from 'platejs';
import { useMyPlateEditorState } from '@/plate/types';

// Workaround while we are waiting for https://github.com/udecode/plate/issues/4140
export const useSelection = (editorId?: string): TRange | null => {
  const { selection } = useMyPlateEditorState(editorId);

  return selection;
};
