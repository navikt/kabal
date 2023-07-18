import { Editor, Transforms } from 'slate';
import { MAX_INDENT } from '../../smart-editor/constants';
import { ContentTypeEnum, ListTypesEnum } from '../types/editor-enums';
import { isOfElementTypesFn } from '../types/editor-type-guards';
import { BulletListElementType, NumberedListElementType, ParagraphElementType } from '../types/editor-types';

export const increaseIndent = (editor: Editor) => indent(editor, IndentEnum.INCREASE);
export const decreaseIndent = (editor: Editor) => indent(editor, IndentEnum.DECREASE);

enum IndentEnum {
  INCREASE,
  DECREASE,
}

const indent = (editor: Editor, indentDirection: IndentEnum) => {
  if (editor.selection === null) {
    return;
  }

  const indentableEntries = Editor.nodes(editor, {
    match: isOfElementTypesFn<ParagraphElementType | BulletListElementType | NumberedListElementType>([
      ContentTypeEnum.PARAGRAPH,
      ListTypesEnum.BULLET_LIST,
      ListTypesEnum.NUMBERED_LIST,
    ]),
    mode: 'highest',
  });

  const indentAmount = indentDirection === IndentEnum.INCREASE ? 1 : -1;

  for (const [element, at] of indentableEntries) {
    Transforms.setNodes(
      editor,
      { indent: clampInclusive((element.indent ?? 0) + indentAmount, 0, MAX_INDENT) },
      { match: (n) => n === element, at },
    );
  }
};

const clampInclusive = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
