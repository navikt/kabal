import { TextAlignEnum } from '../editor-enums';

export const getTextAlign = (textAlign: TextAlignEnum) => {
  switch (textAlign) {
    case TextAlignEnum.TEXT_ALIGN_LEFT:
      return 'left';
    case TextAlignEnum.TEXT_ALIGN_CENTER:
      return 'center';
    case TextAlignEnum.TEXT_ALIGN_RIGHT:
      return 'right';
    case TextAlignEnum.TEXT_ALIGN_JUSTIFY:
      return 'justify';
    default:
      return 'left';
  }
};
