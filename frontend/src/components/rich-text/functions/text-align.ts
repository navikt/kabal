import { Editor, Element, Transforms } from 'slate';
import { TextAlignEnum } from '../types/editor-enums';
import { isNodeAlignableElementType } from '../types/editor-type-guards';

export const setTextAlign = (editor: Editor, textAlign: TextAlignEnum) => {
  Transforms.setNodes(
    editor,
    { textAlign },
    {
      match: (n) => Element.isElement(n) && isNodeAlignableElementType(n),
    }
  );
};

export const isTextAlignActive = (editor: Editor, textAlign: TextAlignEnum) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      Element.isElement(n) &&
      isNodeAlignableElementType(n) &&
      (n.textAlign ?? TextAlignEnum.TEXT_ALIGN_LEFT) === textAlign,
  });
  return Boolean(match);
};

export const isTextAlignAvailable = (editor: Editor) => {
  const [match] = Editor.nodes(editor, {
    match: isNodeAlignableElementType,
  });
  return Boolean(match);
};
