import { Descendant, Element } from 'slate';
import {
  INDENT_TYPE,
  IndentElementType,
  PlainText_V2,
  RichText_Content_V2,
  RichText_V2,
} from '../../../types/rich-text/v2';
import { PlainText_V3, RichText_V3 } from '../../../types/rich-text/v3';
import { isPlainTextType } from '../../../types/texts/texts';
import { ContentTypeEnum, ListTypesEnum } from '../types/editor-enums';
import { BulletListElementType, NumberedListElementType, ParagraphElementType } from '../types/editor-types';

export const migrateFromV2ToV3 = (response: RichText_V2 | PlainText_V2): RichText_V3 | PlainText_V3 =>
  isPlainText(response)
    ? {
        ...response,
        version: 3,
      }
    : migrateRichTextV2ToV3(response);

export const migrateRichTextV2ToV3 = (response: RichText_V2): RichText_V3 => ({
  ...response,
  version: 3,
  content: response.content.flatMap(unwrapIndent),
});

const unwrapIndent = (node: RichText_Content_V2): Descendant[] | Descendant => {
  if (!isIndent(node)) {
    if (isIndentable(node)) {
      return { ...node, indent: 0 };
    }

    return node;
  }

  return node.children.flatMap((child) =>
    isIndentable(child) || isIndent(child) ? unwrapIndent({ ...child, indent: (child.indent ?? 0) + 1 }) : child
  );
};

type Indentable = ParagraphElementType | BulletListElementType | NumberedListElementType;

const isIndentable = (node: RichText_Content_V2): node is Indentable =>
  node.type === ListTypesEnum.BULLET_LIST ||
  node.type === ListTypesEnum.NUMBERED_LIST ||
  node.type === ContentTypeEnum.PARAGRAPH;

const isIndent = (node: RichText_Content_V2): node is IndentElementType =>
  Element.isElement(node) && node.type === INDENT_TYPE;

const isPlainText = (response: RichText_V2 | PlainText_V2): response is PlainText_V2 =>
  isPlainTextType(response.textType);
