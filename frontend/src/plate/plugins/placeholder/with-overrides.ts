import { EMPTY_CHAR_CODE } from '@app/functions/remove-empty-char-in-text';
import { getPlaceholderEntry, isPlaceholderInMaltekst } from '@app/plate/plugins/placeholder/queries';
import {
  type PlateEditor,
  type TDescendant,
  type TRange,
  type TText,
  findNode,
  insertNodes,
  isEdgePoint,
  isElement,
} from '@udecode/plate-common';
import { Path } from 'slate';
import type { MaltekstElement, PlaceholderElement } from '../../types';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '../element-types';

const EMPTY_CHAR = String.fromCharCode(EMPTY_CHAR_CODE);

const extractText = (fragment: TDescendant[]): TText[] =>
  fragment.flatMap((node, index) => {
    if (isElement(node)) {
      return extractText(index === fragment.length - 1 ? node.children : [...node.children, { text: '\n' }]);
    }

    return node;
  });

export const withOverrides = (editor: PlateEditor) => {
  const {
    setSelection,
    insertBreak,
    insertSoftBreak,
    insertNode,
    setNodes,
    insertFragment,
    deleteBackward,
    deleteForward,
  } = editor;

  editor.deleteBackward = (unit) => {
    const placeholderEntry = getPlaceholderEntry(editor);

    const offset = editor.selection?.anchor.offset;

    // Normally we would check offset > 0, but remember that placeholders starts with an empty char
    if (placeholderEntry === undefined || offset === undefined || offset > 1) {
      return deleteBackward(unit);
    }

    const [node, path] = placeholderEntry;

    const [firstChild] = node.children;
    const isEmpty = node.children.length === 1 && firstChild !== undefined && firstChild.text === EMPTY_CHAR;

    if (isEmpty) {
      return editor.delete({ at: path });
    }

    deleteBackward(unit);
  };

  editor.deleteForward = (unit) => {
    const placeholderEntry = getPlaceholderEntry(editor);

    if (editor.selection === null || placeholderEntry === undefined) {
      return deleteForward(unit);
    }

    const isAtEdge = isEdgePoint(editor, editor.selection.focus, placeholderEntry[1]);

    if (!isAtEdge) {
      return deleteForward(unit);
    }

    const [node, path] = placeholderEntry;

    const [firstChild] = node.children;
    const isEmpty = node.children.length === 1 && firstChild !== undefined && firstChild.text === EMPTY_CHAR;

    if (isEmpty) {
      return editor.delete({ at: path });
    }

    deleteForward(unit);
  };

  editor.setNodes = (props, options) => {
    const maltekst = findNode<MaltekstElement>(editor, { match: { type: ELEMENT_MALTEKST } });

    if (maltekst !== undefined && 'type' in props) {
      return;
    }

    setNodes(props, options);
  };

  editor.insertBreak = () => {
    const placeholder = getPlaceholderEntry(editor);

    if (placeholder !== undefined) {
      return;
    }

    insertBreak();
  };

  editor.insertSoftBreak = () => {
    const placeholder = getPlaceholderEntry(editor);

    if (placeholder !== undefined) {
      return;
    }

    insertSoftBreak();
  };

  editor.insertNode = (node) => {
    const placeholder = getPlaceholderEntry(editor);

    if (placeholder !== undefined) {
      return;
    }

    insertNode(node);
  };

  editor.insertFragment = (fragment: TDescendant[]) => {
    if (editor.selection === null) {
      return insertFragment(fragment);
    }

    const activeNode = findNode<PlaceholderElement>(editor, {
      at: editor.selection,
      match: { type: ELEMENT_PLACEHOLDER },
    });

    if (activeNode === undefined) {
      return insertFragment(fragment);
    }

    const [placeholder] = activeNode;

    // Fixes fragments being pasted outside of placeholder
    if (placeholder.type === ELEMENT_PLACEHOLDER) {
      insertNodes(editor, extractText(fragment));
    }
  };

  // Chrome: Marking content from start to end (with Shift + Ctrl/nd) would leave a selection hanging outside the placeholder,
  // causing it to seemingly not be deletable
  editor.setSelection = ({ anchor, focus }) => {
    if (anchor === undefined || focus === undefined) {
      return setSelection({ anchor, focus });
    }

    const range: TRange = { anchor, focus };

    const placeholder = getPlaceholderEntry(editor);

    if (placeholder === undefined) {
      return setSelection(range);
    }

    const [node, path] = placeholder;

    if (isPlaceholderInMaltekst(editor, path)) {
      if (Path.equals(anchor.path, focus.path)) {
        return setSelection(range);
      }

      const lastIndex = node.children.length - 1;

      const offset = node.children[lastIndex]?.text.length ?? 0;
      const newPath = anchor.path.slice(0, -1).concat(lastIndex);

      return setSelection({ anchor, focus: { path: newPath, offset } });
    }

    return setSelection(range);
  };

  return editor;
};
