import {
  handleDeleteBackwardInFullmektig,
  handleDeleteForwardInFullmektig,
} from '@app/plate/plugins/prohibit-deletion/fullmektig';
import {
  handleDeleteBackwardIntoUnchangeable,
  handleDeleteForwardIntoUnchangeable,
  handleDeleteInsideUnchangeable,
} from '@app/plate/plugins/prohibit-deletion/unchangeable';
import {
  handleDeleteBackwardInUndeletable,
  handleDeleteForwardInUndeletable,
} from '@app/plate/plugins/prohibit-deletion/undeletable';
import { isUnchangeable } from '@app/plate/utils/queries';
import { type PlateEditor, createPlatePlugin } from '@udecode/plate-core/react';
import type { EditorFragmentDeletionOptions, TextUnit } from 'slate';

const withOverrides = (editor: PlateEditor) => {
  const { deleteBackward, deleteForward, deleteFragment, insertFragment, insertText, addMark, delete: del } = editor;

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

  editor.delete = (options) => {
    const backward = options?.reverse === true;

    if (backward) {
      if (handleDeleteBackwardInFullmektig(editor)) {
        return;
      }
    } else if (handleDeleteForwardInFullmektig(editor)) {
      return;
    }

    return del(options);
  };

  editor.deleteBackward = (unit: TextUnit) => {
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

  editor.deleteForward = (unit: TextUnit) => {
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

export const ProhibitDeletionPlugin = createPlatePlugin({
  key: 'prohibit-deletion',
  extendEditor: ({ editor }) => withOverrides(editor),
});
