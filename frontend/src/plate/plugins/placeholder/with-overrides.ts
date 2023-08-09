import { TRange, findNode } from '@udecode/plate-common';
import { Path } from 'slate';
import { getPlaceholderEntry, isPlaceholderInMaltekst } from '@app/plate/plugins/placeholder/queries';
import { MaltekstElement, RichTextEditor } from '../../types';
import { ELEMENT_MALTEKST } from '../element-types';

export const withOverrides = (editor: RichTextEditor) => {
  const { setSelection, insertBreak, insertSoftBreak, insertNode, setNodes } = editor;

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

  // Chrome: Marking content from start to end (with Shift + Ctrl/End ) would leave a selection hanging outside the placeholder,
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
