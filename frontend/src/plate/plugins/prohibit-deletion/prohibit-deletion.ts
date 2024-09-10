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
import type { EditorValue, RichTextEditor } from '@app/plate/types';
import { isUnchangeable } from '@app/plate/utils/queries';
import { type AnyObject, createPluginFactory } from '@udecode/plate-common';
import type { EditorFragmentDeletionOptions, TextUnit } from 'slate';

const withOverrides = (editor: RichTextEditor) => {
  const { deleteBackward, deleteForward, deleteFragment, insertFragment, insertText, addMark } = editor;

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
