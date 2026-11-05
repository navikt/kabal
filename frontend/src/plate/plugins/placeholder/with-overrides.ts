import { type Descendant, ElementApi, NodeApi, PathApi, RangeApi, TextApi, type TText } from 'platejs';
import type { OverrideEditor, PlateEditor } from 'platejs/react';
import { getHasNoVisibleText, isMarkKey } from '@/plate/components/placeholder/helpers';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '@/plate/plugins/element-types';
import {
  handleDeleteBackwardFromInside,
  handleDeleteBackwardFromOutside,
  handleDeleteForwardFromInside,
  handleDeleteForwardFromOutside,
} from '@/plate/plugins/placeholder/delete';
import { getPlaceholderEntry, isPlaceholderInMaltekst } from '@/plate/plugins/placeholder/queries';
import type { MaltekstElement, PlaceholderElement } from '@/plate/types';
import { isHeading, isPlaceholderActive } from '@/plate/utils/queries';

const extractText = (fragment: Descendant[]): TText[] =>
  fragment.flatMap((node, index) => {
    if (ElementApi.isElement(node)) {
      return extractText(index === fragment.length - 1 ? node.children : [...node.children, { text: '\n' }]);
    }

    return node;
  });

export const withOverrides: OverrideEditor = ({ editor }) => {
  const {
    setSelection,
    insertBreak,
    insertSoftBreak,
    insertNode,
    setNodes,
    insertFragment,
    deleteBackward,
    deleteForward,
    addMark,
    removeMark,
  } = editor.tf;

  editor.tf.deleteBackward = (unit) => {
    if (handleDeleteBackwardFromInside(editor)) {
      return;
    }

    if (handleDeleteBackwardFromOutside(editor)) {
      return;
    }

    deleteBackward(unit);
  };

  editor.tf.deleteForward = (unit) => {
    if (handleDeleteForwardFromInside(editor)) {
      return;
    }

    if (handleDeleteForwardFromOutside(editor)) {
      return;
    }

    deleteForward(unit);
  };

  editor.tf.setNodes = (props, options) => {
    const maltekst = editor.api.node<MaltekstElement>({ match: { type: ELEMENT_MALTEKST } });

    if (maltekst !== undefined && 'type' in props) {
      return;
    }

    setNodes(props, options);
  };

  editor.tf.insertBreak = () => {
    if (isPlaceholderActive(editor)) {
      return;
    }

    insertBreak();
  };

  editor.tf.insertSoftBreak = () => {
    if (isPlaceholderActive(editor)) {
      return;
    }

    insertSoftBreak();
  };

  editor.tf.insertNode = (node) => {
    if (TextApi.isText(node)) {
      return insertNode(node);
    }

    if (isPlaceholderActive(editor)) {
      return;
    }

    insertNode(node);
  };

  editor.tf.insertFragment = (fragment: Descendant[]) => {
    if (editor.selection === null) {
      return insertFragment(fragment);
    }

    const activeNode = editor.api.node<PlaceholderElement>({
      at: editor.selection,
      match: { type: ELEMENT_PLACEHOLDER },
    });

    if (activeNode === undefined) {
      return insertFragment(fragment);
    }

    const [placeholder] = activeNode;

    // Fixes fragments being pasted outside of placeholder
    if (placeholder.type === ELEMENT_PLACEHOLDER) {
      editor.tf.insertNodes(extractText(fragment));
    }
  };

  // Chrome: Marking content from start to end (with Shift + Ctrl/nd) would leave a selection hanging outside the placeholder,
  // causing it to seemingly not be deletable
  editor.tf.setSelection = (range) => {
    const { anchor, focus } = range;

    if (anchor === undefined || focus === undefined) {
      return setSelection(range);
    }

    const placeholder = getPlaceholderEntry(editor);

    if (placeholder === undefined) {
      return setSelection(range);
    }

    const [node, path] = placeholder;

    if (isPlaceholderInMaltekst(editor, path)) {
      if (PathApi.equals(anchor.path, focus.path)) {
        return setSelection(range);
      }

      const lastIndex = node.children.length - 1;

      const offset = node.children[lastIndex]?.text.length ?? 0;
      const newPath = anchor.path.slice(0, -1).concat(lastIndex);

      return setSelection({ anchor, focus: { path: newPath, offset } });
    }

    return setSelection(range);
  };

  editor.tf.addMark = (key, value) => {
    if (!setMarkInEmptyPlaceholder(editor, key, value)) {
      addMark(key, value);
    }
  };

  editor.tf.removeMark = (key) => {
    if (!setMarkInEmptyPlaceholder(editor, key, undefined)) {
      removeMark(key);
    }
  };

  return editor;
};

const setMarkInEmptyPlaceholder = (editor: PlateEditor, key: string, value: true | undefined): boolean => {
  if (!isMarkKey(editor, key) || editor.selection === null || RangeApi.isExpanded(editor.selection)) {
    return false;
  }

  if (editor.api.some({ match: isHeading })) {
    return false;
  }

  const entry = getPlaceholderEntry(editor);

  if (entry === undefined || !getHasNoVisibleText(NodeApi.string(entry[0]))) {
    return false;
  }

  editor.tf.setNodes({ [key]: value }, { at: entry[1], match: TextApi.isText });
  editor.marks = null;

  return true;
};
