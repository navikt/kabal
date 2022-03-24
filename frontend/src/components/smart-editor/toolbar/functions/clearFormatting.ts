import { Editor, Text, Transforms } from 'slate';
import { ContentTypeEnum, HeadingTypesEnum, TextAlignEnum, isOfElementTypes } from '../../editor-types';

export const clearFormatting = (editor: Editor) =>
  Editor.withoutNormalizing(editor, () => {
    if (editor.selection === null) {
      return;
    }

    Transforms.setNodes(editor, { bold: false, italic: false, underline: false }, { match: Text.isText });

    Transforms.setNodes(
      editor,
      { type: ContentTypeEnum.PARAGRAPH, textAlign: TextAlignEnum.TEXT_ALIGN_LEFT },
      { match: (n) => isOfElementTypes(n, [ContentTypeEnum.BLOCKQUOTE, ...Object.values(HeadingTypesEnum)]) }
    );
  });
