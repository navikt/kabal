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
import {
  createEmptyVoid,
  createRegelverkContainer,
  createSimpleListItem,
  createSimpleListItemContainer,
  createSimpleParagraph,
  createTableCell,
  createTableRow,
} from '@app/plate/templates/helpers';
import { LogLevel } from '@grafana/faro-web-sdk';
import {
  BaseParagraphPlugin,
  type TNode,
  type TPath,
  getNode,
  getParentNode,
  insertNodes,
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
import { Scrubber } from 'slate';

const module = 'normalize';

export const normalizeNodePlugin = createPlatePlugin({
  key: 'normalize',
  extendEditor: ({ editor }) => {
    const { normalizeNode } = editor;

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
          pushLog('Missing node type, but no parent. Unable to normalize.', options, LogLevel.ERROR);

          return normalizeNode([node, path]);
        }

        const [parentNode] = parentEntry;

        if (!isElement(parentNode)) {
          pushLog('Missing node type, but parent node is not element. Unable to normalize.', options, LogLevel.ERROR);

          return normalizeNode([node, path]);
        }

        switch (parentNode.type) {
          case BaseListItemPlugin.key: {
            pushLog('Normalized missing LIC', options);

            return setNodes(editor, { type: BaseListItemContentPlugin.key }, { at: path, match: (n) => n === node });
          }
          default:
            pushLog(
              'Missing node type, but parent type was not LIC. Case not implemented.',
              { ...options, context: { ...options.context, parent: Scrubber.stringify(parentNode) } },
              LogLevel.ERROR,
            );

            return normalizeNode([node, path]);
        }
      }

      if (node.children.length === 0) {
        pushNodeEvent(editor, node, path, 'normalized-empty-children');

        const options = { at: [...path, 0] };

        switch (node.type) {
          case BaseBulletedListPlugin.key:
          case BaseNumberedListPlugin.key:
            return insertNodes(editor, createSimpleListItem(), options);
          case BaseListItemPlugin.key:
            return insertNodes(editor, createSimpleListItemContainer(), options);
          case BaseTablePlugin.key:
            return insertNodes(editor, createTableRow(), options);
          case BaseTableRowPlugin.key:
            return insertNodes(editor, createTableCell(), options);
          case BaseTableCellPlugin.key:
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
          case BaseParagraphPlugin.key:
          case HEADING_KEYS.h1:
          case HEADING_KEYS.h2:
          case HEADING_KEYS.h3:
          case BaseListItemContentPlugin.key:
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
