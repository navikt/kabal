import { createPluginFactory, getNode, insertNodes, isElement } from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from '@udecode/plate-heading';
import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_OL, ELEMENT_UL } from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_TABLE, ELEMENT_TD, ELEMENT_TR } from '@udecode/plate-table';
import { Scrubber } from 'slate';
import { pushEvent } from '@app/observability';
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
import { RichTextEditorElement } from '@app/plate/types';

export const createNormalizeNodePlugin = createPluginFactory({
  key: 'normalize',
  withOverrides: (editor) => {
    const { normalizeNode } = editor;

    // eslint-disable-next-line complexity
    editor.normalizeNode<RichTextEditorElement> = ([node, path]) => {
      if (isElement(node) && node.children.length === 0) {
        const [highestAncestorPath] = path;
        const highestAncestor =
          highestAncestorPath === undefined ? undefined : Scrubber.stringify(getNode(editor, [highestAncestorPath]));

        pushEvent('normalized-empty-children', {
          ancestor: JSON.stringify(highestAncestor),
          node: JSON.stringify(node),
          path: JSON.stringify(path),
        });

        const options = { at: [...path, 0] };

        switch (node.type) {
          case ELEMENT_UL:
          case ELEMENT_OL:
            return insertNodes(editor, createSimpleListItem(), options);
          case ELEMENT_LI:
            return insertNodes(editor, createSimpleListItemContainer(), options);
          case ELEMENT_TABLE:
            return insertNodes(editor, createTableRow(), options);
          case ELEMENT_TR:
            return insertNodes(editor, createTableCell(), options);
          case ELEMENT_TD:
            return insertNodes(editor, createSimpleParagraph(), options);
          case ELEMENT_MALTEKST:
          case ELEMENT_REDIGERBAR_MALTEKST:
          case ELEMENT_MALTEKSTSEKSJON:
            return insertNodes(editor, createEmptyVoid(), options);
          case ELEMENT_REGELVERK_CONTAINER:
            return insertNodes(editor, createSimpleParagraph(), options);
          case ELEMENT_REGELVERK:
            return insertNodes(editor, createRegelverkContainer(), options);
          // Use extensive case instead of default in order to avoid inserting wrong node type when a new element type is introduced
          case ELEMENT_PARAGRAPH:
          case ELEMENT_H1:
          case ELEMENT_H2:
          case ELEMENT_H3:
          case ELEMENT_LIC:
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
