import { useMyPlateEditorState } from '@/plate/types';
import { isUnchangeable } from '@/plate/utils/queries';

export const useIsUnchangeable = () => {
  const editor = useMyPlateEditorState();

  return isUnchangeable(editor);
};
