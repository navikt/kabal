import { useMyPlateEditorState } from '@app/plate/types';
import { isInList } from '@app/plate/utils/queries';

export const useIsInList = () => {
  const editor = useMyPlateEditorState();

  return isInList(editor);
};
