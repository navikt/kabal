import { BOOKMARK_PREFIX, COMMENT_PREFIX } from '@app/components/smart-editor/constants';
import { formatLongDate } from '@app/domain/date';
import { BookmarkPlugin } from '@app/plate/plugins/bookmark';
import { CommentsPlugin } from '@app/plate/plugins/comments';
import { trimFragment } from '@app/plate/plugins/copy/trim-fragment';
import {
  ELEMENT_CURRENT_DATE,
  ELEMENT_EMPTY_VOID,
  ELEMENT_FOOTER,
  ELEMENT_HEADER,
  ELEMENT_LABEL_CONTENT,
  ELEMENT_MALTEKST,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
  ELEMENT_REGELVERK_CONTAINER,
  ELEMENT_SIGNATURE,
} from '@app/plate/plugins/element-types';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import type {
  CurrentDateElement,
  FooterElement,
  FormattedText,
  HeaderElement,
  LabelContentElement,
  SignatureElement,
} from '@app/plate/types';
import { isOfElementType } from '@app/plate/utils/queries';
import {
  type TDescendant,
  type TNodeEntry,
  type TText,
  getNodeFragment,
  getNodeTexts,
  isCollapsed,
  isElement,
} from '@udecode/plate-common';
import { type PlateEditor, createPlatePlugin } from '@udecode/plate-core/react';
import { Range } from 'slate';

const cleanNodes = (editor: PlateEditor, node: TDescendant | TDescendant[]): TDescendant | TDescendant[] => {
  if (Array.isArray(node)) {
    return node.flatMap((child) => cleanNodes(editor, child));
  }

  if (!isElement(node)) {
    return removeCommentAndBookmarkMarks(node);
  }

  if (node.type === ELEMENT_EMPTY_VOID) {
    return [];
  }

  if (isOfElementType<CurrentDateElement>(node, ELEMENT_CURRENT_DATE)) {
    const now = new Date();
    const formatted = formatLongDate(now.getFullYear(), now.getMonth(), now.getDate());

    return [createSimpleParagraph(`Dato: ${formatted}`)];
  }

  if (isOfElementType<FooterElement>(node, ELEMENT_FOOTER) || isOfElementType<HeaderElement>(node, ELEMENT_HEADER)) {
    return node.content === null ? [] : [createSimpleParagraph(node.content)];
  }

  if (isOfElementType<SignatureElement>(node, ELEMENT_SIGNATURE)) {
    const saksbehandler =
      node.saksbehandler === undefined
        ? []
        : [createSimpleParagraph(`${node.saksbehandler.name}\n${node.saksbehandler.title}`)];

    const medunderskriver =
      node.medunderskriver === undefined
        ? []
        : [createSimpleParagraph(`${node.medunderskriver.name}\n${node.medunderskriver.title}`)];

    return [...saksbehandler, ...medunderskriver];
  }

  if (isOfElementType<LabelContentElement>(node, ELEMENT_LABEL_CONTENT)) {
    return node.result === undefined ? [] : { text: node.result };
  }

  const { type, children } = node;

  if (
    type === ELEMENT_MALTEKSTSEKSJON ||
    type === ELEMENT_MALTEKST ||
    type === ELEMENT_REDIGERBAR_MALTEKST ||
    type === ELEMENT_REGELVERK ||
    type === ELEMENT_REGELVERK_CONTAINER
  ) {
    return children.flatMap((child) => cleanNodes(editor, child));
  }

  return {
    ...node,
    children: children.flatMap((child) => cleanNodes(editor, child)),
  };
};

const withOverrides = (editor: PlateEditor) => {
  const { setFragmentData, insertFragment, insertData } = editor;

  editor.insertData = (data: DataTransfer) => {
    const plainText = data.getData('text/plain');
    const html = data.getData('text/html');

    // When copying from a PDF, Chrome will put plain text in text/html, which results in line breaks being replaced by spaces
    if (trimFragment(html) === plainText.trim()) {
      // data.clearData('text/html') doesn't work
      const newData = new DataTransfer();

      for (const type of data.types) {
        if (type !== 'text/html') {
          newData.setData(type, data.getData(type));
        }
      }

      return insertData(newData);
    }

    return insertData(data);
  };

  editor.insertFragment = (descendants: TDescendant[]) => {
    const nodes = cleanNodes(editor, descendants);

    return insertFragment(Array.isArray(nodes) ? nodes : [nodes]);
  };

  editor.setFragmentData = (data, originEvent) => {
    const { selection } = editor;

    if (selection === null || isCollapsed(selection)) {
      setFragmentData(data, originEvent);

      return;
    }

    const start = Range.start(selection);
    const end = Range.end(selection);

    const slateFragments = cleanNodes(editor, getNodeFragment(editor, selection));

    data.setData('application/x-slate-fragment', window.btoa(encodeURIComponent(JSON.stringify(slateFragments))));

    const textsGenerator = getNodeTexts(editor, { from: start.path, to: end.path });
    const textEntries = [...textsGenerator];

    if (textEntries.length === 0) {
      setFragmentData(data, originEvent);

      return;
    }

    const firstEntry = textEntries.at(0);
    const lastEntry = textEntries.at(-1);

    if (firstEntry === undefined || lastEntry === undefined) {
      setFragmentData(data, originEvent);

      return;
    }

    const [firstNode, firstPath] = firstEntry;
    const [lastNode, lastPath] = lastEntry;

    const selectedTextEntries: TNodeEntry<FormattedText | TText | { text: '' }>[] =
      firstEntry === lastEntry
        ? [[{ ...firstNode, text: firstNode.text.slice(start.offset, end.offset) }, firstPath]]
        : [
            [{ ...firstNode, text: firstNode.text.slice(start.offset) }, firstPath],
            ...textEntries.slice(1, -1),
            [{ ...lastNode, text: lastNode.text.slice(0, end.offset) }, lastPath],
          ];

    data.setData('text/plain', selectedTextEntries.map(([node]) => node.text).join(' '));
  };

  return editor;
};

const removeCommentAndBookmarkMarks = (textNode: TText) => {
  const cleanTextNode = { ...textNode };

  for (const prop of Object.keys(cleanTextNode)) {
    if (prop.startsWith(COMMENT_PREFIX) || prop.startsWith(BOOKMARK_PREFIX)) {
      delete cleanTextNode[prop];
    }
  }

  delete cleanTextNode[CommentsPlugin.key];
  delete cleanTextNode[BookmarkPlugin.key];

  return cleanTextNode;
};

export const CopyPlugin = createPlatePlugin({
  key: 'copy',
  extendEditor: ({ editor }) => withOverrides(editor),
});
