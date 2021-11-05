import { Editor, Element, Node, Text, Transforms } from 'slate';
import { ContentTypeEnum, ElementTypes } from '../../editor-types';

export const isBlockActive = (editor: Editor, block: ElementTypes) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && n.type === block,
    universal: true,
  });
  return Boolean(match);
};

export const areBlocksActive = (editor: Editor, blocks: ElementTypes[]) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && blocks.includes(n.type),
    universal: true,
  });
  return Boolean(match);
};

export const toggleBlock = (editor: Editor, block: ElementTypes) => {
  const matches = Editor.nodes(editor, {
    mode: 'lowest',
    match: Element.isElement,
    universal: true,
  });

  const matchesArray = Array.from(matches);

  if (matchesArray.length !== 1) {
    return;
  }

  const [[, path]] = matchesArray;

  Editor.withoutNormalizing(editor, () => {
    if (path.length !== 1) {
      Transforms.liftNodes(editor, { at: path });
    }

    const isActive = isBlockActive(editor, block);

    Transforms.setNodes(
      editor,
      {
        type: isActive ? ContentTypeEnum.PARAGRAPH : block,
      },
      { match: Element.isElement }
    );
  });
};

export const createNewParagraph = (editor: Editor) => addBlock(editor, ContentTypeEnum.PARAGRAPH);

export const addBlock = (editor: Editor, type: ElementTypes) =>
  Editor.withoutNormalizing(editor, () => {
    Transforms.splitNodes(editor, { always: true });
    Transforms.setNodes(editor, { type }, { match: Element.isElement });
    Transforms.setNodes(
      editor,
      {
        ...editor.marks,
      },
      { match: Text.isText }
    );
  });

export const insertBlock = (editor: Editor, children: Node | Node[]): void =>
  Transforms.insertNodes(editor, children, { match: Element.isElement });
