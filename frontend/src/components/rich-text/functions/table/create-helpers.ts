import { ContentTypeEnum, TableContentEnum, TextAlignEnum } from '../../types/editor-enums';
import { ParagraphElementType, TableCellElementType, TableRowElementType } from '../../types/editor-types';

export const createCellContent = (text = ''): ParagraphElementType[] => [
  {
    type: ContentTypeEnum.PARAGRAPH,
    children: [{ text }],
    indent: 0,
    textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
  },
];

export const createCell = (text = ''): TableCellElementType => ({
  type: TableContentEnum.TD,
  children: createCellContent(text),
  colSpan: 1,
});

export const createRow = (columns: number): TableRowElementType => ({
  type: TableContentEnum.TR,
  children: Array.from({ length: columns }, () => createCell()),
});
