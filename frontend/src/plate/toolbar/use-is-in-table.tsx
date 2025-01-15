import { useMyPlateEditorState } from '@app/plate/types';
import { BaseTablePlugin } from '@udecode/plate-table';

export const useIsInTable = () => {
  const editor = useMyPlateEditorState();

  return editor.api.some({ match: { type: BaseTablePlugin.node.type } });
};
