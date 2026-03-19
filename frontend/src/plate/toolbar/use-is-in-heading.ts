import { useMyPlateEditorState } from '@/plate/types';
import { isInHeading } from '@/plate/utils/queries';

export const useIsInHeading = () => {
  const editor = useMyPlateEditorState();

  return isInHeading(editor);
};
