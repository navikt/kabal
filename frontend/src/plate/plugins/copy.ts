import {
  AnyObject,
  TElement,
  TNodeEntry,
  TText,
  createPluginFactory,
  getNode,
  getNodeTexts,
  isCollapsed,
  isElement,
} from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from '@udecode/plate-heading';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { Path, Range } from 'slate';
import { COMMENT_PREFIX } from '@app/components/smart-editor/constants';
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import {
  EditorValue,
  H1Element,
  H2Element,
  H3Element,
  ParagraphElement,
  RichText,
  RichTextEditor,
  TextAlign,
} from '@app/plate/types';
import { isOfElementType } from '@app/plate/utils/queries';

const SIMPLE_ELEMENTS = new Set([ELEMENT_H1, ELEMENT_H2, ELEMENT_H3]);
type SimpleElements = H1Element | H2Element | H3Element;
type AllowedElements = SimpleElements | ParagraphElement;

const withOverrides = (editor: RichTextEditor) => {
  const { setFragmentData } = editor;

  editor.setFragmentData = (data, originEvent) => {
    const { selection } = editor;

    if (selection === null || isCollapsed(selection)) {
      setFragmentData(data, originEvent);

      return;
    }

    const start = Range.start(selection);
    const end = Range.end(selection);

    const textsGenerator = getNodeTexts(editor, { from: start.path, to: end.path });
    const textEntries = new Array(...textsGenerator);

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

    const selectedTextEntries: TNodeEntry<RichText | TText | { text: '' }>[] =
      firstEntry === lastEntry
        ? [[{ ...firstNode, text: firstNode.text.slice(start.offset, end.offset) }, firstPath]]
        : [
            [{ ...firstNode, text: firstNode.text.slice(start.offset) }, firstPath],
            ...textEntries.slice(1, -1),
            [{ ...lastNode, text: lastNode.text.slice(0, end.offset) }, lastPath],
          ];

    const wrappedTextNodes: {
      key: string;
      element: AllowedElements;
    }[] = [];

    for (const entry of selectedTextEntries) {
      const [originalTextNode, textPath] = entry;

      const textNode = originEvent === 'copy' ? removeCommentMarks(originalTextNode) : originalTextNode;

      for (let i = textPath.length - 1; i > 0; i--) {
        const parentPath = textPath.slice(0, i);

        const parentNode = getNode(editor, parentPath);

        if (!isElement(parentNode)) {
          continue;
        }

        const key = (parentNode.type === ELEMENT_PLACEHOLDER ? Path.parent(parentPath) : parentPath).join(',');

        const existing = wrappedTextNodes.find((w) => w.key === key);

        if (existing !== undefined) {
          const { element } = existing;

          element.children.push(textNode);

          break;
        }

        if (isOfElementType<ParagraphElement>(parentNode, ELEMENT_PARAGRAPH)) {
          const isFirstElement = wrappedTextNodes.length === 0;

          wrappedTextNodes.push({
            key,
            element: {
              ...parentNode,
              align: isFirstElement ? TextAlign.LEFT : parentNode.align,
              indent: isFirstElement ? 0 : parentNode.indent,
              children: [textNode],
            },
          });

          break;
        }

        if (isSimpleElement(parentNode)) {
          wrappedTextNodes.push({
            key,
            element: { ...parentNode, children: [textNode] },
          });

          break;
        }

        wrappedTextNodes.push({
          key,
          element: {
            type: ELEMENT_PARAGRAPH,
            align: TextAlign.LEFT,
            children: [textNode],
          },
        });

        break;
      }
    }

    data.setData('text/plain', selectedTextEntries.map(([node]) => node.text).join(' '));

    data.setData(
      'application/x-slate-fragment',
      window.btoa(encodeURIComponent(JSON.stringify(wrappedTextNodes.map(({ element }) => element)))),
    );
  };

  return editor;
};

const isSimpleElement = (node: TElement): node is SimpleElements => SIMPLE_ELEMENTS.has(node.type);

const removeCommentMarks = (textNode: TText) => {
  const cleanTextNode = { ...textNode };

  for (const prop of Object.keys(cleanTextNode)) {
    if (prop.startsWith(COMMENT_PREFIX)) {
      delete cleanTextNode[prop];
    }
  }

  return cleanTextNode;
};

export const createCopyPlugin = createPluginFactory<AnyObject, EditorValue, RichTextEditor>({
  key: 'copy',
  withOverrides,
});
