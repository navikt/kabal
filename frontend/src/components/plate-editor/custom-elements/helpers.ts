import { TextAlign } from '@app/components/plate-editor/types';

export const getTextAlign = (textAlign: TextAlign) => {
  switch (textAlign) {
    case TextAlign.LEFT:
      return 'left';
    case TextAlign.RIGHT:
      return 'right';
  }
};
