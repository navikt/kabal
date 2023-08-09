import { someNode } from '@udecode/plate-common';
import { ELEMENT_TABLE } from '@udecode/plate-table';
import { useMyPlateEditorState } from '@app/plate/types';

export const useIsInTable = () => {
  const editor = useMyPlateEditorState();

  return someNode(editor, { match: { type: ELEMENT_TABLE } });
};
