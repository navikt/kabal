import { RangeApi } from 'platejs';
import { createPlatePlugin, type PlateEditor } from 'platejs/react';
import { isMetaKey, Keys } from '@/keys';
import { cleanupWhitespaceIssues } from '@/plate/plugins/cleanup/cleanup-whitespace';
import { normalizeNonStandardSpaces } from '@/plate/plugins/cleanup/normalize-non-standard-spaces';
import { removeEmptyElements } from '@/plate/plugins/cleanup/remove-empty-elements/remove-empty-elements';

export const CleanupDocumentPlugin = createPlatePlugin({
  key: 'cleanup-document',
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (event.key.toLowerCase() === Keys.K && isMetaKey(event) && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        cleanupDocument(editor);
      }
    },
  },
});

/** Clean up the document or the selected range. Triggered by Ctrl/Cmd+K. Undoable. */
export const cleanupDocument = (editor: PlateEditor): void => {
  const { selection } = editor;
  const isExpanded = selection !== null && RangeApi.isExpanded(selection);

  // When selection is expanded, only clean within it. Otherwise, clean the whole document.
  const at = isExpanded ? selection : undefined;

  // When selection is collapsed, skip the caret's element to keep the caret in place.
  const caretPath = isExpanded ? null : (selection?.anchor.path ?? null);

  // Track selection through text transforms (insertText, delete) which move the caret as a side effect.
  const selectionRef = selection !== null ? editor.api.rangeRef(selection) : null;

  editor.tf.withoutNormalizing(() => {
    normalizeNonStandardSpaces(editor, at);
    cleanupWhitespaceIssues(editor, at);
    removeEmptyElements(editor, at, caretPath);
  });

  editor.tf.normalize({ force: true });

  const restored = selectionRef?.unref();

  if (restored !== null && restored !== undefined) {
    editor.tf.select(restored);
  }
};
