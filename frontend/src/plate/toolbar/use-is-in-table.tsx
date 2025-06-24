import { useMyPlateEditorState } from '@app/plate/types';
import { BaseTablePlugin } from '@platejs/table';

export const useIsInTable = () => {
  const editor = useMyPlateEditorState();

  return editor.api.some({ match: { type: BaseTablePlugin.node.type } });
};
