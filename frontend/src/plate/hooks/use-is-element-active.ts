import { useMyPlateEditorState } from '@app/plate/types';
import { RangeApi } from 'platejs';

export const useIsElementActive = (element: string) => {
  const editor = useMyPlateEditorState();

  if (editor.selection === null || RangeApi.isExpanded(editor.selection)) {
    return false;
  }

  return editor.api.some({
    match: (n) => editor.api.isBlock(n) && n.type === element,
    mode: 'lowest',
  });
};
