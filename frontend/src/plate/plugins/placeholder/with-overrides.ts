import { EMPTY_CHAR_CODE } from '@app/functions/remove-empty-char-in-text';
import { getPlaceholderEntry, isPlaceholderInMaltekst } from '@app/plate/plugins/placeholder/queries';
import {
  type PlateEditor,
  type TDescendant,
  type TRange,
  type TText,
  findNode,
  getLastChildPath,
  getNextNode,
  getNode,
  getPreviousNode,
  insertNodes,
  isEdgePoint,
  isElement,
  isEndPoint,
  isText,
  setSelection,
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

const deleteBackwardFromInside = (editor: PlateEditor): boolean => {
  const placeholderEntry = getPlaceholderEntry(editor);

  const offset = editor.selection?.anchor.offset;

  // Normally we would check offset > 0, but remember that placeholders starts with an empty char
  if (placeholderEntry === undefined || offset === undefined || offset > 1) {
    return false;
  }

  const [node, path] = placeholderEntry;

  const [firstChild] = node.children;
  const isEmpty = node.children.length === 1 && firstChild !== undefined && firstChild.text === EMPTY_CHAR;

  if (isEmpty) {
    editor.delete({ at: path });

    return true;
  }

  return false;
};

const deleteBackwardFromOutside = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const isStart = editor.selection.focus.offset === 0;
  const prevNode = getPreviousNode<PlaceholderElement>(editor, {
    at: editor.selection.focus.path,
    match: (n) => isElement(n) && n.type === ELEMENT_PLACEHOLDER,
  });

  if (!isStart || prevNode === undefined) {
    return false;
  }

  const [node, path] = prevNode;

  const [firstChild] = node.children;
  const isEmpty = node.children.length === 1 && firstChild !== undefined && firstChild.text === EMPTY_CHAR;

  if (isEmpty) {
    editor.delete({ at: path });

    return true;
  }

  const lastChildPath = getLastChildPath(prevNode);
  const lastChild = getNode(editor, lastChildPath);

  if (lastChild === null || !isText(lastChild)) {
    return false;
  }

  const newSelection = { path: lastChildPath, offset: lastChild.text.length };

  setSelection(editor, { focus: newSelection, anchor: newSelection });

  return false;
};

const deleteForwardFromInside = (editor: PlateEditor): boolean => {
  const placeholderEntry = getPlaceholderEntry(editor);

  if (editor.selection === null || placeholderEntry === undefined) {
    return false;
  }

  const isAtEdge = isEdgePoint(editor, editor.selection.focus, placeholderEntry[1]);

  if (!isAtEdge) {
    return false;
  }

  const [node, path] = placeholderEntry;

  const [firstChild] = node.children;
  const isEmpty = node.children.length === 1 && firstChild !== undefined && firstChild.text === EMPTY_CHAR;

  if (isEmpty) {
    editor.delete({ at: path });

    return true;
  }

  return false;
};

const deleteForwardFromOutside = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const isEnd = isEndPoint(editor, editor.selection.focus, editor.selection.focus.path);
  // TODO: Litt for ivrig på å finne placeholder. Må kun finne nextnode om den er helt inntil selection,
  // ellers vil den slette neste placeholder i hele dokumentet
  const nextNode = getNextNode<PlaceholderElement>(editor, {
    at: editor.selection.focus.path,
    match: (n) => isElement(n) && n.type === ELEMENT_PLACEHOLDER,
  });

  if (!isEnd || nextNode === undefined) {
    return false;
  }

  const [node, path] = nextNode;

  const [firstChild] = node.children;
  const isEmpty = node.children.length === 1 && firstChild !== undefined && firstChild.text === EMPTY_CHAR;

  if (isEmpty) {
    editor.delete({ at: path });

    return true;
  }

  if (firstChild === undefined) {
    return false;
  }

  const newSelection = { path: [...path, 0], offset: 0 };

  setSelection(editor, { focus: newSelection, anchor: newSelection });

  return false;
};

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
    if (deleteBackwardFromInside(editor)) {
      return;
    }

    if (deleteBackwardFromOutside(editor)) {
      return;
    }

    deleteBackward(unit);
  };

  editor.deleteForward = (unit) => {
    if (deleteForwardFromInside(editor)) {
      return;
    }

    if (deleteForwardFromOutside(editor)) {
      return;
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
