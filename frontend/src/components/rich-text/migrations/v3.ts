import { Text } from 'slate';
import { PlainText_V3, RichText_Content_V3, RichText_V3, TableCellElementType_V3 } from '../../../types/rich-text/v3';
import { PlainText_V4, RichText_Content_V4, RichText_V4 } from '../../../types/rich-text/v4';
import { isPlainTextType } from '../../../types/texts/texts';
import { ContentTypeEnum, TextAlignEnum } from '../types/editor-enums';
import {
  TableBodyElementType,
  TableCellElementType,
  TableElementType,
  TableRowElementType,
} from '../types/editor-types';

export const migrateFromV3ToV4 = (response: RichText_V3 | PlainText_V3): RichText_V4 | PlainText_V4 =>
  isPlainText(response) ? { ...response, version: 4 } : migrateRichTextV3ToV4(response);

export const migrateRichTextV3ToV4 = (response: RichText_V3): RichText_V4 => ({
  ...response,
  version: 4,
  content: response.content.map(wrapTableCellContent),
});

const wrapTableCellContent = (content: RichText_Content_V3): RichText_Content_V4 => {
  if (Text.isText(content)) {
    return content;
  }

  if (content.type === 'table') {
    const table: TableElementType = {
      ...content,
      children: content.children.map((body) => ({
        ...body,
        children: body.children.map((row) => ({
          ...row,
          children: row.children.map(migrateTableCell),
        })),
      })),
    };

    return table;
  }

  if (content.type === 'td') {
    return migrateTableCell(content);
  }

  if (content.type === 'tr') {
    const row: TableRowElementType = {
      ...content,
      children: content.children.map(migrateTableCell),
    };

    return row;
  }

  if (content.type === 'tbody') {
    const body: TableBodyElementType = {
      ...content,
      children: content.children.map<TableRowElementType>((row) => ({
        ...row,
        children: row.children.map(migrateTableCell),
      })),
    };

    return body;
  }

  return content;
};

const isPlainText = (response: RichText_V3 | PlainText_V3): response is PlainText_V3 =>
  isPlainTextType(response.textType);

const migrateTableCell = (content: TableCellElementType_V3): TableCellElementType => ({
  ...content,
  children: [
    {
      type: ContentTypeEnum.PARAGRAPH,
      children: content.children,
      indent: 0,
      textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
    },
  ],
});
