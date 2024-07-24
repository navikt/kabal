/* eslint-disable max-depth */
import {
  TNodeEntry,
  createPluginFactory,
  getNextNode,
  getNode,
  getNodeString,
  getParentNode,
  getPreviousNode,
  insertNodes,
  isElement,
  isText,
  setNodes,
} from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from '@udecode/plate-heading';
import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_OL, ELEMENT_UL } from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_TABLE, ELEMENT_TD, ELEMENT_TR } from '@udecode/plate-table';
import { Point, Range, Scrubber, isEditor } from 'slate';
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
import {
  H1Element,
  H2Element,
  H3Element,
  ListItemContainerElement,
  ParagraphElement,
  PlaceholderElement,
  RichText,
  RichTextEditorElement,
} from '@app/plate/types';
import { isOfElementTypesFn } from '@app/plate/utils/queries';

const DATE_REGEX =
  /(?:\d{2}(?:\.|-|\/)\d{2}(?:(?:\.|-|\/)\d{4})?)|(?:(?:\d+(?:\.|,| )?)+\d+(?:,-| kr(?:\.|,|:|;| |$)| kroner(?:\.|,|:|;| |$))?)/m;

type RichTextElement =
  | H1Element
  | H2Element
  | H3Element
  | ParagraphElement
  | ListItemContainerElement
  | PlaceholderElement;

const isRichTextElement = isOfElementTypesFn<RichTextElement>([
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_LIC,
  ELEMENT_PARAGRAPH,
  ELEMENT_PLACEHOLDER,
]);

const ENDINGS = ['.', ',', 'kr', 'kroner', ' '];

export const createNormalizeNodePlugin = createPluginFactory({
  key: 'normalize',
  withOverrides: (editor) => {
    const { normalizeNode } = editor;

    // eslint-disable-next-line complexity
    editor.normalizeNode<RichTextEditorElement | RichText> = ([node, path]) => {
      if (isText(node)) {
        let relevantText = node.text;
        let entries: TNodeEntry<RichText>[] = [[node, path]];

        while (relevantText.endsWith(' ')) {
          const nextEntry = getNextNode<RichText>(editor, { at: path, match: isText });

          if (nextEntry !== undefined) {
            entries = [...entries, nextEntry];
            relevantText += nextEntry[0].text;
          } else {
            break;
          }
        }

        while (relevantText.startsWith(' ')) {
          const prevEntry = getPreviousNode<RichText>(editor, { at: path, match: isText });

          if (prevEntry !== undefined) {
            entries = [prevEntry, ...entries];
            relevantText = prevEntry[0].text + relevantText;
          } else {
            break;
          }
        }

        const match = relevantText.match(DATE_REGEX);

        if (match !== null) {
          const { index } = match;
          const [matched] = match;

          if (matched !== undefined && index !== undefined) {
            const end = index + matched.trimEnd().length;

            let totalOffset = 0;
            entries = entries.filter((entry) => {
              const { length } = entry[0].text;

              if (totalOffset + length > index && totalOffset + 1 < end) {
                totalOffset += length;

                return true;
              }

              return false;
            });

            const lastOffset = end - entries.slice(0, -1).reduce((acc, [entry]) => acc + entry.text.length, 0);

            console.log({ entries, matched: matched.trimEnd(), index, lastOffset, end, totalOffset });
          }
        }

        // if (match === null) {
        //   if (node.nowrap === true) {
        //     // console.log('remove nowrap', node);

        //     return setNodes(
        //       editor,
        //       { nowrap: false },
        //       { at: path, split: true, mode: 'lowest', match: (n) => n === node },
        //     );
        //   }
        // } else if (node.nowrap === true) {
        //   // console.log('matched already nowrapped', node);

        //   if (editor.marks !== null) {
        //     editor.marks['nowrap'] = false;
        //   }

        //   const { index } = match;

        //   if (index !== undefined) {
        //     const [matched] = match;

        //     const at: Range = {
        //       anchor: { path, offset: index + matched.length },
        //       focus: { path, offset: node.text.length },
        //     };

        //     // console.log('remove nowrap', node, {
        //     //   matched,
        //     //   index,
        //     //   at,
        //     // });

        //     return setNodes(editor, { nowrap: false }, { at, split: true, mode: 'lowest', match: (n) => n === node });
        //   }
        // } else {
        //   const { index } = match;

        //   if (index !== undefined) {
        //     const [matched] = match;
        //     const at: Range = { anchor: { path, offset: index }, focus: { path, offset: index + matched.length } };

        //     console.log('add nowrap', node, {
        //       matched,
        //       index,
        //       at,
        //     });

        //     return setNodes(editor, { nowrap: true }, { at, split: true, mode: 'lowest', match: (n) => n === node });
        //   }
        // }
      } else if (isElement(node) && node.children.length === 0) {
        const [highestAncestorPath] = path;
        const highestAncestor =
          highestAncestorPath === undefined ? undefined : Scrubber.stringify(getNode(editor, [highestAncestorPath]));

        pushEvent('normalized-empty-children', 'smart-editor', {
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
