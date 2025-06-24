import {
  handleDeleteBackwardFromInside,
  handleDeleteBackwardFromOutside,
  handleDeleteForwardFromInside,
  handleDeleteForwardFromOutside,
} from '@app/plate/plugins/placeholder/delete';
import { getPlaceholderEntry, isPlaceholderInMaltekst } from '@app/plate/plugins/placeholder/queries';
import type { OverrideEditor } from '@platejs/core/react';
import { type Descendant, ElementApi, type TRange, type TText } from 'platejs';
import { Path } from 'slate';
import type { MaltekstElement, PlaceholderElement } from '../../types';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '../element-types';

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
    const placeholder = getPlaceholderEntry(editor);

    if (placeholder !== undefined) {
      return;
    }

    insertBreak();
  };

  editor.tf.insertSoftBreak = () => {
    const placeholder = getPlaceholderEntry(editor);

    if (placeholder !== undefined) {
      return;
    }

    insertSoftBreak();
  };

  editor.tf.insertNode = (node) => {
    const placeholder = getPlaceholderEntry(editor);

    if (placeholder !== undefined) {
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
  editor.tf.setSelection = ({ anchor, focus }) => {
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
