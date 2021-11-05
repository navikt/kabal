import { Editor, Element, Range, Text, Transforms } from 'slate';
import { ContentTypeEnum, TextAlignEnum } from '../../editor-types';

export const clearFormatting = (editor: Editor) =>
  Editor.withoutNormalizing(editor, () => {
    if (editor.selection === null) {
      return;
    }

    if (Range.isExpanded(editor.selection)) {
      Transforms.setNodes(
        editor,
        { bold: false, italic: false, underline: false },
        { match: Text.isText, split: true }
      );
      return;
    }

    const matches = Editor.nodes(editor, {
      mode: 'all',
      match: Element.isElement,
      universal: true,
    });

    if (Array.from(matches).length !== 1) {
      Transforms.liftNodes(editor);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [[_, path]] = Editor.nodes(editor, {
      mode: 'lowest',
      match: Element.isElement,
      universal: true,
    });
    Transforms.setNodes(editor, { type: ContentTypeEnum.PARAGRAPH }, { match: Element.isElement });
    Transforms.setNodes(editor, { bold: false, italic: false, underline: false }, { at: path, match: Text.isText });
    Transforms.setNodes(editor, { textAlign: TextAlignEnum.TEXT_ALIGN_LEFT }, { at: path, match: Element.isElement });
  });
