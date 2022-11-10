import { Descendant, Editor, Element, Text, Transforms } from 'slate';
import { isBlockActive } from '../functions/blocks';
import { isInMaltekst, isInPlaceholder } from '../functions/maltekst';
import {
  ContentTypeEnum,
  ListTypesEnum,
  TableContentEnum,
  TableTypeEnum,
  UndeletableContentEnum,
} from '../types/editor-enums';
import { isOfElementType, isOfElementTypes } from '../types/editor-type-guards';
import {
  BulletListElementType,
  NumberedListElementType,
  ParagraphElementType,
  TableBodyElementType,
  TableCellElementType,
  TableElementType,
} from '../types/editor-types';

export const withCopy = (editor: Editor) => {
  const { insertData, insertText } = editor;

  editor.insertData = (data) => {
    const textData = data.getData('text/plain');

    if (isInPlaceholder(editor)) {
      return insertText(textData.replaceAll('\n', ' '));
    }

    if (isInMaltekst(editor)) {
      return;
    }

    const fragmentData = data.getData('application/x-slate-fragment');

    if (fragmentData.length !== 0) {
      const nodes = clipboardDecode(fragmentData);

      if (isBlockActive(editor, TableTypeEnum.TABLE)) {
        Transforms.insertFragment(editor, nodesToTableContent(nodes));

        return;
      }

      Transforms.insertFragment(editor, cleanNodes(nodes));

      return;
    }

    return insertData(data);
  };

  return editor;
};

const cleanNodes = (nodes: Descendant[]): Descendant[] =>
  nodes.flatMap((node) => {
    if (
      isOfElementTypes<ParagraphElementType | BulletListElementType | NumberedListElementType>(node, [
        ContentTypeEnum.PARAGRAPH,
        ListTypesEnum.BULLET_LIST,
        ListTypesEnum.NUMBERED_LIST,
      ])
    ) {
      return { ...node, indent: 0 };
    }

    if (isOfElementType<TableElementType>(node, TableTypeEnum.TABLE)) {
      // Return text from single td, not new table
      if (
        node.children.length === 1 &&
        node.children[0]?.children.length === 1 &&
        node.children[0]?.children[0]?.children.length === 1
      ) {
        return node.children[0]?.children[0]?.children[0]?.children ?? [];
      }

      return normalizedTable(node);
    }

    if (isOfElementType(node, UndeletableContentEnum.MALTEKST)) {
      return cleanNodes(node.children);
    }

    return node;
  });

const normalizedTable = (node: TableElementType): TableElementType => {
  const maxRowColSpan = node.children
    .flatMap(({ children }) => children)
    .reduce(
      (max, row) =>
        Math.max(
          max,
          row.children.reduce((acc, { colSpan }) => acc + colSpan, 0)
        ),
      0
    );

  const tableBodies: TableBodyElementType[] = node.children.map((tbody, i) => {
    const rows = tbody.children.map((tr, ii) => {
      const columns = tr.children.reduce((acc, td) => acc + td.colSpan, 0);
      const diff = maxRowColSpan - columns;

      const cells: TableCellElementType[] = Array.from({ length: diff }, () => ({
        type: TableContentEnum.TD,
        colSpan: 1,
        children: [{ text: '' }],
      }));

      const isFirstRow = i === 0 && ii === 0;

      return {
        ...tr,
        children: isFirstRow ? [...cells, ...tr.children] : [...tr.children, ...cells],
      };
    });

    return {
      ...tbody,
      children: rows,
    };
  });

  return { ...node, children: tableBodies };
};

const nodesToTableContent = (nodes: Descendant[]): Descendant[] =>
  nodes.flatMap((n) => {
    if (isOfElementType<TableElementType>(n, TableTypeEnum.TABLE)) {
      return nodesToTextNodes(n.children);
    }

    if (isOfElementType(n, UndeletableContentEnum.MALTEKST)) {
      return nodesToTableContent(n.children);
    }

    if (Element.isElement(n)) {
      return {
        type: TableContentEnum.TD,
        colSpan: 1,
        children: [n],
      };
    }

    return n;
  });

const nodesToTextNodes = (nodes: Descendant[]): Text[] => {
  const textNodes: Text[] = [];

  for (const node of nodes) {
    if (Text.isText(node)) {
      textNodes.push(node);
    } else if (textNodes.length !== 0) {
      textNodes.push({ text: '\n' }, ...nodesToTextNodes(node.children));
    } else {
      textNodes.push(...nodesToTextNodes(node.children));
    }
  }

  return textNodes;
};

const clipboardDecode = (str: string): Descendant[] => JSON.parse(decodeURIComponent(window.atob(str)));
