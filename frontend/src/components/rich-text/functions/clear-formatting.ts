import { Editor, Text, Transforms } from 'slate';
import { ContentTypeEnum, HeadingTypesEnum, TextAlignEnum } from '../types/editor-enums';
import { isOfElementTypes } from '../types/editor-type-guards';

export const clearFormatting = (editor: Editor) =>
  Editor.withoutNormalizing(editor, () => {
    if (editor.selection === null) {
      return;
    }

    Transforms.setNodes(editor, { bold: false, italic: false, underline: false }, { match: Text.isText });

    Transforms.setNodes(
      editor,
      { type: ContentTypeEnum.PARAGRAPH, textAlign: TextAlignEnum.TEXT_ALIGN_LEFT },
      { match: (n) => isOfElementTypes(n, [ContentTypeEnum.INDENT, ...Object.values(HeadingTypesEnum)]) },
    );
  });
