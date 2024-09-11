import { AnyObject, createPluginFactory, findNode, insertElements } from '@udecode/plate-common';
import { EditorFragmentDeletionOptions, EditorNormalizeOptions, TextUnit } from 'slate';
import { ELEMENT_FOOTER, UNINTERACTIONABLE } from '@app/plate/plugins/element-types';
import {
  handleDeleteBackwardInPlaceholder,
  handleDeleteForwardInPlaceholder,
} from '@app/plate/plugins/prohibit-deletion/helpers';
import {
  handleDeleteBackwardIntoUnchangeable,
  handleDeleteForwardIntoUnchangeable,
  handleDeleteInsideUnchangeable,
} from '@app/plate/plugins/prohibit-deletion/unchangeable';
import {
  handleDeleteBackwardInUndeletable,
  handleDeleteForwardInUndeletable,
} from '@app/plate/plugins/prohibit-deletion/undeletable';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { EditorValue, RichTextEditor } from '@app/plate/types';
import { isOfElementTypesFn, isUnchangeable } from '@app/plate/utils/queries';

const withOverrides = (editor: RichTextEditor) => {
  const { deleteBackward, deleteForward, deleteFragment, insertFragment, insertText, addMark, normalize } = editor;

  editor.insertText = (text, options) => {
    if (isUnchangeable(editor)) {
      return;
    }

    return insertText(text, options);
  };

  editor.addMark = (key, value) => {
    if (isUnchangeable(editor)) {
      return;
    }

    return addMark(key, value);
  };

  editor.deleteBackward = (unit: TextUnit) => {
    if (handleDeleteInsideUnchangeable(editor, 'backward', unit)) {
      return;
    }

    if (handleDeleteBackwardInPlaceholder(editor)) {
      return;
    }

    if (handleDeleteBackwardInUndeletable(editor)) {
      return;
    }

    if (handleDeleteBackwardIntoUnchangeable(editor)) {
      return;
    }

    deleteBackward(unit);
  };

  editor.deleteForward = (unit: TextUnit) => {
    if (handleDeleteInsideUnchangeable(editor, 'forward', unit)) {
      return;
    }

    if (handleDeleteForwardInPlaceholder(editor)) {
      return;
    }

    if (handleDeleteForwardInUndeletable(editor)) {
      return;
    }

    if (handleDeleteForwardIntoUnchangeable(editor)) {
      return;
    }

    deleteForward(unit);
  };

  editor.deleteFragment = (options: EditorFragmentDeletionOptions | undefined) => {
    if (isUnchangeable(editor)) {
      return;
    }

    return deleteFragment(options);
  };

  editor.normalize = (options: EditorNormalizeOptions | undefined) => {
    if (editor.children.length === 0 || editor.children.every(isOfElementTypesFn(UNINTERACTIONABLE))) {
      const footerEntry = findNode(editor, { match: { type: ELEMENT_FOOTER } });

      const at = footerEntry === undefined ? [editor.children.length] : footerEntry[1];

      return insertElements(editor, createSimpleParagraph(), { select: true, at });
    }

    normalize(options);
  };

  editor.insertFragment = (fragment) => {
    if (isUnchangeable(editor)) {
      return;
    }

    return insertFragment(fragment);
  };

  return editor;
};

export const createProhibitDeletionPlugin = createPluginFactory<AnyObject, EditorValue, RichTextEditor>({
  key: 'prohibit-deletion',
  withOverrides,
});
