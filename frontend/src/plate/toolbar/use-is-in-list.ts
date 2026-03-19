import { useMyPlateEditorState } from '@/plate/types';
import { isInList } from '@/plate/utils/queries';

export const useIsInList = () => {
  const editor = useMyPlateEditorState();

  return isInList(editor);
};
