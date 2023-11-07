import { useMyPlateEditorState } from '@app/plate/types';
import { isInHeading } from '@app/plate/utils/queries';

export const useIsInHeading = () => {
  const editor = useMyPlateEditorState();

  return isInHeading(editor);
};
