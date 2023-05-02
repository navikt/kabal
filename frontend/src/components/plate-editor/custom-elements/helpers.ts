import { TextAlignEnum } from '@app/components/plate-editor/types';

export const getTextAlign = (textAlign: TextAlignEnum) => {
  switch (textAlign) {
    case TextAlignEnum.TEXT_ALIGN_LEFT:
      return 'left';
    case TextAlignEnum.TEXT_ALIGN_RIGHT:
      return 'right';
  }
};
