import { useMyPlateEditorState } from '@app/plate/types';
import { someNode } from '@udecode/plate-common';
import { BaseTablePlugin } from '@udecode/plate-table';

export const useIsInTable = () => {
  const editor = useMyPlateEditorState();

  return someNode(editor, { match: { type: BaseTablePlugin.node.type } });
};
