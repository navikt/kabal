import { pushEvent, pushLog } from '@app/observability';
import {
  ELEMENT_CURRENT_DATE,
  ELEMENT_EMPTY_VOID,
  ELEMENT_FOOTER,
  ELEMENT_HEADER,
  ELEMENT_LABEL_CONTENT,
  ELEMENT_MALTEKST,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_PAGE_BREAK,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
  ELEMENT_REGELVERK_CONTAINER,
  ELEMENT_SIGNATURE,
} from '@app/plate/plugins/element-types';
import { MaltekstPlugin } from '@app/plate/plugins/maltekst';
import { RedigerbarMaltekstPlugin } from '@app/plate/plugins/redigerbar-maltekst';
import { RegelverkContainerPlugin } from '@app/plate/plugins/regelverk';
import {
  createEmptyVoid,
  createRegelverkContainer,
  createSimpleListItem,
  createSimpleListItemContainer,
  createSimpleParagraph,
  createTableCell,
  createTableRow,
} from '@app/plate/templates/helpers';
import {
  type MaltekstElement,
  type RedigerbarMaltekstElement,
  type RegelverkContainerElement,
  type TableCellElement,
  TextAlign,
} from '@app/plate/types';
import { isOfElementTypesFn } from '@app/plate/utils/queries';
import { LogLevel } from '@grafana/faro-web-sdk';
import {
  BaseParagraphPlugin,
  type TNode,
  type TPath,
  getNode,
  getParentNode,
  insertNodes,
  isEditor,
  isElement,
  setNodes,
} from '@udecode/plate-common';
import { type PlateEditor, createPlatePlugin } from '@udecode/plate-core/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import {
  BaseBulletedListPlugin,
  BaseListItemContentPlugin,
  BaseListItemPlugin,
  BaseNumberedListPlugin,
} from '@udecode/plate-list';
import { BaseTableCellPlugin, BaseTablePlugin, BaseTableRowPlugin } from '@udecode/plate-table';
import { TableCellPlugin } from '@udecode/plate-table/react';
import { Scrubber } from 'slate';

const module = 'normalize';

type TopLevelElement = RedigerbarMaltekstElement | MaltekstElement | RegelverkContainerElement | TableCellElement;

const isTopLevelElement = isOfElementTypesFn<TopLevelElement>([
  RedigerbarMaltekstPlugin.node.type,
  MaltekstPlugin.node.type,
  RegelverkContainerPlugin.node.type,
  TableCellPlugin.node.type,
]);

export const normalizeNodePlugin = createPlatePlugin({
  key: 'normalize',
  extendEditor: ({ editor }) => {
    const { normalizeNode } = editor;

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
    editor.normalizeNode = ([node, path]) => {
      if (!isElement(node)) {
        return normalizeNode([node, path]);
      }

      if (node.type === undefined) {
        pushNodeEvent(editor, node, path, 'normalized-undefined-type');

        pushLog(`Looking for parent node at: ${JSON.stringify(path)}`, { context: { module } });

        const parentEntry = getParentNode(editor, path);

        pushLog(`Found parent entry: ${Scrubber.stringify(parentEntry)})`, { context: { module } });

        const options = { context: { node: Scrubber.stringify(node), path: JSON.stringify(path) } };

        if (parentEntry === undefined) {
          pushLog('Missing node type, but no parent. Setting type to paragraph.', options, LogLevel.WARN);

          return setNodes(
            editor,
            { type: BaseParagraphPlugin.node.type, align: TextAlign.LEFT },
            { at: path, match: (n) => n === node },
          );
        }

        const [parentNode] = parentEntry;

        const isParentTopLevelElement = isTopLevelElement(parentNode);

        if (isParentTopLevelElement || isEditor(parentNode)) {
          pushLog(
            `Missing node type, element at top level in "${isParentTopLevelElement ? parentNode.type : 'editor'}". Setting type to paragraph.`,
            options,
            LogLevel.WARN,
          );

          return setNodes(
            editor,
            { type: BaseParagraphPlugin.node.type, align: TextAlign.LEFT },
            { at: path, match: (n) => n === node },
          );
        }

        if (!isElement(parentNode)) {
          pushLog(
            'Missing node type, but parent node is not element. Setting parent type to paragraph.',
            options,
            LogLevel.WARN,
          );

          return setNodes(
            editor,
            { type: BaseParagraphPlugin.node.type },
            { at: path, match: (n) => n === parentNode },
          );
        }

        if (parentNode.type === BaseListItemPlugin.node.type) {
          pushLog('Normalized missing LIC', options);

          return setNodes(
            editor,
            { type: BaseListItemContentPlugin.node.type },
            { at: path, match: (n) => n === node },
          );
        }

        pushLog(
          `Missing node type, but normalization is not implemented for parent with type "${parentNode.type}".`,
          { ...options, context: { ...options.context, parent: Scrubber.stringify(parentNode) } },
          LogLevel.ERROR,
        );

        return normalizeNode([node, path]);
      }

      if (node.children.length === 0) {
        pushNodeEvent(editor, node, path, 'normalized-empty-children');

        const options = { at: [...path, 0] };

        switch (node.type) {
          case BaseBulletedListPlugin.node.type:
          case BaseNumberedListPlugin.node.type:
            return insertNodes(editor, createSimpleListItem(), options);
          case BaseListItemPlugin.node.type:
            return insertNodes(editor, createSimpleListItemContainer(), options);
          case BaseTablePlugin.node.type:
            return insertNodes(editor, createTableRow(), options);
          case BaseTableRowPlugin.node.type:
            return insertNodes(editor, createTableCell(), options);
          case BaseTableCellPlugin.node.type:
            return insertNodes(editor, createSimpleParagraph(), options);
          case ELEMENT_REDIGERBAR_MALTEKST:
            return insertNodes(editor, createSimpleParagraph(), options);
          case ELEMENT_MALTEKST:
          case ELEMENT_MALTEKSTSEKSJON:
            return insertNodes(editor, createEmptyVoid(), options);
          case ELEMENT_REGELVERK_CONTAINER:
            return insertNodes(editor, createSimpleParagraph(), options);
          case ELEMENT_REGELVERK:
            return insertNodes(editor, createRegelverkContainer(), options);
          // Use extensive case instead of default in order to avoid inserting wrong node type when a new element type is introduced
          case BaseParagraphPlugin.node.type:
          case HEADING_KEYS.h1:
          case HEADING_KEYS.h2:
          case HEADING_KEYS.h3:
          case BaseListItemContentPlugin.node.type:
          case ELEMENT_PLACEHOLDER:
          case ELEMENT_PAGE_BREAK:
          case ELEMENT_CURRENT_DATE:
          case ELEMENT_EMPTY_VOID:
          case ELEMENT_HEADER:
          case ELEMENT_FOOTER:
          case ELEMENT_LABEL_CONTENT:
          case ELEMENT_SIGNATURE:
            return insertNodes(editor, { text: '' }, options);
        }
      }

      normalizeNode([node, path]);
    };

    return editor;
  },
});

const pushNodeEvent = (editor: PlateEditor, node: TNode, path: TPath, name: string) => {
  const [highestAncestorPath] = path;
  const highestAncestor =
    highestAncestorPath === undefined ? undefined : Scrubber.stringify(getNode(editor, [highestAncestorPath]));

  pushEvent(name, 'smart-editor', {
    ancestor: JSON.stringify(highestAncestor),
    node: Scrubber.stringify(node),
    path: JSON.stringify(path),
  });
};
