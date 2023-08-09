import { useMyPlateEditorState } from '@app/plate/types';
import { isUnchangeable } from '@app/plate/utils/queries';

export const useIsUnchangeable = () => {
  const editor = useMyPlateEditorState();

  return isUnchangeable(editor);
};
