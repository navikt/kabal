import { Descendant, Editor, Range, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { ContentTypeEnum, TextAlignEnum } from '../../rich-text/types/editor-enums';
import { isOfElementType } from '../../rich-text/types/editor-type-guards';
import { ParagraphElementType } from '../../rich-text/types/editor-types';

export const insertGodFormulering = (editor: Editor, content: Descendant[]) => {
  if (!isAvailable(editor)) {
    return;
  }

  Transforms.insertFragment(
    editor,
    content.concat(NEW_PARAGRAPH).map((c) => ({ ...c })),
    { voids: false }
  );
  ReactEditor.focus(editor);
};

export const isAvailable = (editor: Editor): boolean => {
  if (editor.selection === null || Range.isExpanded(editor.selection)) {
    return false;
  }

  const { focus } = editor.selection;

  if (focus.path.length !== 2 || focus.offset !== 0) {
    return false;
  }

  const [firstNode] = Editor.nodes<ParagraphElementType>(editor, {
    match: (n) => isOfElementType(n, ContentTypeEnum.PARAGRAPH),
    at: focus,
    mode: 'lowest',
  });

  return firstNode !== undefined;
};

const NEW_PARAGRAPH: ParagraphElementType = {
  type: ContentTypeEnum.PARAGRAPH,
  children: [{ text: '' }],
  textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
};
