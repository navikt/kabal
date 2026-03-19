import { BaseTablePlugin } from '@platejs/table';
import { useMyPlateEditorState } from '@/plate/types';

export const useIsInTable = () => {
  const editor = useMyPlateEditorState();

  return editor.api.some({ match: { type: BaseTablePlugin.node.type } });
};
