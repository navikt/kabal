import { Editor, Element, Node, Path, Range, Text, Transforms } from 'slate';
import { ContentTypeEnum, ElementTypesEnum, ListContentEnum, ListTypesEnum } from '../../editor-enums';
import { isOfElementType, isOfElementTypes } from '../../editor-type-guards';
import { BulletListElementType, NumberedListElementType } from '../../editor-types';
import { pruneSelection } from './pruneSelection';

export const isBlockActive = (editor: Editor, block: ElementTypesEnum) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => isOfElementType(n, block),
    reverse: true,
    universal: true,
  });
  return Boolean(match);
};

export const areBlocksActive = (editor: Editor, blocks: ElementTypesEnum[], universal = true) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => isOfElementTypes(n, blocks),
    reverse: true,
    universal,
  });
  return Boolean(match);
};

export const areElementsActive = (editor: Editor, elementTypes: ElementTypesEnum[]) =>
  elementTypes.some((element) => isElementActive(editor, element));

export const isElementActive = (editor: Editor, elementType: ElementTypesEnum) => {
  const elements = getLowestSelectedElements(editor);

  for (const [element] of elements) {
    if (element.type === elementType) {
      return true;
    }
  }

  return false;
};

export const getSelectedListTypes = (
  editor: Editor
): {
  [key in ListTypesEnum]: boolean;
} => {
  if (editor.selection === null) {
    return {
      [ListTypesEnum.BULLET_LIST]: false,
      [ListTypesEnum.NUMBERED_LIST]: false,
    };
  }

  if (Range.isCollapsed(editor.selection)) {
    const [listMatch] = Editor.nodes<BulletListElementType | NumberedListElementType>(editor, {
      match: (n) => isOfElementTypes(n, [ListTypesEnum.BULLET_LIST, ListTypesEnum.NUMBERED_LIST]),
      mode: 'lowest',
    });

    if (typeof listMatch === 'undefined') {
      return {
        [ListTypesEnum.BULLET_LIST]: false,
        [ListTypesEnum.NUMBERED_LIST]: false,
      };
    }

    return {
      [ListTypesEnum.BULLET_LIST]: listMatch[0].type === ListTypesEnum.BULLET_LIST,
      [ListTypesEnum.NUMBERED_LIST]: listMatch[0].type === ListTypesEnum.NUMBERED_LIST,
    };
  }

  const selection = pruneSelection(editor);

  if (selection === null) {
    return {
      [ListTypesEnum.BULLET_LIST]: false,
      [ListTypesEnum.NUMBERED_LIST]: false,
    };
  }

  const [...listItemContainerEntries] = Editor.nodes<BulletListElementType | NumberedListElementType>(editor, {
    match: (n) => isOfElementType(n, ListContentEnum.LIST_ITEM_CONTAINER),
    mode: 'lowest',
    at: selection,
  });

  const listEntries = listItemContainerEntries.map(([, licPath]) => Editor.parent(editor, Path.parent(licPath)));

  const hasBulletList = listEntries.some(([node]) => isOfElementType(node, ListTypesEnum.BULLET_LIST));
  const hasNumberedList = listEntries.some(([node]) => isOfElementType(node, ListTypesEnum.NUMBERED_LIST));

  return {
    [ListTypesEnum.BULLET_LIST]: hasBulletList,
    [ListTypesEnum.NUMBERED_LIST]: hasNumberedList,
  };
};

export const getLowestSelectedElements = (editor: Editor) =>
  Editor.nodes<Element>(editor, {
    match: (n) => Element.isElement(n),
    mode: 'lowest',
    reverse: true,
  });

export const toggleBlock = (editor: Editor, block: ElementTypesEnum) => {
  const matches = Editor.nodes(editor, {
    mode: 'lowest',
    match: Element.isElement,
    universal: true,
  });

  const matchesArray = Array.from(matches);

  if (matchesArray.length !== 1) {
    return;
  }

  const [first] = matchesArray;

  if (first === undefined) {
    return;
  }

  const [, path] = first;

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

export const addBlock = (editor: Editor, type: ElementTypesEnum) =>
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
