import { useMyPlateEditorState } from '@app/plate/types';
import type { BaseRange } from 'slate';

// useEditorSelection from @udecode/plate-common is typed as any in current version. This can be removed when it gets typed correctly.
// export const useSelection = (editorId?: string): BaseRange | null => {
//   const selection: unknown = useEditorSelection(editorId);

//   return selection === null ? null : (selection as BaseRange);
// };
export const useSelection = (editorId?: string): BaseRange | null => {
  const { selection } = useMyPlateEditorState(editorId);

  return selection;
};
