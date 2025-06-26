import {
  handleDeleteBackwardInFullmektig,
  handleDeleteForwardInFullmektig,
} from '@app/plate/plugins/prohibit-deletion/fullmektig';
import {
  handleDeleteBackwardIntoUnchangeable,
  handleDeleteForwardIntoUnchangeable,
  handleDeleteInsidePlaceholder,
  handleDeleteInsideUnchangeable,
} from '@app/plate/plugins/prohibit-deletion/unchangeable';
import {
  handleDeleteBackwardInUndeletable,
  handleDeleteForwardInUndeletable,
} from '@app/plate/plugins/prohibit-deletion/undeletable';
import { isUnchangeable } from '@app/plate/utils/queries';
import { createPlatePlugin, type OverrideEditor } from '@platejs/core/react';
import type { EditorFragmentDeletionOptions } from 'slate';

const withOverrides: OverrideEditor = ({ editor }) => {
  const { deleteBackward, deleteForward, deleteFragment, insertFragment, insertText, addMark, delete: del } = editor.tf;

  editor.tf.insertText = (text, options) => {
    if (isUnchangeable(editor)) {
      return;
    }

    return insertText(text, options);
  };

  editor.tf.addMark = (key, value) => {
    if (isUnchangeable(editor)) {
      return;
    }

    return addMark(key, value);
  };

  editor.tf.delete = (options) => {
    const backward = options?.reverse === true;

    if (handleDeleteInsidePlaceholder(editor, backward)) {
      return;
    }

    if (backward) {
      if (handleDeleteBackwardInFullmektig(editor)) {
        return;
      }
    } else if (handleDeleteForwardInFullmektig(editor)) {
      return;
    }

    return del(options);
  };

  editor.tf.deleteBackward = (unit) => {
    if (handleDeleteInsideUnchangeable(editor, 'backward', unit)) {
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

  editor.tf.deleteForward = (unit) => {
    if (handleDeleteInsideUnchangeable(editor, 'forward', unit)) {
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

  editor.tf.deleteFragment = (options: EditorFragmentDeletionOptions | undefined) => {
    if (isUnchangeable(editor)) {
      return;
    }

    return deleteFragment(options);
  };

  editor.tf.insertFragment = (fragment) => {
    if (isUnchangeable(editor)) {
      return;
    }

    return insertFragment(fragment);
  };

  return editor;
};

export const ProhibitDeletionPlugin = createPlatePlugin({ key: 'prohibit-deletion' }).overrideEditor(withOverrides);
