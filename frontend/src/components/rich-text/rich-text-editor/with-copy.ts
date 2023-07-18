/* eslint-disable max-lines */
import { format } from 'date-fns';
import { Descendant, Editor, Element, Text, Transforms } from 'slate';
import { PRETTY_FORMAT } from '@app/components/date-picker/constants';
import { isOfElementType, isOfElementTypes } from '@app/components/rich-text/types/editor-type-guards';
import {
  BulletListElementType,
  MaltekstElementType,
  NumberedListElementType,
  ParagraphElementType,
  RegelverkContainerType,
  RegelverkElementType,
  TableBodyElementType,
  TableCellElementType,
  TableElementType,
} from '@app/components/rich-text/types/editor-types';
import {
  CurrentDateType,
  FooterElementType,
  HeaderElementType,
  LabelContentElementType,
  PageBreakElementType,
  SignatureElementType,
} from '@app/components/rich-text/types/editor-void-types';
import { createSimpleParagraph } from '@app/components/smart-editor/templates/helpers';
import { isBlockActive } from '../functions/blocks';
import { isInMaltekst, isInPlaceholder } from '../functions/maltekst';
import {
  ContentTypeEnum,
  ListTypesEnum,
  TableContentEnum,
  TableTypeEnum,
  TextAlignEnum,
  UndeletableContentEnum,
  UndeletableVoidElementsEnum,
} from '../types/editor-enums';

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
    if (isOfElementType<PageBreakElementType>(node, UndeletableVoidElementsEnum.PAGE_BREAK)) {
      return [];
    }

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

    if (
      isOfElementTypes<HeaderElementType | FooterElementType>(node, [
        UndeletableVoidElementsEnum.HEADER,
        UndeletableVoidElementsEnum.FOOTER,
      ])
    ) {
      return { text: node.content ?? '' };
    }

    if (isOfElementType<LabelContentElementType>(node, UndeletableVoidElementsEnum.LABEL_CONTENT)) {
      return { text: node.result ?? '' };
    }

    if (isOfElementType<SignatureElementType>(node, UndeletableVoidElementsEnum.SIGNATURE)) {
      if (typeof node.medunderskriver !== 'undefined' && typeof node.saksbehandler !== 'undefined') {
        return [
          createSimpleParagraph(`${node.medunderskriver.name} / ${node.medunderskriver.title}`),
          createSimpleParagraph(`${node.saksbehandler.name} / ${node.saksbehandler.title}`),
        ];
      }

      if (typeof node.medunderskriver !== 'undefined') {
        return createSimpleParagraph(`${node.medunderskriver.name} / ${node.medunderskriver.title}`);
      }

      if (typeof node.saksbehandler !== 'undefined') {
        return createSimpleParagraph(`${node.saksbehandler.name} / ${node.saksbehandler.title}`);
      }

      return [];
    }

    if (isOfElementType<CurrentDateType>(node, UndeletableVoidElementsEnum.CURRENT_DATE)) {
      return { text: format(new Date(), PRETTY_FORMAT) };
    }

    if (
      isOfElementType<MaltekstElementType>(node, UndeletableContentEnum.MALTEKST) ||
      isOfElementType<RegelverkElementType>(node, UndeletableContentEnum.REGELVERK) ||
      isOfElementType<RegelverkContainerType>(node, UndeletableContentEnum.REGELVERK_CONTAINER)
    ) {
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
          row.children.reduce((acc, { colSpan }) => acc + colSpan, 0),
        ),
      0,
    );

  const tableBodies: TableBodyElementType[] = node.children.map((tbody, i) => {
    const rows = tbody.children.map((tr, ii) => {
      const columns = tr.children.reduce((acc, td) => acc + td.colSpan, 0);
      const diff = maxRowColSpan - columns;

      const cells: TableCellElementType[] = Array.from({ length: diff }, () => ({
        type: TableContentEnum.TD,
        colSpan: 1,
        children: [
          {
            type: ContentTypeEnum.PARAGRAPH,
            children: [{ text: '' }],
            indent: 0,
            textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
          },
        ],
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
        children: [
          {
            type: ContentTypeEnum.PARAGRAPH,
            children: [n],
            indent: 0,
            textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
          },
        ],
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
