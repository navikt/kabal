import { Editor, Element, NodeEntry, Path, Range, Text, Transforms } from 'slate';
import {
  ContentTypeEnum,
  ElementTypesEnum,
  ListContentEnum,
  ListTypesEnum,
  NonVoidElementsEnum,
  TableContentEnum,
  TableTypeEnum,
} from '../types/editor-enums';
import { isOfElementType, isOfElementTypeFn, isOfElementTypesFn } from '../types/editor-type-guards';
import { BulletListElementType, NumberedListElementType } from '../types/editor-types';
import { pruneSelection } from './prune-selection';

const ALLOWED_TABLE_ELEMENTS: NonVoidElementsEnum[] = [
  ContentTypeEnum.PLACEHOLDER,

  TableContentEnum.TBODY,
  TableContentEnum.TR,
  TableContentEnum.TD,

  ListTypesEnum.BULLET_LIST,
  ListTypesEnum.NUMBERED_LIST,
  ListContentEnum.LIST_ITEM,
  ListContentEnum.LIST_ITEM_CONTAINER,
];

export const getCurrentElement = <T extends Element>(
  editor: Editor,
  type: NonVoidElementsEnum
): NodeEntry<T> | undefined => {
  const [element] = Editor.nodes<T>(editor, { match: isOfElementTypeFn<T>(type) });

  return element;
};

export const isBlockActive = (editor: Editor, block: ElementTypesEnum) => {
  const [match] = Editor.nodes(editor, { match: isOfElementTypeFn(block), reverse: true, universal: true });

  return Boolean(match);
};

export const areBlocksActive = (editor: Editor, blocks: ElementTypesEnum[], universal = true) => {
  const [match] = Editor.nodes(editor, { match: isOfElementTypesFn(blocks), reverse: true, universal });

  return Boolean(match);
};

// const areElementsActive = (editor: Editor, elementTypes: ElementTypesEnum[]) =>
//   elementTypes.some((element) => isElementActive(editor, element));

// const isElementActive = (editor: Editor, elementType: ElementTypesEnum) => {
//   const elements = getLowestSelectedElements(editor);

//   for (const [element] of elements) {
//     if (element.type === elementType) {
//       return true;
//     }
//   }

//   return false;
// };

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
      match: isOfElementTypesFn([ListTypesEnum.BULLET_LIST, ListTypesEnum.NUMBERED_LIST]),
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
    match: isOfElementTypeFn(ListContentEnum.LIST_ITEM_CONTAINER),
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

// const getLowestSelectedElements = (editor: Editor) =>
//   Editor.nodes<Element>(editor, { match: Element.isElement, mode: 'lowest', reverse: true });

export const toggleBlock = (editor: Editor, block: NonVoidElementsEnum) => {
  const [table] = Editor.nodes(editor, { match: isOfElementTypeFn(TableTypeEnum.TABLE) });

  if (typeof table !== 'undefined' && !ALLOWED_TABLE_ELEMENTS.includes(block)) {
    return;
  }

  const matches = Editor.nodes(editor, { mode: 'lowest', match: Element.isElement, universal: true });

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

    Transforms.setNodes(editor, { type: isActive ? ContentTypeEnum.PARAGRAPH : block }, { match: Element.isElement });
  });
};

export const createNewParagraph = (editor: Editor) => addBlock(editor, ContentTypeEnum.PARAGRAPH);

const addBlock = (editor: Editor, type: ContentTypeEnum) =>
  Editor.withoutNormalizing(editor, () => {
    Transforms.splitNodes(editor, { always: true });
    Transforms.setNodes(editor, { type }, { match: Element.isElement });
    Transforms.setNodes(editor, { ...editor.marks }, { match: Text.isText });
  });

// const insertBlock = (editor: Editor, children: Node | Node[]): void =>
//   Transforms.insertNodes(editor, children, { match: Element.isElement });
