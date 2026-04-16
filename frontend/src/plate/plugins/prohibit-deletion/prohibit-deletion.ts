import { createPlatePlugin, type OverrideEditor } from 'platejs/react';
import type { EditorFragmentDeletionOptions } from 'slate';
import {
  handleDeleteBackwardInFullmektig,
  handleDeleteForwardInFullmektig,
} from '@/plate/plugins/prohibit-deletion/fullmektig';
import {
  handleDeleteBackwardIntoUnchangeable,
  handleDeleteForwardIntoUnchangeable,
  handleDeleteInsidePlaceholder,
  handleDeleteInsideUnchangeable,
} from '@/plate/plugins/prohibit-deletion/unchangeable';
import {
  handleDeleteBackwardInUndeletable,
  handleDeleteForwardInUndeletable,
} from '@/plate/plugins/prohibit-deletion/undeletable';
import { isUnchangeable } from '@/plate/utils/queries';

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

/**
 * Input types that mutate the document content.
 * Preventing the native `beforeinput` event for these types blocks both
 * the browser's DOM mutation and Slate's deferred processing.
 */
const MUTATING_INPUT_TYPES = new Set([
  'insertText',
  'insertReplacementText',
  'insertFromPaste',
  'insertFromDrop',
  'insertFromYank',
  'insertTranspose',
  'insertCompositionText',
  'insertFromComposition',
  'insertParagraph',
  'insertLineBreak',
  'insertOrderedList',
  'insertUnorderedList',
  'insertHorizontalRule',
  'insertLink',
  'deleteWordBackward',
  'deleteWordForward',
  'deleteSoftLineBackward',
  'deleteSoftLineForward',
  'deleteEntireSoftLine',
  'deleteHardLineBackward',
  'deleteHardLineForward',
  'deleteByDrag',
  'deleteByCut',
  'deleteContent',
  'deleteContentBackward',
  'deleteContentForward',
  'formatBold',
  'formatItalic',
  'formatUnderline',
]);

export const ProhibitDeletionPlugin = createPlatePlugin({
  key: 'prohibit-deletion',
  handlers: {
    /**
     * Intercept native `beforeinput` events to prevent edits in unchangeable elements.
     *
     * Slate's `_native` optimization allows the browser to insert characters directly into the DOM
     * before Slate processes the edit. When ProhibitDeletionPlugin's `insertText` override blocks
     * the deferred Slate operation, the DOM mutation is not reverted (Slate's `restoreDOM` skips
     * `characterData` mutations). This handler prevents the native DOM mutation from happening
     * in the first place by calling `preventDefault()` on the original event.
     *
     * Returning `true` tells Plate's pipeHandler to signal Slate that the event was handled,
     * causing Slate to skip its entire `beforeinput` processing (including the `_native` flag).
     */
    onDOMBeforeInput: ({ editor, event }) => {
      if (!isSyntheticInputEvent(event)) {
        return;
      }

      if (!MUTATING_INPUT_TYPES.has(event.nativeEvent.inputType)) {
        return;
      }

      if (isUnchangeable(editor)) {
        event.preventDefault();

        return true;
      }
    },
  },
}).overrideEditor(withOverrides);

interface SyntheticInputEvent extends Event {
  nativeEvent: InputEvent;
}

const isSyntheticInputEvent = (event: Event): event is SyntheticInputEvent =>
  'nativeEvent' in event && event.nativeEvent instanceof InputEvent;
