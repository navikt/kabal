import { Editor, Element, NodeMatch, Transforms } from 'slate';
import { MaximizeMode } from 'slate/dist/interfaces/types';
import { ContentTypeEnum } from '../types/editor-enums';
import { isOfElementTypeFn } from '../types/editor-type-guards';
import { NonVoidElementTypes } from '../types/editor-types';
import { VoidElementTypes } from '../types/editor-void-types';

export const increaseIndent = (editor: Editor) => {
  if (editor.selection === null) {
    return;
  }

  const [node] = Editor.nodes(editor, { match: isOfElementTypeFn(ContentTypeEnum.INDENT), mode: 'lowest' });
  const isInIndent = node !== undefined;

  const mode: MaximizeMode = isInIndent ? 'lowest' : 'highest';
  const match: NodeMatch<NonVoidElementTypes | VoidElementTypes> = isInIndent
    ? isOfElementTypeFn(ContentTypeEnum.INDENT)
    : Element.isElement;

  Transforms.wrapNodes(
    editor,
    { type: ContentTypeEnum.INDENT, children: [] },
    { match, mode, voids: false, split: false }
  );
};

export const decreaseIndent = (editor: Editor) => {
  if (editor.selection === null) {
    return;
  }

  Transforms.unwrapNodes(editor, {
    match: isOfElementTypeFn(ContentTypeEnum.INDENT),
    mode: 'lowest',
    voids: false,
    split: true,
  });
};
